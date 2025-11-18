/**
 * Parse delta string (e.g., "5 days", "-3 hours") into total hours
 */
export function parseDeltaToHours(delta: string): number {
  const match = delta.match(/^(-?\d+)\s+(hours?|days?|weeks?|months?|years?)$/i);

  if (!match) {
    console.warn(`Unable to parse delta: "${delta}"`);
    return 0;
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
 */
export function calculateTimeDiff(fromDelta: string, toDelta: string): string {
  const fromHours = parseDeltaToHours(fromDelta);
  const toHours = parseDeltaToHours(toDelta);
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
 */
export function sortScenesByDelta<T extends { delta: string }>(scenes: T[]): T[] {
  return [...scenes].sort((a, b) => {
    return parseDeltaToHours(a.delta) - parseDeltaToHours(b.delta);
  });
}
