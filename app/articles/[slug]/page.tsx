import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { NextPage } from "next";
import { groq } from "next-sanity";
import { z } from "zod";

const articleQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  content
}`;

const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.any(),
});

async function getArticle(slug: string) {
  const data = await client.fetch(articleQuery, { slug });
  return articleSchema.parse(data);
}

type ArticlePageProps = {
  params: { slug: string };
};

const ArticlePage: NextPage<ArticlePageProps> = async ({
  params: { slug },
}) => {
  const article = await getArticle(slug);

  return (
    <>
      <h1 className="text-4xl text-center mb-6 font-bold">{article.title}</h1>
      <article>
        <PortableText
          value={article.content}
          components={{
            block: {
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mb-2">{children}</h3>
              ),
            },
            list: {
              bullet: ({ children }) => (
                <ul className="list-disc list-inside mb-4">{children}</ul>
              ),
            },
          }}
        />
      </article>
    </>
  );
};

export default ArticlePage;
