import { currentUser } from '@clerk/nextjs';
import { NextPage } from 'next';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getResourcesListByTag } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';
import { getTag } from '@/modules/tags/api';

type ResourceTagPageProps = {
  params: { slug: string };
};

const ResourceTagPage: NextPage<ResourceTagPageProps> = async ({ params }) => {
  const [user, tag, resources] = await Promise.all([
    currentUser(),
    getTag(params.slug),
    getResourcesListByTag(params.slug),
  ]);

  return (
    <>
      <div className="my-6 text-center">
        <h2 className="text-secondary mb-6 text-4xl font-bold">{tag.title}</h2>
        {user && (
          <Link
            href="/resources/submit"
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
          >
            Submit a resource
          </Link>
        )}
      </div>
      {tag.description && <p className="mb-4">{tag.description}</p>}
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

export default ResourceTagPage;
