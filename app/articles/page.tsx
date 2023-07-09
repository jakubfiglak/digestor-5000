import { generateRssFeed } from "@/lib/utils/generateRSSFeed";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";
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

const ArticlesPage = async () => {
  await generateRssFeed();
  const articles = await getArticlesList();

  return (
    <>
      <h1 className="text-4xl text-center mb-6 font-bold">Articles</h1>
      <ul>
        {articles.map(({ id, slug, title }) => (
          <li key={id}>
            <Link
              href={`/articles/${slug}`}
              className="hover:text-secondary transition-colors"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ArticlesPage;
