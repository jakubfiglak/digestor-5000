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

export const articleDetailsSchema = articleSchema.extend({
  coverImage: z
    .object({
      alt: z.string(),
      caption: z.string().optional().nullable(),
      asset: z.object({
        _ref: z.string(),
        _type: z.string(),
      }),
    })
    .optional()
    .nullable(),
  content: z.any(),
});

export type ArticleDetails = z.infer<typeof articleDetailsSchema>;
