import { NextPage } from 'next';

import { getResourcesListByTag } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';
import { getTag, getTagsSlugList } from '@/modules/tags/api';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const tags = await getTagsSlugList();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

type ResourceTagPageProps = {
  params: { slug: string };
};

const ResourceTagPage: NextPage<ResourceTagPageProps> = async ({ params }) => {
  const tag = await getTag(params.slug);
  const resources = await getResourcesListByTag(params.slug);

  return (
    <>
      <h2 className="text-secondary my-6 text-center text-4xl font-bold">
        {tag.title}
      </h2>
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
