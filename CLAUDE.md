# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"We Is Us" is a web application for visualizing the non-linear timeline of a TV show (working with Apple TV's show that tells its story by navigating back and forth in time). The project stores scene data with timestamps and displays them in a web interface.

### Core Concept

The show presents scenes out of chronological order. Each scene has a timestamp (or delta from time 0) that represents when it occurs in the actual story timeline. This application:

- Stores scene records with their timestamp deltas in a human-readable file format (committed to the repository)
- Displays scenes in various views (chronological, as-aired, timeline visualization)
- Helps viewers understand the non-linear narrative structure
- Allows anyone to browse the timeline data directly on GitHub

## Data Model

### Scene Record Structure

Each scene is a flexible object with:

- **id**: UUID (universally unique identifier) for the scene
- **delta**: Time offset from time 0 (e.g., "5 days", "-2 hours", "3 weeks")
- **text**: Descriptive text accompanying the scene
- **images**: Array of image paths/URLs for the scene
- **tags**: Array of key:value tags (e.g., "episode:1", "location:Hospital", "character:John")

### Tag System

Tags provide metadata with strict validation enforced by the schema:

- **Format**: `"key:value"` (e.g., `"episode:1"`, `"character:Sarah"`)
- **Allowed tag keys**: `episode`, `season`, `character`, `location`, `theme`, `time`
- **Validation rules**:
  - `episode` and `season` values must be numbers (e.g., `"episode:1"`, `"season:2"`)
  - All other tag values must start with a capital letter (e.g., `"character:Carol"`, `"location:Hospital"`)
  - Only the defined tag keys are allowed - custom keys will be rejected
- Adding new tag types requires updating the schema in `/data/scenes.schema.json`

## Technology Stack

### Frontend

- **Framework**: Astro (static site generator)
- **Styling**: Tailwind CSS v4
- **Code formatting**: Prettier (with Astro plugin)
- **Runtime**: Bun (package manager and runtime)
- **Build**: Static site - reads `/data/scenes.json` at build time
- **Hosting**: Static hosting (GitHub Pages, Netlify, Vercel)
- **Deployment**: Push to repo triggers automatic rebuild and deploy

### Data Updates

- Edit `/data/scenes.json` directly (manual or with local tools)
- Commit and push changes
- Hosting platform automatically rebuilds and deploys
- No traditional backend needed for basic functionality

### Database

- **Type**: File-based, human-readable data stored in repository
- **Format**: JSON (recommended for structured data with easy parsing and GitHub diff viewing)
- **Location**: Data files stored in `/data` directory
- **Benefits**: Version-controlled, easily viewable on GitHub, no external database hosting needed

## Project Structure

```
/data
  scenes.json          # Main scene timeline data
  scenes.schema.json   # JSON Schema for data validation
/public
  /images              # Scene images (served as static assets)
/scripts
  validate-schema.ts   # Schema validation script
/src
  /components
    Navbar.astro       # Navigation bar component
    SpoilerFilter.astro # Spoiler filter modal (season/episode selection)
  /pages
    index.astro        # Main timeline viewer page
  /styles
    global.css         # Tailwind CSS imports
.prettierrc            # Prettier configuration
.prettierignore        # Prettier ignore patterns
astro.config.mjs       # Astro configuration (includes Tailwind)
package.json           # Project dependencies and scripts
```

### Data File Format

See `/data/scenes.json` for example structure. Each scene includes:

- UUID (must be valid UUID v4 format)
- Delta (time offset from time 0, supports negative values for flashbacks)
- Text description
- Array of image paths (must start with `/images/`)
- Array of tags for flexible categorization (must be `key:value` format)

### Schema Validation

The data structure is enforced by JSON Schema (`/data/scenes.schema.json`):

- **UUID format**: Must be valid UUID v4
- **Delta format**: Must match pattern like "5 days", "-2 hours", "3 weeks"
- **Image paths**: Must start with `/images/` and have valid extensions (.jpg, .jpeg, .png, .gif, .webp)
- **Tag keys**: Only `episode`, `season`, `character`, `location`, `theme`, `time` are allowed
- **Tag values**:
  - `episode` and `season` must be numbers
  - Other tags must start with a capital letter (e.g., "Carol", "Hospital")
- **Required fields**: All fields (id, delta, text, images, tags) are required
- Validation runs automatically before every build

### Data Management

Scene records are managed by editing `/data/scenes.json`:

- Edit JSON file directly or use local tools
- UUIDs should be generated when creating new scenes (use UUID v4)
- Run `bun run validate` to check data against schema before committing
- After editing, commit and push to trigger rebuild
- Future enhancement: Admin interface could be added as a separate tool

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

# Run development server
bun run dev

# Build static site (validates first, then builds)
bun run build

# Preview production build
bun run preview
```

The dev server runs at http://localhost:4321 by default.

**Note:** The build command automatically runs validation first. If the data doesn't match the schema, the build will fail.

## Features

### Spoiler Protection

- On first visit, users are prompted to select how far they've watched (season/episode)
- Preference is stored in localStorage
- Only scenes up to the user's progress are displayed
- Users can check "I've seen everything" to bypass filtering
- Filter automatically applies on subsequent visits

## Key Implementation Notes

- **Scene IDs**: Use UUID v4 for guaranteed uniqueness across all scenes
- **Delta format**: String-based (e.g., "5 days", "-2 hours") for human readability; parser will need to convert to numeric values for sorting
- Negative deltas represent flashbacks (events before time 0)
- Tags are flexible and can be added/modified without schema changes
- Multiple images per scene supported via array
- **Static site**: Data is loaded at build time from `/data/scenes.json`
- **Image paths**: Reference as `/images/filename.jpg` (served from `/public/images/`)
- **Styling**: Use Tailwind CSS utility classes for all styling (imported via `/src/styles/global.css`)
- **Code formatting**: Run `bun run format` before committing to ensure consistent code style
- Data is stored in version-controlled files, making it easy for contributors to submit PRs with corrections
- Data files should be formatted for readability (Prettier handles JSON formatting automatically)
- Images should be optimized for web (consider file size)
- **Rebuilds**: Any change to data or code requires rebuild to see updates on live site
