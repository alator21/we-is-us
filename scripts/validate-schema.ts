import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { join } from 'path';

const ajv = new Ajv({ allErrors: true });

// Load schema and data
const schemaPath = join(process.cwd(), 'data', 'scenes.schema.json');
const dataPath = join(process.cwd(), 'data', 'scenes.json');

const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Validate
const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error('❌ Schema validation failed:');
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
} else {
  console.log('✅ Schema validation passed!');
  process.exit(0);
}
