import { z } from 'zod';

import { env } from '@/env.mjs';

// ? DOCS: https://jsonlink.io/
const JSON_LINK_API_URL = 'https://jsonlink.io/api/extract';

const jsonLinkResponseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function getPageMetadata(url: string) {
  const response = await fetch(
    `${JSON_LINK_API_URL}?url=${url}&api_key=${env.JSON_LINK_API_KEY}`
  );

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
