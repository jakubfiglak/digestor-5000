import Link from 'next/link';
import { groq } from 'next-sanity';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateRssFeed } from '@/lib/utils/generate-rss-feed';
import { client } from '@/sanity/client';

const articlesListQuery = groq`*[_type == "article"] {
  "id": _id,
  title,
  excerpt,
  "slug": slug.current,
  "createdAt": _createdAt,
  "readTime": round(length(pt::text(content)) / 5 / 180 )
}`;

const articlesListSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().optional().nullable(),
    createdAt: z.string(),
    readTime: z.number(),
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
      <h2 className="my-6 text-center text-4xl font-bold">Articles</h2>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {articles.map(({ id, title, slug, excerpt, createdAt, readTime }) => (
          <li key={id} className="md:first:col-span-2 xl:first:col-span-4">
            <Card className="flex h-full flex-col">
              <CardHeader>
                <Link href={`/articles/${slug}`} className="group">
                  <CardTitle className="transition-colors group-hover:text-orange-500">
                    {title}
                  </CardTitle>
                </Link>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <time dateTime={createdAt}>
                    {new Intl.DateTimeFormat('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(createdAt))}
                  </time>
                  <span className="mx-1">&middot;</span>
                  <span>{readTime}m read time</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="mb-3">{excerpt}</CardDescription>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ArticlesPage;
