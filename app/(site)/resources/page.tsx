import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getResourcesList } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';

const ResourcesPage = async () => {
  const [user, resources] = await Promise.all([
    currentUser(),
    getResourcesList(),
  ]);

  return (
    <>
      <div className="my-6 text-center">
        <h2 className="mb-6 text-4xl font-bold">Resources</h2>
        {user && (
          <Link
            href="/creator/resources"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Submit a resource
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <li key={resource.id}>
            <ResourceCard resource={resource} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResourcesPage;
