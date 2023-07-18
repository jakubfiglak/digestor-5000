import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { Resource } from '../schemas';

type ResourceCardProps = {
  resource: Resource;
  className?: string;
};

export const ResourceCard = ({ resource, className }: ResourceCardProps) => {
  const { url, title, createdAt, description, articles, tags } = resource;

  return (
    <Card className={twMerge('flex h-full flex-col', className)}>
      <CardHeader>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <CardTitle className="transition-colors group-hover:text-orange-500">
            {title}
          </CardTitle>
        </a>
        <time
          dateTime={createdAt}
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          {new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(new Date(createdAt))}
        </time>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="mb-3">{description}</CardDescription>
        {articles && (
          <div className="flex flex-wrap items-center gap-2">
            <CardDescription>Mentioned in:</CardDescription>
            {articles.map(({ id, title, slug }) => (
              <Link key={id} href={`/articles/${slug}`}>
                <Badge key={id} variant="secondary">
                  {title}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {tags &&
          tags.map((tag) => (
            <Badge key={tag.slug} variant="outline">
              {tag.title}
            </Badge>
          ))}
      </CardFooter>
    </Card>
  );
};
