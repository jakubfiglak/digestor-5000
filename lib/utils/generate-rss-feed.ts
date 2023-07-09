import { toHTML } from '@portabletext/to-html';
import { Feed } from 'feed';
import fs from 'fs';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { getSiteUrl } from '@/lib/utils/get-site-url';
import { client } from '@/sanity/client';

const articlesQuery = groq`*[_type == "article"] {
  "id": _id,
  title,
  "slug": slug.current,
  content,
  "createdAt": _createdAt 
}`;

const articlesSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.any(),
    createdAt: z.string(),
  })
);

async function getArticles() {
  const data = await client.fetch(articlesQuery);
  return articlesSchema.parse(data);
}

export async function generateRssFeed() {
  const siteUrl = getSiteUrl();

  const feed = new Feed({
    id: siteUrl,
    title: 'Frontend Digest | RSS Feed',
    description: 'Welcome to Frontend Digest!',
    link: siteUrl,
    copyright: `All rights reserved ${new Date().getFullYear()}, Frontend Digest`,
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
  });

  const articles = await getArticles();

  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      id: article.slug,
      link: `${siteUrl}/articles/${article.slug}`,
      description: article.title,
      date: new Date(article.createdAt),
      content: toHTML(article.content),
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
}
