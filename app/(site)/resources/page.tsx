import Link from 'next/link';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { client } from '@/sanity/client';

const resourcesListQuery = groq`*[_type == "resource"] {
  "id": _id,
  title,
  "slug": slug.current,
  type,
  url,
  "tags": tags[]->{title, "slug": slug.current}
}`;

const resourcesListSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    type: z.union([
      z.literal('article'),
      z.literal('video'),
      z.literal('podcast'),
      z.literal('twitter-thread'),
      z.literal('whatchamacallit'),
    ]),
    url: z.string().url(),
    tags: z.array(z.object({ title: z.string(), slug: z.string() })),
  })
);

async function getResourcesList() {
  const data = await client.fetch(resourcesListQuery);
  return resourcesListSchema.parse(data);
}

const ResourcesPage = async () => {
  const resources = await getResourcesList();

  return (
    <>
      <h1 className="text-secondary mb-6 text-center text-4xl font-bold">
        Resources
      </h1>
      <ul className="grid grid-cols-4 gap-4">
        {resources.map(({ id, title, url, tags }) => (
          <li key={id}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-text hover:border-primary flex h-full flex-col justify-between rounded-lg border p-3 transition-colors"
            >
              <h3 className="mb-3 text-xl font-bold">{title}</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="border-secondary rounded-full border px-2 py-1 text-xs opacity-60"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResourcesPage;
