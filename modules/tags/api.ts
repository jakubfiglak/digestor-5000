import { groq } from 'next-sanity';
import { z } from 'zod';

import { client } from '@/sanity/client';

import { tagSchema } from './schemas';

const tagQuery = groq`*[_type == "tag" && slug.current == $slug][0] {
  "id": _id,
  "slug": slug.current,
  title,
  description
}`;

export async function getTag(slug: string) {
  const data = await client.fetch(tagQuery, { slug });
  return tagSchema.parse(data);
}

const tagSlugsListQuery = groq`*[_type == "tag" ] {
  "slug": slug.current
}`;

export async function getTagsSlugList() {
  const data = await client.fetch(tagSlugsListQuery);
  return z.array(z.object({ slug: z.string() })).parse(data);
}
