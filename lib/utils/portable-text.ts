import type { PortableTextTextBlock } from '@sanity/types';
import { randomUUID } from 'crypto';

import type { Resource } from '@/modules/resources/schemas';

export function buildHeading(text: string): PortableTextTextBlock {
  return {
    _type: 'block',
    _key: randomUUID(),
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        marks: [],
        _key: randomUUID(),
        text,
      },
    ],
  };
}

export function buildParagraph(text: string): PortableTextTextBlock {
  return {
    _type: 'block',
    _key: randomUUID(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        marks: [],
        text,
        _key: randomUUID(),
      },
    ],
  };
}

export function buildResourceListItem(
  resource: Resource
): PortableTextTextBlock {
  const markId = randomUUID();

  return {
    _type: 'block',
    listItem: 'bullet',
    _key: randomUUID(),
    style: 'normal',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: randomUUID(),
        text: resource.title,
        marks: [markId],
      },
      ...(resource.description
        ? [
            {
              _type: 'span',
              _key: randomUUID(),
              text: ` - ${resource.description}`,
              marks: [],
            },
          ]
        : []),
    ],
    markDefs: [
      {
        _type: 'resourceLink',
        _key: markId,
        reference: { _ref: resource.id, _type: 'reference' },
        url: resource.url,
      },
    ],
  };
}
