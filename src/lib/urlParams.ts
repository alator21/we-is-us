import { z } from 'zod';

// Schema for spoiler filter URL parameters
const filterParamsSchema = z.object({
  season: z
    .string()
    .nullable()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && Number.isInteger(val)), {
      message: 'Season must be a positive integer',
    }),
  episode: z
    .string()
    .nullable()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && Number.isInteger(val)), {
      message: 'Episode must be a positive integer',
    }),
  showAll: z
    .string()
    .nullable()
    .transform((val) => val === 'true'),
  reveal: z
    .string()
    .nullable()
    .transform((val) => {
      if (!val) return [];
      return val
        .split(',')
        .map((idx) => parseInt(idx, 10))
        .filter((idx) => !isNaN(idx) && idx >= 0);
    }),
});

export type FilterParams = z.infer<typeof filterParamsSchema>;

/**
 * Parse and validate URL search parameters for spoiler filtering
 */
export function parseFilterParams(searchParams: URLSearchParams): FilterParams {
  const params = {
    season: searchParams.get('season'),
    episode: searchParams.get('episode'),
    showAll: searchParams.get('showAll'),
    reveal: searchParams.get('reveal'),
  };

  return filterParamsSchema.parse(params);
}

/**
 * Check if filter parameters are present in URL
 */
export function hasFilterParams(searchParams: URLSearchParams): boolean {
  return searchParams.has('season') || searchParams.has('showAll');
}
