import { toHTML } from '@portabletext/to-html';
import { Feed } from 'feed';
import fs from 'fs';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { env } from '@/env.mjs';
import { getSiteUrl } from '@/lib/utils/get-site-url';
import { client } from '@/sanity/client';

const articlesQuery = groq`*[_type == "article"] {
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
  "createdAt": _createdAt
}`;

const articlesSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    coverImage: z
      .object({
        alt: z.string(),
        caption: z.string().optional().nullable(),
        asset: z.object({
          _ref: z.string(),
          _type: z.string(),
        }),
      })
      .optional()
      .nullable(),
    excerpt: z.string().optional().nullable(),
    content: z.any(),
    createdAt: z.string(),
  })
);

async function getArticles() {
  const data = await client.fetch(articlesQuery);
  return articlesSchema.parse(data);
}

export async function generateRssFeed() {
  if (env.VERCEL_ENV === 'development') {
    return;
  }

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
    const { title, slug, coverImage, excerpt, content, createdAt } = article;

    const coverImageHtml = coverImage
      ? /* html */ `
    <figure>
      <image
        src="${client.imageUrlBuilder.image(coverImage).url()}"
        alt="${coverImage.alt}"
      />
      ${
        coverImage.caption
          ? /* html */ `<figcaption>${coverImage.caption}</figcaption>`
          : ''
      }
    </figure>
    `
      : '';

    const excerptHtml = excerpt ? /* html */ `<p>${excerpt}</p>` : '';

    const contentHtml = toHTML(content, {
      components: {
        marks: {
          resourceLink: ({ value, children }) => {
            return /* html */ `<a href="${value.url}">${children}</a>`;
          },
        },
        types: {
          image: ({ value }) => {
            return /* html */ `
            <figure>
              <image
                src="${client.imageUrlBuilder.image(value).url()}"
                alt="${value.alt}"
              />
              ${
                value.caption
                  ? /* html */ `<figcaption>${value.caption}</figcaption>`
                  : ''
              }
            </figure>
            `;
          },
        },
      },
    });

    feed.addItem({
      title,
      id: slug,
      link: `${siteUrl}/articles/${slug}`,
      description: title,
      date: new Date(createdAt),
      content: coverImageHtml + excerptHtml + contentHtml,
    });
  });

  fs.writeFileSync('./public/rss.xml', feed.rss2());
}
