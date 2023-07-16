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
  "tags": tags[]->{title, "slug": slug.current},
  "articles": *[_type == "article" && references(^._id)] {
    "id": _id,
    title,
    "slug": slug.current
  }
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
      z.literal('github-thread'),
      z.literal('whatchamacallit'),
    ]),
    url: z.string().url(),
    tags: z
      .array(z.object({ title: z.string(), slug: z.string() }))
      .optional()
      .nullable(),
    articles: z
      .array(z.object({ id: z.string(), title: z.string(), slug: z.string() }))
      .optional()
      .nullable(),
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
      <h2 className="text-secondary my-6 text-center text-4xl font-bold">
        Resources
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resources.map(({ id, title, url, description, tags, articles }) => (
          <li key={id}>
            <Card className="flex h-full flex-col">
              <CardHeader>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <CardTitle className="transition-colors group-hover:text-orange-500">
                    {title}
                  </CardTitle>
                </a>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="mb-3">
                  {description}
                </CardDescription>
                {articles && (
                  <div className="flex flex-wrap items-center gap-2">
                    <CardDescription>Mentioned in:</CardDescription>
                    {articles.map(({ id, title, slug }) => (
                      <Link key={id} href={`/articles/${slug}`}>
                        <Badge key={id} variant="secondary">
                          {title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {tags &&
                  tags.map((tag) => (
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
