import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createClient } from 'next-sanity';
import { cache } from 'react';

import { env } from '@/env.mjs';

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  token: env.SANITY_SECRET_TOKEN,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION, // https://www.sanity.io/docs/api-versioning
  useCdn: false,
  studioUrl: '/studio',
  perspective: 'published',
});

export const clientFetch = cache(client.fetch.bind(client));

export function urlFor(source: SanityImageSource) {
  return imageUrlBuilder(client).image(source);
}
