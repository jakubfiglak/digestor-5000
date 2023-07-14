import { Link2Icon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { client } from '@/sanity/client';

const resourcesListQuery = groq`*[_type == "resource"] {
  "id": _id,
  title,
  "slug": slug.current,
  description,
  type,
  url,
  "tags": tags[]->{title, "slug": slug.current}
}`;

const resourcesListSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().optional().nullable(),
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
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resources.map(({ id, title, url, description, tags }) => (
          <li key={id}>
            <Card className="flex h-full flex-col">
              <CardHeader>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <CardTitle className="flex items-center gap-1 transition-colors group-hover:text-orange-500">
                    {title}
                    <Link2Icon height={16} width={16} />
                  </CardTitle>
                </a>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{description}</CardDescription>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.slug} variant="outline">
                    {tag.title}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResourcesPage;
