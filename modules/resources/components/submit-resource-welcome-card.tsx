import { currentUser } from '@clerk/nextjs';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

type SubmitResourceWelcomeCardProps = {
  className?: string;
};

export const SubmitResourceWelcomeCard = async ({
  className,
}: SubmitResourceWelcomeCardProps) => {
  const user = await currentUser();

  return (
    <Card className={cn('text-center', className)}>
      <CardHeader>
        <CardTitle>👋 Hello {user?.firstName ?? 'good person'}!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          We appreciate your willingness to submit a resource and contribute to
          the growth of the Frontend Digest initative. Please fill in the form
          below.
        </p>
      </CardContent>
    </Card>
  );
};
