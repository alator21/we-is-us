/**
 * Parse delta string (e.g., "5 days", "-3 hours") into total hours
 * Returns null if delta is null/undefined
 */
export function parseDeltaToHours(delta: string | null | undefined): number | null {
  if (delta === null || delta === undefined) {
    return null;
  }

  const match = delta.match(/^(-?\d+)\s+(hours?|days?|weeks?|months?|years?)$/i);

  if (!match) {
    console.warn(`Unable to parse delta: "${delta}"`);
    return null;
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!.toLowerCase();

  // Convert to hours for consistent comparison
  const hoursMap: Record<string, number> = {
    hour: 1,
    hours: 1,
    day: 24,
    days: 24,
    week: 24 * 7,
    weeks: 24 * 7,
    month: 24 * 30, // Approximation
    months: 24 * 30,
    year: 24 * 365,
    years: 24 * 365,
  };

  return value * (hoursMap[unit] || 0);
}

/**
 * Calculate time difference between two delta values
 * Returns a human-readable string like "5 days later" or "3 hours earlier"
 * Returns null if either delta is null/undefined
 */
export function calculateTimeDiff(
  fromDelta: string | null | undefined,
  toDelta: string | null | undefined
): string | null {
  const fromHours = parseDeltaToHours(fromDelta);
  const toHours = parseDeltaToHours(toDelta);

  // If either delta is missing, we can't calculate time diff
  if (fromHours === null || toHours === null) {
    return null;
  }

  const diffHours = toHours - fromHours;

  if (diffHours === 0) {
    return 'same time';
  }

  const absHours = Math.abs(diffHours);
  const direction = diffHours > 0 ? 'later' : 'earlier';

  // Convert to most appropriate unit
  if (absHours < 24) {
    return `${absHours} ${absHours === 1 ? 'hour' : 'hours'} ${direction}`;
  } else if (absHours < 24 * 7) {
    const days = Math.floor(absHours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ${direction}`;
  } else if (absHours < 24 * 30) {
    const weeks = Math.floor(absHours / (24 * 7));
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ${direction}`;
  } else if (absHours < 24 * 365) {
    const months = Math.floor(absHours / (24 * 30));
    return `${months} ${months === 1 ? 'month' : 'months'} ${direction}`;
  } else {
    const years = Math.floor(absHours / (24 * 365));
    return `${years} ${years === 1 ? 'year' : 'years'} ${direction}`;
  }
}

/**
 * Sort scenes by their delta chronologically
 * Scenes without deltas maintain their array position relative to scenes with deltas
 */
export function sortScenesByDelta<T extends { delta?: string | null | undefined }>(
  scenes: T[]
): T[] {
  // Add original index to track array position
  const scenesWithIndex = scenes.map((scene, index) => ({ scene, originalIndex: index }));

  return scenesWithIndex
    .sort((a, b) => {
      const aHours = parseDeltaToHours(a.scene.delta);
      const bHours = parseDeltaToHours(b.scene.delta);

      // If both have deltas, sort by delta
      if (aHours !== null && bHours !== null) {
        return aHours - bHours;
      }

      // If only one has a delta, it's hard to compare
      // So we maintain original array order as the tiebreaker
      if (aHours === null && bHours === null) {
        return a.originalIndex - b.originalIndex;
      }

      // If a has delta but b doesn't, we need context
      // For simplicity, maintain original order
      return a.originalIndex - b.originalIndex;
    })
    .map((item) => item.scene);
}
