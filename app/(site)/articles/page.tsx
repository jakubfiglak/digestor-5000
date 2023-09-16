import { generateRssFeed } from '@/lib/utils/generate-rss-feed';
import { getArticlesList } from '@/modules/articles/api';
import { ArticleCard } from '@/modules/articles/components/article-card';
import { ScaffoldArticleLink } from '@/modules/articles/components/scaffold-article-link';

export const dynamic = 'force-static';

export const revalidate = 60;

const ArticlesPage = async () => {
  await generateRssFeed();
  const articles = await getArticlesList();

  return (
    <>
      <div className="my-6 space-y-6 text-center">
        <h2 className="text-4xl font-bold">Articles</h2>
        <ScaffoldArticleLink>Scaffold new article</ScaffoldArticleLink>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <li
            key={article.id}
            className="md:first:col-span-2 xl:first:col-span-3"
          >
            <ArticleCard article={article} className="h-full" />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ArticlesPage;
