import { z } from 'zod';

// UUID v4 regex pattern
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// Delta pattern: supports single units or combined units
const deltaRegex =
  /^-?\d+\s+(days?|hours?|weeks?|months?|years?)(\s+\d+\s+(days?|hours?|weeks?|months?|years?))*$/;

// Image path pattern
const imagePathRegex = /^\/images\/.+\.(jpg|jpeg|png|gif|webp)$/;

// Tag pattern: key:value format with allowed keys
const tagRegex =
  /^(episode|season|character|location|theme|time|marker):\s*.+$|^episode:\s*\d+$|^season:\s*\d+$/;

// Event schema
export const eventSchema = z.object({
  id: z.string().regex(uuidV4Regex, 'Must be a valid UUID v4'),
  delta: z
    .union([z.string().regex(deltaRegex, 'Invalid delta format'), z.null()])
    .optional()
    .transform((val) => val ?? null),
  summary: z
    .string()
    .min(1, 'Summary must not be empty')
    .max(200, 'Summary must be 200 characters or less'),
  description: z.string().min(1, 'Description must not be empty'),
  images: z.array(z.string().regex(imagePathRegex, 'Invalid image path')).optional().default([]),
  tags: z.array(z.string().regex(tagRegex, 'Invalid tag format')),
});

// Events data schema
export const eventsDataSchema = z.object({
  events: z.array(eventSchema),
});

// Inferred TypeScript types
export type Event = z.infer<typeof eventSchema>;
export type EventsData = z.infer<typeof eventsDataSchema>;
