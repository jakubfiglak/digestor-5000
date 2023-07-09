import fs from "fs";
import { Feed, type FeedOptions } from "feed";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { z } from "zod";
import { toHTML } from "@portabletext/to-html";

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
  const feed = new Feed({
    id: process.env.SITE_URL || "",
    title: "Frontend Digest | RSS Feed",
    description: "Welcome to Frontend Digest!",
    link: process.env.SITE_URL || "",
    copyright: `All rights reserved ${new Date().getFullYear()}, Frontend Digest`,
    feedLinks: {
      rss2: `${process.env.SITE_URL}/rss.xml`,
    },
  });

  const articles = await getArticles();

  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      id: article.slug,
      link: `${process.env.SITE_URL}/blog/${article.slug}`,
      description: article.title,
      date: new Date(article.createdAt),
      content: toHTML(article.content),
    });
  });

  fs.writeFileSync("./public/rss.xml", feed.rss2());
}
