import { z } from 'zod';

export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional().nullable(),
  createdAt: z.string(),
  readTime: z.number(),
});

export type Article = z.infer<typeof articleSchema>;
