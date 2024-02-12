'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useIsEditor } from '@/lib/utils/use-is-editor';

type ScaffoldArticleLinkProps = {
  children?: ReactNode;
  className?: string;
};

export const SubmitResourceLink = ({
  children,
  className,
}: ScaffoldArticleLinkProps) => {
  const isEditor = useIsEditor();

  if (!isEditor) {
    return null;
  }

  return (
    <Link
      href="/creator/resources"
      className={cn(buttonVariants({ variant: 'outline' }), className)}
    >
      {children || 'Submit'}
    </Link>
  );
};
