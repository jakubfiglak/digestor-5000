import { clerkClient } from '@clerk/nextjs';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { client } from '@/sanity/client';

import { resourceDetailsSchema, resourceSchema } from './schemas';

export const cacheTags = {
  list: 'resources-list',
} as const;

async function enhanceResourcesWithSubmitterData<
  T extends { submitterId?: string | null },
>(
  resources: Array<T>
): Promise<Array<T & { submitter?: { id: string; avatarUrl: string } }>> {
  const users = await clerkClient.users.getUserList();

  return resources.map((resource) => {
    const submitter = resource.submitterId
      ? users.find((user) => user.id === resource.submitterId)
      : null;

    if (!submitter) {
      return resource;
    }

    return {
      ...resource,
      submitter: {
        id: submitter.id,
        email: submitter.emailAddresses[0]?.emailAddress,
      },
    };
  });
}

const resourceFields = groq`
  "id": _id,
  title,
  "slug": slug.current,
  description,
  image {
    ...
  },
  type,
  url,
  "createdAt": _createdAt,
  scheduledForPublishing,
  "tags": tags[]->{title, "slug": slug.current},
  "articles": *[_type == "article" && references(^._id)] {
    "id": _id,
    title,
    "slug": slug.current
  },
  submitterId
`;

const resourcesListQuery = groq`*[_type == "resource"] | order(_createdAt desc)[0...$limit] {
  ${resourceFields}
}`;

export async function getResourcesList(limit = 10000) {
  const data = await client.fetch(
    resourcesListQuery,
    { limit },
    { next: { tags: [cacheTags.list] } }
  );

  const dataWithUsers = await enhanceResourcesWithSubmitterData(data);
  return z.array(resourceDetailsSchema).parse(dataWithUsers);
}

const resourcesListByTagQuery = groq`*[_type == "resource" && references(*[_type == 'tag' && slug.current == $slug]._id)] | order(_createdAt desc)[0...$limit] {
  ${resourceFields}
}`;

export async function getResourcesListByTag(slug: string, limit = 10000) {
  const data = await client.fetch(
    resourcesListByTagQuery,
    { slug, limit },
    { next: { tags: [cacheTags.list] } }
  );

  const dataWithUsers = await enhanceResourcesWithSubmitterData(data);
  return z.array(resourceDetailsSchema).parse(dataWithUsers);
}

const resourcesListByUrlQuery = groq`*[_type == 'resource' && url == $url] {
  "id": _id
}`;

export async function getResourcesListByUrl(url: string) {
  const data = await client.fetch(
    resourcesListByUrlQuery,
    { url },
    { next: { tags: [cacheTags.list] } }
  );

  return z.array(z.object({ id: z.string() })).parse(data);
}

const resourcesListBySlugQuery = groq`*[_type == 'resource' && slug.current == $slug] {
  "id": _id
}`;

export async function getResourcesListBySlug(slug: string) {
  const data = await client.fetch(
    resourcesListBySlugQuery,
    { slug },
    { next: { tags: [cacheTags.list] } }
  );

  return z.array(z.object({ id: z.string() })).parse(data);
}

const resourcesListForArticleScaffoldQuery = groq`*[_type == 'resource' && scheduledForPublishing == true] {
  "id": _id,
  title,
  description,
  url,
  type,
  "articles": *[_type == "article" && references(^._id)] {
    "id": _id,
  },
}`;

export async function getResourcesListForArticleScaffold() {
  const data = await client.fetch(
    resourcesListForArticleScaffoldQuery,
    {},
    { next: { tags: [cacheTags.list] } }
  );

  return z.array(resourceSchema).parse(data);
}
