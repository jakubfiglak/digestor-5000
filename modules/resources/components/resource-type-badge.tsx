import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

import { Badge } from '@/components/ui/badge';

import type { ResourceType } from '../schemas';

type ResourceTypeBadgeProps = {
  type: ResourceType;
  className?: string;
};

const resourceTypeBadge = cva(['uppercase', 'text-white'], {
  variants: {
    type: {
      article: ['bg-green-600 hover:bg-green-600'],
      video: ['bg-red-500 hover:bg-red-500'],
      podcast: ['bg-violet-500 hover:bg-violet-500'],
      'twitter-thread': ['bg-blue-500 hover:bg-blue-500'],
      'github-thread': ['bg-gray-700 hover:bg-gray-700'],
      whatchamacallit: ['bg-yellow-500 hover:bg-yellow-500'],
    },
  },
});

export const ResourceTypeBadge = ({
  type,
  className,
}: ResourceTypeBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={twMerge(resourceTypeBadge({ type }), className)}
    >
      {type.replaceAll('-', ' ')}
    </Badge>
  );
};
