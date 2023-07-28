import { StopwatchIcon } from '@radix-ui/react-icons';
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
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { Resource } from '../schemas';
import { ResourceTypeBadge } from './resource-type-badge';

type ResourceCardProps = {
  resource: Resource;
  className?: string;
};

export const ResourceCard = ({ resource, className }: ResourceCardProps) => {
  const {
    url,
    title,
    type,
    createdAt,
    description,
    articles,
    tags,
    scheduledForPublishing,
    submitter,
  } = resource;

  return (
    <Card className={twMerge('flex h-full flex-col', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
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
          {scheduledForPublishing && !articles?.length && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <StopwatchIcon className="h-5 w-5 flex-shrink-0 text-orange-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Scheduled for publishing</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="mb-1 block">
            {submitter
              ? submitter.email ?? 'Unknown submitter'
              : 'Frontend Digest Team'}
          </span>
          <time dateTime={createdAt}>
            {new Intl.DateTimeFormat('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(createdAt))}
          </time>
          <span className="mx-1">&middot;</span>
          <ResourceTypeBadge type={type} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="mb-3">{description}</CardDescription>
        {articles && articles.length > 0 && (
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
      <CardFooter className="block">
        <div className="flex flex-wrap gap-2">
          {tags &&
            tags.map((tag) => (
              <Link href={`/resources/tags/${tag.slug}`} key={tag.slug}>
                <Badge variant="outline">{tag.title}</Badge>
              </Link>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
};
