import { getResourcesList } from '@/modules/resources/api';
import { ResourceCard } from '@/modules/resources/components/resource-card';
import { SubmitResourceLink } from '@/modules/resources/components/submit-resource-link';

const ResourcesPage = async () => {
  const resources = await getResourcesList();

  return (
    <>
      <div className="my-6 text-center">
        <h2 className="mb-6 text-4xl font-bold">Resources</h2>
        <SubmitResourceLink>Submit a resource</SubmitResourceLink>
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
