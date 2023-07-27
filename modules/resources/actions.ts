'use server';

import slugify from 'slugify';

import { client } from '@/sanity/client';

export async function submitResourceAction(data: any) {
  return client.create({
    _type: 'resource',
    title: data.title,
    slug: { current: slugify(data.title, { lower: true }) },
    type: data.type,
    url: data.url,
  });
}
