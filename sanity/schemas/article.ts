import {
  defineArrayMember,
  defineField,
  defineType,
} from '@sanity-typed/types';

export const article = defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
});
