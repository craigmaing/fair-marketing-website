import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.enum(['seo', 'web-development', 'marketing', 'case-study', 'industry-news']),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Fearnbell Marketing Team'),
    keywords: z.array(z.string()).default([]),
    competitorAnalysis: z.object({
      competitors: z.array(z.string()),
      opportunities: z.array(z.string())
    }).optional()
  }),
});

export const collections = { blog };