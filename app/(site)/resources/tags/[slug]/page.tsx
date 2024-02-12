import { NextPage } from 'next';
import { notFound } from 'next/navigation';

import { getResourcesListByTag } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';
import { getTag } from '@/modules/tags/api';
import { SubmitResourceLink } from '@/modules/resources/components/submit-resource-link';

type ResourceTagPageProps = {
  params: { slug: string };
};

const ResourceTagPage: NextPage<ResourceTagPageProps> = async ({ params }) => {
  const [tag, resources] = await Promise.all([
    getTag(params.slug),
    getResourcesListByTag(params.slug),
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <>
      <div className="my-6 text-center">
        <h2 className="mb-6 text-4xl font-bold">{tag.title}</h2>
        <SubmitResourceLink>Submit a resource</SubmitResourceLink>
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
