import eventsData from '../../data/events.json';

// Helper function to extract tag value
function getTagValue(tags: string[], key: string): string | null {
  const tag = tags.find((t) => t.startsWith(`${key}:`));
  return tag ? tag.split(':')[1]?.trim() || null : null;
}

// Extract season to episodes mapping
function extractSeasonEpisodes(): Map<number, Set<number>> {
  const seasonEpisodes = new Map<number, Set<number>>();

  eventsData.events.forEach((event) => {
    const seasonStr = getTagValue(event.tags, 'season');
    const episodeStr = getTagValue(event.tags, 'episode');

    if (seasonStr && episodeStr) {
      const season = parseInt(seasonStr, 10);
      const episode = parseInt(episodeStr, 10);

      if (!seasonEpisodes.has(season)) {
        seasonEpisodes.set(season, new Set());
      }
      seasonEpisodes.get(season)!.add(episode);
    }
  });

  return seasonEpisodes;
}

const seasonEpisodesMap = extractSeasonEpisodes();

// Export constants
export const SEASONS = Array.from(seasonEpisodesMap.keys()).sort((a, b) => a - b);

export const EPISODES_BY_SEASON: Record<number, number[]> = {};
seasonEpisodesMap.forEach((episodes, season) => {
  EPISODES_BY_SEASON[season] = Array.from(episodes).sort((a, b) => a - b);
});

export const ALL_EPISODES = Array.from(
  new Set(Array.from(seasonEpisodesMap.values()).flatMap((eps) => Array.from(eps)))
).sort((a, b) => a - b);

// Helper to check if episode is valid for a season
export function isValidEpisodeForSeason(season: number, episode: number): boolean {
  const episodes = EPISODES_BY_SEASON[season];
  return episodes ? episodes.includes(episode) : false;
}

// Helper to get max episode for a season
export function getMaxEpisodeForSeason(season: number): number | null {
  const episodes = EPISODES_BY_SEASON[season];
  return episodes && episodes.length > 0 ? Math.max(...episodes) : null;
}
