import { groq } from 'next-sanity';
import { z } from 'zod';

import { clientFetch } from '@/sanity/client';

import { tagSchema } from './schemas';

const tagQuery = groq`*[_type == "tag" && slug.current == $slug][0] {
  "id": _id,
  "slug": slug.current,
  title,
  description
}`;

export async function getTag(slug: string) {
  const data = await clientFetch(tagQuery, { slug });

  if (!data) {
    return null;
  }

  return tagSchema.parse(data);
}

const tagSlugsListQuery = groq`*[_type == "tag" ] {
  "slug": slug.current
}`;

export async function getTagsSlugList() {
  const data = await clientFetch(tagSlugsListQuery);
  return z.array(z.object({ slug: z.string() })).parse(data);
}
