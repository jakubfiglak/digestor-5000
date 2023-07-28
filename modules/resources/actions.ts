'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

import { client } from '@/sanity/client';

import { getResourcesListBySlug, getResourcesListByUrl } from './api';
import type { ResourceType } from './schemas';

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

  try {
    const resource = await client.create({
      _type: 'resource',
      title,
      slug: { current: slug },
      type,
      submitterId: userId,
      url,
    });

    revalidatePath('/resources');

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
