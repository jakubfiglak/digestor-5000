import { toHTML } from '@portabletext/to-html';
import { Feed } from 'feed';
import fs from 'fs';

import { env } from '@/env.mjs';
import { getSiteUrl } from '@/lib/utils/get-site-url';
import { getArticlesDetailsList } from '@/modules/articles/api';
import { client } from '@/sanity/client';

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

  const articles = await getArticlesDetailsList();

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
          internalLink: ({ value, children }) => {
            return /* html */ `<a href="${siteUrl}/articles/${value.slug}">${children}</a>`;
          },
          link: ({ value, children }) => {
            return /* html */ `<a href="${value.href}">${children}</a>`;
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
