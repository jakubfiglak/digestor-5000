import { generateRssFeed } from '@/lib/utils/generate-rss-feed';
import { getArticlesList } from '@/modules/articles/api';
import { ArticleCard } from '@/modules/articles/components/article-card';

const ArticlesPage = async () => {
  await generateRssFeed();
  const articles = await getArticlesList();

  return (
    <>
      <h2 className="my-6 text-center text-4xl font-bold">Articles</h2>

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
