import {
  defineArrayMember,
  defineField,
  defineType,
} from '@sanity-typed/types';

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
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Type',
      initialValue: 'article',
      options: {
        list: ['article', 'video', 'podcast', 'whatchamacallit'],
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })],
    }),
  ],
});
