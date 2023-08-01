'use server';

import { auth } from '@clerk/nextjs';
import slugify from 'slugify';
import { z } from 'zod';

import { client } from '@/sanity/client';

import { getResourcesListBySlug, getResourcesListByUrl } from './api';
import type { ResourceType } from './schemas';

// ? DOCS: https://jsonlink.io/
const JSON_LINK_API_URL = 'https://jsonlink.io/api/extract';

const jsonLinkResponseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

async function getResourceMetadata(url: string) {
  const response = await fetch(`${JSON_LINK_API_URL}?url=${url}`);

  if (!response.ok) {
    return null;
  }

  const metadata = await response.json();

  const parsedMetadata = jsonLinkResponseSchema.safeParse(metadata);

  if (!parsedMetadata.success) {
    return null;
  }

  const { title, description, images } = parsedMetadata.data;

  return {
    title,
    image: images?.[0],
    description,
  };
}

async function getBufferFromRemoteFile(url: string) {
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.arrayBuffer();
    return Buffer.from(data);
  }

  return null;
}

type SubmitResourceArgs = {
  title: string;
  type: ResourceType;
  url: string;
};

export async function submitResource({ title, type, url }: SubmitResourceArgs) {
  const { userId } = auth();

  if (!userId) {
    return {
      success: false,
      message: 'You must be logged in to submit a resource',
    };
  }

  // Check if resource with the given URL already exists
  const existingResourcesByUrl = await getResourcesListByUrl(url);

  if (existingResourcesByUrl.length > 0) {
    return {
      success: false,
      message: 'Resource with the given URL already exists',
    };
  }

  // Generate slug and check if resource with the given slug already exists
  let slug = slugify(title, { lower: true });

  const existingResourcesBySlug = await getResourcesListBySlug(slug);

  // If resource with the given slug already exists, append a number to the slug
  if (existingResourcesBySlug.length > 0) {
    slug = `${slug}-${existingResourcesBySlug.length}`;
  }

  // Get article metadata
  const metadata = await getResourceMetadata(url);

  try {
    const resource = await client.create({
      _type: 'resource',
      title,
      description: metadata?.description ?? '',
      imageUrl: metadata?.image ?? '',
      slug: { current: slug },
      type,
      submitterId: userId,
      url,
    });

    return {
      success: true,
      message: 'Resource submitted successfully!',
      data: resource,
    };
  } catch (error) {
    return {
      success: false,
      message:
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Something went wrong, please try again later',
    };
  }
}
