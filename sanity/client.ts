import imageUrlBuilder from '@sanity/image-url';
import { createClient } from 'next-sanity';
import { cache } from 'react';

import { env } from '@/env.mjs';

const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION, // https://www.sanity.io/docs/api-versioning
  useCdn: false,
  studioUrl: '/studio',
});

export const client = {
  ...sanityClient,
  fetch: cache(sanityClient.fetch.bind(sanityClient)),
  imageUrlBuilder: imageUrlBuilder(sanityClient),
};
