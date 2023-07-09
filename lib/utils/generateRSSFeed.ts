import fs from "fs";
import { Feed, type FeedOptions } from "feed";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { z } from "zod";

const articlesListQuery = groq`*[_type == "article"] {
  "id": _id,
  title,
  "slug": slug.current,
}`;

const articlesListSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
  })
);

async function getArticlesList() {
  const data = await client.fetch(articlesListQuery);
  return articlesListSchema.parse(data);
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

  const articles = await getArticlesList();

  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      id: `${process.env.SITE_URL}/blog/${article.slug}`,
      link: `${process.env.SITE_URL}/blog/${article.slug}`,
      description: article.title,
      date: new Date(),
    });
  });

  fs.writeFileSync("./public/rss.xml", feed.rss2());
}
