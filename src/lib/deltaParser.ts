/**
 * Parse delta string into total hours
 * Supports single units: "5 days", "-3 hours"
 * Supports combined units: "7 days 17 hours", "2 weeks 3 days"
 * Returns null if delta is null/undefined
 */
export function parseDeltaToHours(delta: string | null | undefined): number | null {
  if (delta === null || delta === undefined) {
    return null;
  }

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

  // Find all number+unit pairs
  const pattern = /(-?\d+)\s+(hours?|days?|weeks?|months?|years?)/gi;
  const matches = Array.from(delta.matchAll(pattern));

  if (matches.length === 0) {
    console.warn(`Unable to parse delta: "${delta}"`);
    return null;
  }

  // Sum up all components
  let totalHours = 0;
  for (const match of matches) {
    const value = parseInt(match[1]!, 10);
    const unit = match[2]!.toLowerCase();
    totalHours += value * (hoursMap[unit] || 0);
  }

  return totalHours;
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
 * Sort events by their delta chronologically
 * Events without deltas maintain their array position relative to events with deltas
 */
export function sortEventsByDelta<T extends { delta?: string | null | undefined }>(
  events: T[]
): T[] {
  // Add original index to track array position
  const eventsWithIndex = events.map((event, index) => ({ event, originalIndex: index }));

  return eventsWithIndex
    .sort((a, b) => {
      const aHours = parseDeltaToHours(a.event.delta);
      const bHours = parseDeltaToHours(b.event.delta);

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
    .map((item) => item.event);
}
