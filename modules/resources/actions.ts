'use server';

import { auth } from '@clerk/nextjs';
import { revalidateTag } from 'next/cache';
import type { SanityImageAssetDocument } from 'next-sanity';
import slugify from 'slugify';

import { getBufferFromRemoteFile } from '@/lib/utils/get-buffer-from-remote-file';
import { getPageMetadata } from '@/lib/utils/get-page-metadata';
import { client } from '@/sanity/client';

import {
  cacheTags,
  getResourcesListBySlug,
  getResourcesListByUrl,
} from './api';
import type { ResourceType } from './schemas';

type UploadRemoteAssetToSanityArgs = {
  url: string;
  filename: string;
};

async function uploadRemoteAssetToSanity({
  url,
  filename,
}: UploadRemoteAssetToSanityArgs) {
  const buffer = await getBufferFromRemoteFile(url);

  if (!buffer) {
    return null;
  }

  const asset = await client.assets.upload('image', buffer, {
    filename,
  });

  return asset;
}

type SubmitResourceArgs = {
  url: string;
  type: ResourceType;
  title?: string;
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

  // Get article metadata
  const metadata = await getPageMetadata(url);

  // Get the resource title
  let finalTitle = metadata?.title || title;

  if (!finalTitle) {
    return {
      success: false,
      message:
        'You have not provided a title and we were not able to fetch it from the URL. Please provide a title',
    };
  }

  // Generate slug and check if resource with the given slug already exists
  let slug = slugify(finalTitle, { lower: true });

  const existingResourcesBySlug = await getResourcesListBySlug(slug);

  // If resource with the given slug already exists, append a number to the slug
  if (existingResourcesBySlug.length > 0) {
    slug = `${slug}-${existingResourcesBySlug.length}`;
  }

  // Upload image to Sanity
  let asset: SanityImageAssetDocument | undefined | null;

  if (metadata?.image) {
    asset = await uploadRemoteAssetToSanity({
      url: metadata.image,
      filename: slug,
    });
  }

  try {
    const resource = await client.create({
      _type: 'resource',
      title: finalTitle,
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

    revalidateTag(cacheTags.list);

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
