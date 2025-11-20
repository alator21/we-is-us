import type { EventsData } from './eventSchema';
import { eventsDataSchema } from './eventSchema';

// Import all season event files
import season1 from '../../data/events/season-1.json';
// Add more seasons as needed:
// import season2 from '../../data/events/season-2.json';
// import season3 from '../../data/events/season-3.json';

/**
 * Loads and merges all event data from multiple season files
 * Each season file contains an array of events
 */
function loadAllEvents(): EventsData {
  // Combine all season arrays into one events array
  const allEvents = [
    ...season1,
    // Add more seasons as needed:
    // ...season2,
    // ...season3,
  ];

  // Wrap in EventsData structure and validate through schema
  const rawData = { events: allEvents };
  return eventsDataSchema.parse(rawData);
}

// Export singleton instance
export const eventsData = loadAllEvents();
