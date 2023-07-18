import { groq } from 'next-sanity';
import { z } from 'zod';

import { articleSchema } from '@/modules/articles/schemas';
import { client } from '@/sanity/client';

const articlesListQuery = groq`*[_type == "article"] | order(_createdAt desc) {
  "id": _id,
  title,
  excerpt,
  "slug": slug.current,
  "createdAt": _createdAt,
  "readTime": round(length(pt::text(content)) / 5 / 180 )
}`;

export async function getArticlesList() {
  const data = await client.fetch(articlesListQuery);
  return z.array(articleSchema).parse(data);
}
