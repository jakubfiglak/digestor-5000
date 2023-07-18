import { getResourcesList } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';

const ResourcesPage = async () => {
  const resources = await getResourcesList();

  return (
    <>
      <h2 className="text-secondary my-6 text-center text-4xl font-bold">
        Resources
      </h2>
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
