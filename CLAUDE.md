# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"We Is Us" is a web application for visualizing the non-linear timeline of a TV show (working with Apple TV's show that tells its story by navigating back and forth in time). The project stores event data with timestamps and displays them in a web interface.

### Core Concept

The show presents events out of chronological order. Each event has a timestamp (or delta from time 0) that represents when it occurs in the actual story timeline. This application:

- Stores event records with their timestamp deltas in a human-readable file format (committed to the repository)
- Displays events in various views (chronological, as-aired, timeline visualization)
- Helps viewers understand the non-linear narrative structure
- Allows anyone to browse the timeline data directly on GitHub

## Data Model

### event Record Structure

Each event is a flexible object with:

- **id**: UUID (universally unique identifier) for the event
- **delta**: Time offset from time 0 (e.g., "5 days", "-2 hours", "3 weeks")
- **summary**: Brief summary of the event (max 200 characters, shown in timeline cards)
- **description**: Detailed description of the event (shown in event detail view)
- **images**: Array of image paths/URLs for the event
- **tags**: Array of key:value tags (e.g., "episode:1", "location:Hospital", "character:John")

### Tag System

Tags provide metadata with strict validation enforced by the schema:

- **Format**: `"key:value"` (e.g., `"episode:1"`, `"character:Sarah"`)
- **Allowed tag keys**: `episode`, `season`, `character`, `location`, `theme`, `time`
- **Validation rules**:
  - `episode` and `season` values must be numbers (e.g., `"episode:1"`, `"season:2"`)
  - All other tag values must start with a capital letter (e.g., `"character:Carol"`, `"location:Hospital"`)
  - Only the defined tag keys are allowed - custom keys will be rejected
- Adding new tag types requires updating the schema in `/data/events.schema.json`

## Technology Stack

### Frontend

- **Framework**: Astro (with SSR mode enabled)
- **Adapter**: @astrojs/node (Node.js standalone server)
- **Styling**: Tailwind CSS v4
- **Validation**: Zod (type-safe schema validation for URL params)
- **Code formatting**: Prettier (with Astro plugin)
- **Runtime**: Bun (package manager and runtime)
- **Rendering**: Server-side rendering (SSR) for dynamic URL parameter handling
- **Hosting**: Requires Node.js hosting (Vercel, Netlify Functions, Railway, etc.)
- **Deployment**: Build creates a standalone Node.js server

### Data Updates

- Edit season files in `/data/events/` directory (e.g., `season-1.json`, `season-2.json`)
- Each season file contains an array of event objects
- Commit and push changes
- Hosting platform automatically rebuilds and deploys
- No traditional backend needed for basic functionality

### Database

- **Type**: File-based, human-readable data stored in repository
- **Format**: JSON files split by season for better maintainability
- **Location**: Event data stored in `/data/events/` directory, one file per season
- **Structure**: Each season file is a JSON array of events (not wrapped in an "events" key)
- **Loading**: All season files are automatically loaded and merged by `/src/lib/eventsData.ts`
- **Benefits**: Version-controlled, easily viewable on GitHub, no external database hosting needed, scalable as more seasons are added

## Project Structure

```
/data
  /events
    season-1.json      # Season 1 event data (array of events)
    season-2.json      # Season 2 event data (add as needed)
  events.schema.json   # JSON Schema for data validation
/public
  /images              # event images (served as static assets)
/scripts
  validate-schema.ts   # Schema validation script (validates all season files)
  split-events-by-season.ts  # Utility to split events.json into season files
/src
  /components
    EventCard.astro           # Event card component for grid/list views
    EventDetailCard.astro     # Full event detail display
    EventNavigation.astro     # Prev/Next navigation
    BackButton.astro          # Reusable back button
    TimeProgressionIndicator.astro  # Time gaps between events
    FirstEventIndicator.astro # Timeline start marker
    MarkerIndicator.astro     # Important time markers
    FilterBanner.astro        # Spoiler protection status
    LayoutToggle.astro        # Grid/List view switcher
    Navbar.astro              # Navigation bar component
  /lib
    eventsData.ts      # Data loader that merges all season files
    eventSchema.ts     # Zod schema for type-safe event validation
    urlParams.ts       # Type-safe URL parameter parsing with Zod
    deltaParser.ts     # Parse and sort events by delta timestamps
  /pages
    index.astro        # Main timeline viewer page (requires filter params)
    filter.astro       # Spoiler filter page (landing page)
    /event
      [id].astro       # Individual event detail page
  /styles
    global.css         # Tailwind CSS and custom styles
.prettierrc            # Prettier configuration
.prettierignore        # Prettier ignore patterns
astro.config.mjs       # Astro configuration (includes Tailwind)
package.json           # Project dependencies and scripts
tsconfig.json          # TypeScript configuration
```

### Data File Format

Event data is organized into season files in `/data/events/` directory. Each season file is a JSON array of event objects.

Example structure of a season file (`/data/events/season-1.json`):

```json
[
  {
    "id": "f1ac5bd5-a279-45d6-84dd-d7364babf112",
    "delta": "-2617 days",
    "summary": "Brief summary shown in timeline cards (max 200 chars)",
    "description": "Full detailed description shown in event detail view",
    "images": ["/images/event_003_01.jpg"],
    "tags": ["season:1", "episode:3", "location:Hospital"]
  }
]
```

Each event includes:

- **id**: UUID (must be valid UUID v4 format)
- **delta**: Time offset from time 0 (supports negative values for flashbacks)
- **summary**: Brief description (max 200 characters, shown in timeline cards)
- **description**: Detailed description (shown in event detail view)
- **images**: Array of image paths (must start with `/images/`)
- **tags**: Array of tags for categorization (must be `key:value` format)

### Schema Validation

The data structure is enforced by JSON Schema (`/data/events.schema.json`):

- **UUID format**: Must be valid UUID v4
- **Delta format**: Must match pattern like "5 days", "-2 hours", "3 weeks"
- **Summary**: Must be 1-200 characters
- **Description**: Must not be empty
- **Image paths**: Must start with `/images/` and have valid extensions (.jpg, .jpeg, .png, .gif, .webp)
- **Tag keys**: Only `episode`, `season`, `character`, `location`, `theme`, `time`, `marker` are allowed
- **Tag values**:
  - `episode` and `season` must be numbers
  - Other tags must start with a capital letter (e.g., "Carol", "Hospital")
- **Required fields**: All fields (id, summary, description, tags) are required (delta and images are optional)
- Validation runs automatically before every build

### Data Management

Event records are managed by editing season files in `/data/events/`:

- Edit season files directly (e.g., `/data/events/season-1.json`, `/data/events/season-2.json`)
- Each file contains a JSON array of event objects
- UUIDs should be generated when creating new events (use UUID v4)
- Run `bun run validate` to check all season files against schema before committing
- After editing, commit and push to trigger rebuild
- To add a new season: create `season-N.json` and add it to `/src/lib/eventsData.ts`

**Important:** Always validate data before committing to ensure it matches the schema. Invalid data will cause builds to fail.

## Development Commands

```bash
# Install dependencies
bun install

# Validate data against schema
bun run validate

# Type check the project
bun run typecheck

# Format code with Prettier
bun run format

# Check if code is formatted correctly
bun run format:check

# Run development server (SSR mode)
bun run dev

# Build for production (validates first, then builds SSR server)
bun run build

# Preview production build (runs the built Node.js server)
bun run preview
```

The dev server runs at http://localhost:4321 by default.

**Note:**

- The build command automatically runs validation first. If the data doesn't match the schema, the build will fail.
- The project uses **SSR (Server-Side Rendering)** mode to handle dynamic URL parameters for spoiler filtering
- The build output is a standalone Node.js server in the `dist/` directory

## Features

### Spoiler Protection

- Users land on `/filter` - a dedicated page for selecting their viewing progress
- Form on `/filter` submits to `/` (timeline page) with filter parameters
- Timeline page (`/`) requires filter parameters - redirects to `/filter` if missing
- **No client-side JavaScript required** - pure HTML forms and server-side routing
- events are filtered based on URL query parameters (`?season=1&episode=5` or `?showAll=true`)
- **Type-safe URL params**: Uses Zod schemas (`/src/lib/urlParams.ts`) for validation and type safety
- Users can check "I've seen everything" to bypass filtering
- "Change Filter" button on timeline page redirects to `/filter`
- Filter status is displayed in a banner showing current filter settings

## Key Implementation Notes

- **event IDs**: Use UUID v4 for guaranteed uniqueness across all events
- **Delta format**: String-based (e.g., "5 days", "-2 hours") for human readability; parser will need to convert to numeric values for sorting
- Negative deltas represent flashbacks (events before time 0)
- Tags are flexible and can be added/modified without schema changes
- Multiple images per event supported via array
- **SSR mode**: Site uses server-side rendering to handle URL parameters dynamically
- **Data loading**: event data is loaded from `/data/events.json` at request time
- **Image paths**: Reference as `/images/filename.jpg` (served from `/public/images/`)
- **Styling**: Use Tailwind CSS utility classes for all styling (imported via `/src/styles/global.css`)
- **Code formatting**: Run `bun run format` before committing to ensure consistent code style
- **No client-side JavaScript**: The site works entirely without JavaScript. Spoiler filtering uses URL parameters and server-side rendering
- **URL param validation**: Use Zod schemas in `/src/lib/urlParams.ts` for type-safe URL parameter parsing and validation
- Data is stored in version-controlled files, making it easy for contributors to submit PRs with corrections
- Data files should be formatted for readability (Prettier handles JSON formatting automatically)
- Images should be optimized for web (consider file size)
- **Data updates**: In SSR mode, changes to `/data/events.json` require server restart to take effect (no rebuild needed)
- **Code changes**: Changes to `.astro` files or logic require rebuild and server restart
