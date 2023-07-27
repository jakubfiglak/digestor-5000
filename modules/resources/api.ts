import { groq } from 'next-sanity';
import { z } from 'zod';

import { clientFetch } from '@/sanity/client';

import { resourceSchema } from './schemas';

const resourceFields = groq`
  "id": _id,
  title,
  "slug": slug.current,
  description,
  type,
  url,
  "createdAt": _createdAt,
  scheduledForPublishing,
  "tags": tags[]->{title, "slug": slug.current},
  "articles": *[_type == "article" && references(^._id)] {
    "id": _id,
    title,
    "slug": slug.current
  }
`;

const resourcesListQuery = groq`*[_type == "resource"] | order(_createdAt desc)[0...$limit] {
  ${resourceFields}
}`;

export async function getResourcesList(limit = 10000) {
  const data = await clientFetch(resourcesListQuery, { limit });
  return z.array(resourceSchema).parse(data);
}

const resourcesListBySlugQuery = groq`*[_type == "resource" && references(*[_type == 'tag' && slug.current == $slug]._id)] | order(_createdAt desc)[0...$limit] {
  ${resourceFields}
}`;

export async function getResourcesListByTag(slug: string, limit = 10000) {
  const data = await clientFetch(resourcesListBySlugQuery, { slug, limit });
  return z.array(resourceSchema).parse(data);
}
