# We Is Us - Timeline Viewer

An interactive timeline viewer for Apple TV+'s "Pluribus" - helping viewers understand the show's non-linear narrative by organizing events chronologically.

## Features

- 📅 **Chronological Timeline** - View all events sorted by their actual timeline position
- 🔒 **Spoiler Protection** - Filter events based on your viewing progress
- 🎯 **Time Markers** - Highlighted moments marking significant timeline events
- 🖼️ **Event Details** - Rich descriptions with images for each event
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⏱️ **Episode Countdown** - Live countdown to the next episode

## Contributing

We welcome contributions! Here's how you can help:

### Adding or Improving Event Data

Event data is stored in season files under `/data/events/`. Each event includes:

- **Timestamp** (delta from time 0)
- **Summary** (brief description, max 200 characters)
- **Description** (detailed explanation)
- **Images** (screenshots from the show)
- **Tags** (season, episode, location, characters, etc.)

#### ⚠️ Important Guidelines

**DO NOT include information from episodes that haven't aired yet.** Only add events from episodes that have been officially released on Apple TV+.

When adding events:

1. Be accurate with timestamps relative to "time 0" in the show
2. Use proper tag formatting: `"season:1"`, `"episode:3"`, `"character:Carol"`, etc.
3. Add images to `/public/images/` following the naming convention
4. Run validation before submitting: `bun run validate`

#### How to Add Events

1. Fork the repository
2. Edit the appropriate season file in `/data/events/` (e.g., `season-1.json`)
3. Add your event following the existing format:

```json
{
  "id": "unique-uuid-v4-here",
  "delta": "-2617 days",
  "summary": "Brief summary of what happens (max 200 chars)",
  "description": "Detailed description of the event with full context",
  "images": ["/images/event_xxx_01.jpg"],
  "tags": ["season:1", "episode:3", "location:Hospital", "character:Carol"]
}
```

4. Generate a UUID v4 for new events (use [uuidgenerator.net](https://www.uuidgenerator.net/version4))
5. Run `bun run validate` to ensure your changes are valid
6. Submit a pull request

### Reporting Issues

Found an incorrect timestamp or missing event? Please [open an issue](../../issues) with:

- Episode number where the event occurs
- What needs to be corrected
- Relevant screenshots (if applicable)

## Development

### Prerequisites

- [Bun](https://bun.sh/) (package manager and runtime)
- Node.js environment (for deployment)

### Setup

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Validate event data
bun run validate

# Type check
bun run typecheck

# Build for production
bun run build
```

### Project Structure

```
/data/events/       # Event data split by season
/public/images/     # Event screenshots
/src/components/    # Astro components
/src/lib/           # Utilities and schemas
/src/pages/         # Page routes
/scripts/           # Build and validation scripts
```

## Technology Stack

- **Framework**: [Astro](https://astro.build/) with SSR
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/) for type-safe schemas
- **Runtime**: [Bun](https://bun.sh/)
- **Deployment**: Cloudflare Pages

## Data Schema

Events must follow the JSON schema defined in `/data/events.schema.json`. Key fields:

- `id`: UUID v4 (required, unique)
- `delta`: Time offset from time 0 (e.g., "-439 days", "5 hours")
- `summary`: Brief description (1-200 characters)
- `description`: Full event description
- `images`: Array of image paths (optional)
- `tags`: Array of metadata tags (required)

### Allowed Tags

- `season:N` - Season number (required)
- `episode:N` - Episode number (required)
- `character:Name` - Character involved
- `location:Name` - Location where event occurs
- `theme:Name` - Thematic categorization
- `time:Name` - Time period descriptor
- `marker:Name` - Marks important timeline moments

## Configuration

### Next Episode Countdown

Update `/src/config/nextEpisode.ts` when a new episode is scheduled:

```typescript
export const nextEpisode = {
  airDate: '2025-01-24T02:00:00Z', // ISO 8601 format (UTC)
  episodeNumber: 'S1E7',
};
```

## License

This is a fan-made project for educational and informational purposes. All show content and imagery are property of Apple TV+ and the show's creators.

## Disclaimer

This project is not affiliated with, endorsed by, or connected to Apple TV+ or the creators of "Pluribus". It is a community-driven effort to help fans better understand the show's timeline.

---

**Enjoying the timeline?** Give us a ⭐️ and share with other fans!
