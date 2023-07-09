import { defineField, defineType } from '@sanity-typed/types';

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
      name: 'type',
      type: 'string',
      title: 'Type',
      initialValue: 'article',
      options: {
        list: ['article', 'video', 'podcast', 'whatchamacallit'],
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
      validation: (Rule) => Rule.required(),
    }),
  ],
});
