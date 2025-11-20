import Ajv from 'ajv';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { eventsDataSchema, type EventsData, type Event } from '../src/lib/eventSchema.js';

const ajv = new Ajv({ allErrors: true });

// Load schema
const schemaPath = join(process.cwd(), 'data', 'events.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

// Load all season files from data/events directory
const eventsDir = join(process.cwd(), 'data', 'events');
const seasonFiles = readdirSync(eventsDir).filter((file) => file.endsWith('.json'));

console.log(`📂 Found ${seasonFiles.length} season file(s) to validate`);

const allEvents: Event[] = [];

// Validate each season file individually
for (const file of seasonFiles) {
  const filePath = join(eventsDir, file);
  const rawSeasonData: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));

  // Validate with JSON Schema (expects array of events, not wrapped in "events" key)
  const seasonValidate = ajv.compile({ type: 'array', items: schema.properties.events.items });
  const seasonValid = seasonValidate(rawSeasonData);

  if (!seasonValid) {
    console.error(`❌ JSON Schema validation failed for ${file}:`);
    console.error(JSON.stringify(seasonValidate.errors, null, 2));
    process.exit(1);
  }

  console.log(`✅ ${file} passed JSON Schema validation`);

  // Add to combined array for Zod validation
  if (Array.isArray(rawSeasonData)) {
    allEvents.push(...(rawSeasonData as Event[]));
  }
}

// Validate combined data with Zod schema for type safety
let data: EventsData;
try {
  data = eventsDataSchema.parse({ events: allEvents });
} catch (error) {
  console.error('❌ Zod schema validation failed:');
  console.error(error);
  process.exit(1);
}

// Check for duplicate IDs
const ids = data.events.map((event) => event.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

if (uniqueDuplicates.length > 0) {
  console.error('❌ Duplicate IDs found:');
  uniqueDuplicates.forEach((id) => {
    const indices = ids
      .map((eventId, idx) => (eventId === id ? idx : -1))
      .filter((idx) => idx !== -1);
    console.error(`  - ID "${id}" appears at indices: ${indices.join(', ')}`);
  });
  process.exit(1);
}

console.log('✅ Schema validation passed!');
console.log('✅ No duplicate IDs found!');
process.exit(0);
