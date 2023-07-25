import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { Article } from '../schemas';

type ArticleCardProps = {
  article: Article;
  className?: string;
};

export const ArticleCard = ({ article, className }: ArticleCardProps) => {
  const { slug, title, createdAt, excerpt, readTime } = article;

  return (
    <Card className={cn('flex flex-col', className)}>
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
        {excerpt && (
          <CardDescription className="mb-3">
            {excerpt.length >= 100 ? `${excerpt.slice(0, 100)}...` : excerpt}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};
