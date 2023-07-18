import { groq } from 'next-sanity';
import { z } from 'zod';

import { client } from '@/sanity/client';

import { resourceSchema } from './schemas';

const resourcesListQuery = groq`*[_type == "resource"] | order(_createdAt desc)[0...$limit] {
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
}`;

export async function getResourcesList(limit = 10000) {
  const data = await client.fetch(resourcesListQuery, { limit });
  return z.array(resourceSchema).parse(data);
}
