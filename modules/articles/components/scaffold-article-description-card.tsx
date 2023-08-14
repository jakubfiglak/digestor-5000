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
          <Link href="/resources" className="text-orange-500">
            resources
          </Link>{' '}
          with <em className="bg-slate-200 p-[2px]">scheduledForPublishing</em>{' '}
          flag set to <em className="bg-slate-200 p-[2px]">true</em> that have
          not been used in any previous article. Check it out!
        </p>
      </CardContent>
    </Card>
  );
};
