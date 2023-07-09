import Link from 'next/link';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { generateRssFeed } from '@/lib/utils/generate-rss-feed';
import { client } from '@/sanity/client';

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
      <h1 className="mb-6 text-center text-4xl font-bold">Articles</h1>
      <ul>
        {articles.map(({ id, slug, title }) => (
          <li key={id}>
            <Link
              href={`/articles/${slug}`}
              className="transition-colors hover:text-secondary"
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
