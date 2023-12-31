import { groq } from 'next-sanity';
import { z } from 'zod';

import {
  articleDetailsSchema,
  articleSchema,
} from '@/modules/articles/schemas';
import { clientFetch } from '@/sanity/client';

const coreArticleFields = groq`
  "id": _id,
  title,
  excerpt,
  "slug": slug.current,
  "createdAt": _createdAt,
  "readTime": round(length(pt::text(content)) / 5 / 180 )
`;

const articlesListQuery = groq`*[_type == "article"] | order(_createdAt desc)[0...$limit] {
  ${coreArticleFields}
}`;

export async function getArticlesList(limit = 10000) {
  const data = await clientFetch(articlesListQuery, { limit });
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
      },
      _type == 'internalLink' => {
        "slug": @.reference->slug.current
      },
      _type == 'link' => {
        href,
        blank
      }
    }
  }
`;

const articleQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  ${articleDetailsFields}
}`;

export async function getArticle(slug: string) {
  const data = await clientFetch(articleQuery, { slug });
  return articleDetailsSchema.parse(data);
}

const articlesDetailsListQuery = groq`*[_type == "article"] {
  ${articleDetailsFields}
}`;

export async function getArticlesDetailsList() {
  const data = await clientFetch(articlesDetailsListQuery);
  return z.array(articleDetailsSchema).parse(data);
}

const articleSlugsListQuery = groq`*[_type == "article"] {
  "slug": slug.current
}`;

export async function getArticleSlugsList() {
  const data = await clientFetch(articleSlugsListQuery);
  return z.array(z.object({ slug: z.string() })).parse(data);
}

const articlesListBySlugQuery = groq`*[_type == 'article' && slug.current == $slug] {
  "id": _id
}`;

export async function getArticlesListBySlug(slug: string) {
  const data = await clientFetch(articlesListBySlugQuery, { slug });
  return z.array(z.object({ id: z.string() })).parse(data);
}
