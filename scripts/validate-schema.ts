import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { eventsDataSchema, type EventsData } from '../src/lib/eventSchema.js';

const ajv = new Ajv({ allErrors: true });

// Load schema and data
const schemaPath = join(process.cwd(), 'data', 'events.schema.json');
const dataPath = join(process.cwd(), 'data', 'events.json');

const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
const rawData: unknown = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Validate with JSON Schema first (for backwards compatibility)
const validate = ajv.compile(schema);
const valid = validate(rawData);

if (!valid) {
  console.error('❌ JSON Schema validation failed:');
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}

// Validate with Zod schema for type safety
let data: EventsData;
try {
  data = eventsDataSchema.parse(rawData);
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
