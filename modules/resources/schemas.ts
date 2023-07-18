import { z } from 'zod';

export const resourceSchema = z.object({
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
  createdAt: z.string(),
  articles: z
    .array(z.object({ id: z.string(), title: z.string(), slug: z.string() }))
    .optional()
    .nullable(),
});

export type Resource = z.infer<typeof resourceSchema>;
