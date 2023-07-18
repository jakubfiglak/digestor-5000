import { groq } from 'next-sanity';
import { z } from 'zod';

import {
  articleDetailsSchema,
  articleSchema,
} from '@/modules/articles/schemas';
import { client } from '@/sanity/client';

const coreArticleFields = groq`
  "id": _id,
  title,
  excerpt,
  "slug": slug.current,
  "createdAt": _createdAt,
  "readTime": round(length(pt::text(content)) / 5 / 180 )
`;

const articlesListQuery = groq`*[_type == "article"] | order(_createdAt desc) {
  ${coreArticleFields}
}`;

export async function getArticlesList() {
  const data = await client.fetch(articlesListQuery);
  return z.array(articleSchema).parse(data);
}

const articleDetailsFields = groq`
  ${coreArticleFields},
  coverImage {
    ...
  },
  content[] {
    ...,
    markDefs[] {
      ...,
      _type == 'resourceLink' => {
        "url": @.reference->url
      }
    }
  }
`;

const articleQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  ${articleDetailsFields}
}`;

export async function getArticle(slug: string) {
  const data = await client.fetch(articleQuery, { slug });
  return articleDetailsSchema.parse(data);
}

const articlesDetailsListQuery = groq`*[_type == "article"] {
  ${articleDetailsFields}
}`;

export async function getArticlesDetailsList() {
  const data = await client.fetch(articlesDetailsListQuery);
  return z.array(articleDetailsSchema).parse(data);
}

const articleSlugsListQuery = groq`*[_type == "article"] {
  "slug": slug.current
}`;

export async function getArticleSlugsList() {
  const data = await client.fetch(articleSlugsListQuery);
  return z.array(z.object({ slug: z.string() })).parse(data);
}
