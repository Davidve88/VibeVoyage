import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AREAS, COSTS, THEMES } from './data/taxonomy';

const tri = z.object({ en: z.string(), de: z.string(), es: z.string() });

const places = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/places' }),
  schema: z.object({
    name: z.string(),
    area: z.enum(Object.keys(AREAS) as [keyof typeof AREAS, ...(keyof typeof AREAS)[]]),
    themes: z.array(z.enum(Object.keys(THEMES) as [keyof typeof THEMES, ...(keyof typeof THEMES)[]])),
    cost: z.enum(Object.keys(COSTS) as [keyof typeof COSTS, ...(keyof typeof COSTS)[]]),
    time: z.string(),
    coords: z.tuple([z.number(), z.number()]),
    text: tri,
    tip: tri.optional(),
    how: tri.optional(),
    // 2-4 short evergreen bullets per language (best time, what to look for, access, booking).
    good: z.object({ en: z.array(z.string()), de: z.array(z.string()), es: z.array(z.string()) }).optional(),
    links: z
      .array(
        z.object({
          type: z.enum(['map', 'tix', 'web']),
          url: z.string().url(),
          label: tri.optional(),
        }),
      )
      .default([]),
    // Filled in when photos are added; credit is mandatory with a file.
    photo: z
      .object({
        file: z.string(),
        author: z.string(),
        license: z.string(),
        sourceUrl: z.string().url(),
      })
      .optional(),
    // Optional: set true once a native speaker has checked that language.
    reviewed: z.object({ de: z.boolean().optional(), es: z.boolean().optional() }).optional(),
  }),
});

export const collections = { places };
