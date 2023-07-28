import { z } from 'zod';

export const resourceTypeSchema = z.union([
  z.literal('article'),
  z.literal('video'),
  z.literal('podcast'),
  z.literal('twitter-thread'),
  z.literal('github-thread'),
  z.literal('whatchamacallit'),
]);

export type ResourceType = z.infer<typeof resourceTypeSchema>;

export const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  type: resourceTypeSchema,
  url: z.string().url(),
  scheduledForPublishing: z.boolean().optional().nullable(),
  tags: z
    .array(z.object({ title: z.string(), slug: z.string() }))
    .optional()
    .nullable(),
  createdAt: z.string(),
  articles: z
    .array(z.object({ id: z.string(), title: z.string(), slug: z.string() }))
    .optional()
    .nullable(),
  submitter: z
    .object({
      id: z.string(),
      avatarUrl: z.string().url().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export type Resource = z.infer<typeof resourceSchema>;
