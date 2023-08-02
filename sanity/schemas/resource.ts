import {
  defineArrayMember,
  defineField,
  defineType,
} from '@sanity-typed/types';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { env } from '@/env.mjs';

const resourcesQuery = groq`*[_type == "resource" && url == $url && slug.current != $slug] {
  "id": _id,
}`;

const resourcesSchema = z.array(
  z.object({
    id: z.string(),
  })
);

export const resource = defineType({
  name: 'resource',
  type: 'document',
  title: 'Resource',
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
      name: 'type',
      type: 'string',
      title: 'Type',
      initialValue: 'article',
      options: {
        list: [
          'article',
          'video',
          'podcast',
          'twitter-thread',
          'github-thread',
          'whatchamacallit',
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL',
      validation: (Rule) =>
        Rule.required().custom(async (value, { document, getClient }) => {
          const client = getClient({
            apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
          });

          if (document?.slug) {
            const data = await client.fetch(resourcesQuery, {
              url: value,
              slug: (document.slug as { current: string }).current,
            });

            const resources = resourcesSchema.parse(data);

            if (resources.length > 0) {
              return 'Resource with this URL has already been submitted';
            }
          }

          return true;
        }),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
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
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })],
    }),
    defineField({
      name: 'scheduledForPublishing',
      type: 'boolean',
      title: 'Scheduled for publishing',
      initialValue: false,
    }),
    defineField({
      name: 'submitterId',
      type: 'string',
      title: "Submitter's ID",
      readOnly: true,
      description:
        'ID of the user who submitted this resource from the web app.',
    }),
  ],
});
