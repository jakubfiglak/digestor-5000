import { StopwatchIcon } from '@radix-ui/react-icons';
import Image, { type StaticImageData } from 'next/image';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { urlFor } from '@/sanity/client';

import type { ResourceDetails, ResourceType } from '../schemas';
import article from './assets/article.jpg';
import github from './assets/github.jpeg';
import podcast from './assets/podcast.webp';
import twitter from './assets/twitter.webp';
import video from './assets/video.png';
import whatchamacallit from './assets/whatchamacallit.webp';
import { ResourceTypeBadge } from './resource-type-badge';

const fallbackImages: Record<ResourceType, StaticImageData> = {
  'twitter-thread': twitter,
  video,
  'github-thread': github,
  podcast,
  article,
  whatchamacallit,
};

type ResourceCardProps = {
  resource: ResourceDetails;
  className?: string;
};

export const ResourceCard = ({ resource, className }: ResourceCardProps) => {
  const {
    url,
    title,
    type,
    createdAt,
    description,
    image,
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
        <Image
          src={image ? urlFor(image.asset._ref).url() : fallbackImages[type]}
          alt={image?.alt || title}
          className="mb-4 h-40 rounded-lg object-cover"
          width={500}
          height={160}
        />
        <CardDescription className="mb-3">{description}</CardDescription>
        {articles && articles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <CardDescription>Featured in:</CardDescription>
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
