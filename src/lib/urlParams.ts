import { z } from 'zod';
import { SEASONS, isValidEpisodeForSeason, ALL_EPISODES } from './eventMetadata';

// Schema for spoiler filter URL parameters
const filterParamsSchema = z
  .object({
    season: z
      .string()
      .nullable()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || SEASONS.includes(val), {
        message: `Season must be one of: ${SEASONS.join(', ')}`,
      }),
    episode: z
      .string()
      .nullable()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || ALL_EPISODES.includes(val), {
        message: `Episode must be one of: ${ALL_EPISODES.join(', ')}`,
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
    layout: z
      .string()
      .nullable()
      .transform((val) => val || 'list')
      .refine((val) => ['list', 'grid'].includes(val), {
        message: 'Layout must be either "list" or "grid"',
      }),
  })
  .refine(
    (data) => {
      // If both season and episode are provided, validate that episode exists for that season
      if (data.season !== undefined && data.episode !== undefined) {
        return isValidEpisodeForSeason(data.season, data.episode);
      }
      return true;
    },
    {
      message: 'Episode is not valid for the selected season',
      path: ['episode'],
    }
  );

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
    layout: searchParams.get('layout'),
  };

  return filterParamsSchema.parse(params);
}

/**
 * Check if filter parameters are present in URL
 */
export function hasFilterParams(searchParams: URLSearchParams): boolean {
  return searchParams.has('season') || searchParams.has('showAll');
}
