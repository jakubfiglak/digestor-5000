import { currentUser } from '@clerk/nextjs';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getArticlesList } from '@/modules/articles/api';
import { ArticleCard } from '@/modules/articles/components/article-card';
import { ScaffoldArticleLink } from '@/modules/articles/components/scaffold-article-link';
import { getResourcesList } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';

async function Home() {
  const [user, articles, resources] = await Promise.all([
    currentUser(),
    getArticlesList(3),
    getResourcesList(3),
  ]);

  return (
    <div className="mt-6">
      <section className="mb-6">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Latest articles</h2>
            <ScaffoldArticleLink />
          </div>
          <Link
            href="/articles"
            className="flex items-center gap-1 text-muted-foreground"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} className="h-full" />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Latest resources</h2>
            {user && (
              <Link
                href="/creator/resources"
                className={buttonVariants({ variant: 'outline' })}
              >
                Submit
              </Link>
            )}
          </div>
          <Link
            href="/resources"
            className="flex items-center gap-1 text-muted-foreground"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {resources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} className="h-full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
