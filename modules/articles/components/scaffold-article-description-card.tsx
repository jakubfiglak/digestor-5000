import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

type ScaffoldArticleDescriptionCardProps = {
  className?: string;
};

export const ScaffoldArticleDescriptionCard = async ({
  className,
}: ScaffoldArticleDescriptionCardProps) => {
  const user = await currentUser();

  return (
    <Card className={cn('text-center', className)}>
      <CardHeader>
        <CardTitle>👋 Hello {user?.firstName ?? 'good person'}!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Would you like to create an article automatically? It is possible now!
          Just provide a title and we will take care of the rest! We will create
          an article draft using{' '}
          <Link
            href="/resources"
            className="relative bottom-0 left-0 inline-block after:block after:h-[2px] after:w-full after:bg-primary"
          >
            resources
          </Link>{' '}
          with <em className="bg-muted">scheduledForPublishing</em> flag set to{' '}
          <em className="bg-muted">true</em> that have not been used in any
          previous article. Check it out!
        </p>
      </CardContent>
    </Card>
  );
};
