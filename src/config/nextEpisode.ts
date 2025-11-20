/**
 * Configuration for the next upcoming episode
 * Update this when a new episode is scheduled to air
 */

export const nextEpisode = {
  // Set to null when there are no upcoming episodes
  airDate: '2026-01-24T02:00:00Z', // ISO 8601 format (UTC time)
  episodeNumber: 'S1E7', // Optional episode identifier
};

// Helper to check if countdown should be shown
export function hasUpcomingEpisode(): boolean {
  if (!nextEpisode.airDate) return false;
  const now = new Date().getTime();
  const target = new Date(nextEpisode.airDate).getTime();
  return target > now;
}
