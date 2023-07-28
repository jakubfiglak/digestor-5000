import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getResourcesList } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';

export const dynamic = 'force-static';

const ResourcesPage = async () => {
  const resources = await getResourcesList();

  return (
    <>
      <div className="my-6 text-center">
        <h2 className="text-secondary mb-6 text-4xl font-bold">Resources</h2>
        <Link
          href="/resources/submit"
          className={buttonVariants({ variant: 'secondary', size: 'lg' })}
        >
          Submit a resource
        </Link>
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
