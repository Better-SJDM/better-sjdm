import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const services = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    source: z.string().url(),
    verified: z.coerce.date(),
    sample: z.boolean().default(false),
    contact: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const collections = { services };
