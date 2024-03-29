import { MagicWandIcon, ReaderIcon } from '@radix-ui/react-icons';
import { groq } from 'next-sanity';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { z } from 'zod';

import { env } from '@/env.mjs';

const resourcesQuery = groq`*[_type == "resource"] {
  "id": _id,
  "articlesCount": count(*[_type == "article" && references(^._id)]),
  scheduledForPublishing
}`;

const resourcesSchema = z.array(
  z.object({
    id: z.string(),
    articlesCount: z.number(),
    scheduledForPublishing: z.boolean().optional().nullable(),
  })
);

export const article = defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal Link',
                icon: () => <ReaderIcon />,
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [{ type: 'article' }],
                  },
                ],
              },
              {
                name: 'resourceLink',
                type: 'object',
                title: 'Resource Link',
                icon: () => <MagicWandIcon />,
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [{ type: 'resource' }],
                    options: {
                      filter: async ({ getClient }: { getClient: any }) => {
                        const client = getClient({
                          apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
                        });

                        const data = await client.fetch(resourcesQuery);
                        const resources = resourcesSchema.parse(data);

                        const availableResourceIds = resources
                          .filter(
                            (resource) =>
                              resource.articlesCount === 0 &&
                              resource.scheduledForPublishing
                          )
                          .map((resource) => resource.id);

                        return {
                          filter: '_id in $resourceIds',
                          params: { resourceIds: availableResourceIds },
                        };
                      },
                    },
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
