import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
});

export type Tag = z.infer<typeof tagSchema>;
