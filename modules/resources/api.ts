import { groq } from 'next-sanity';
import { z } from 'zod';

import { client } from '@/sanity/client';

import { resourceSchema } from './schemas';

const resourcesListQuery = groq`*[_type == "resource"] | order(_createdAt desc) {
  "id": _id,
  title,
  "slug": slug.current,
  description,
  type,
  url,
  "createdAt": _createdAt,
  "tags": tags[]->{title, "slug": slug.current},
  "articles": *[_type == "article" && references(^._id)] {
    "id": _id,
    title,
    "slug": slug.current
  }
}`;

export async function getResourcesList() {
  const data = await client.fetch(resourcesListQuery);
  return z.array(resourceSchema).parse(data);
}
