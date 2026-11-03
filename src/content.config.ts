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
    relatedEmergency: z.boolean().default(false),
    office: z.string().optional(),
    sourceSection: z.string().optional(),
    sourceDate: z.string().optional(),
    sourceNote: z.string().optional(),
    contact: z.string().optional(),
    location: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    eligibility: z.string().optional(),
    requirements: z.array(z.string()).optional(),
    steps: z.array(z.string()).optional(),
    stepsNote: z.string().optional(),
    stepsSource: z.string().url().optional(),
    fees: z.string().optional(),
    processingTime: z.string().optional(),
  }),
});

export const collections = { services };
