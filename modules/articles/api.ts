import { groq } from 'next-sanity';
import { z } from 'zod';

import {
  articleDetailsSchema,
  articleSchema,
} from '@/modules/articles/schemas';
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

const articleQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  coverImage {
    ...
  },
  excerpt,
  content[] {
    ...,
    markDefs[] {
      ...,
      _type == 'resourceLink' => {
        "url": @.reference->url
      }
    }
  },
  "createdAt": _createdAt,
  "readTime": round(length(pt::text(content)) / 5 / 180 )
}`;

export async function getArticle(slug: string) {
  const data = await client.fetch(articleQuery, { slug });
  return articleDetailsSchema.parse(data);
}
