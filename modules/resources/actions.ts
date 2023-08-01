'use server';

import { auth } from '@clerk/nextjs';
import type { SanityImageAssetDocument } from 'next-sanity';
import slugify from 'slugify';

import { getBufferFromRemoteFile, getPageMetadata } from '@/lib/utils';
import { client } from '@/sanity/client';

import { getResourcesListBySlug, getResourcesListByUrl } from './api';
import type { ResourceType } from './schemas';

type SubmitResourceArgs = {
  url: string;
  title: string;
  type: ResourceType;
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
  const metadata = await getPageMetadata(url);

  // Get image buffer and upload asset to Sanity
  let asset: SanityImageAssetDocument | undefined;

  if (metadata?.image) {
    const buffer = await getBufferFromRemoteFile(metadata.image);

    if (buffer) {
      asset = await client.assets.upload('image', buffer, {
        filename: slug,
      });
    }
  }

  try {
    const resource = await client.create({
      _type: 'resource',
      title: metadata?.title || title,
      description: metadata?.description ?? '',
      slug: { current: slug },
      type,
      submitterId: userId,
      url,
      ...(asset
        ? {
            image: {
              _type: 'image',
              asset: { _ref: asset._id },
              alt: metadata?.title || title,
            },
          }
        : {}),
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
