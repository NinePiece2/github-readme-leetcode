# Development Guide

A Next.js-based service that generates SVG cards displaying LeetCode statistics for GitHub READMEs.

## Project Overview

This is a simple API that:
- Takes a LeetCode username via URL path (`/username`)
- Fetches their stats from LeetCode's public GraphQL API
- Returns a customizable SVG card

Built with Next.js 15 App Router, TypeScript, and Tailwind CSS.

## File Structure

```
src/
├── app/
│   ├── [username]/
│   │   └── route.ts          # Main API endpoint
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── lib/
│   ├── leetcode-api.ts        # LeetCode data fetching
│   ├── svg-generators.ts      # SVG card generation
│   ├── error-utils.ts         # Error handling
│   └── queries.ts             # GraphQL queries
├── types/
│   └── leetcode.ts            # TypeScript interfaces
└── config/
    └── themes.ts              # Theme definitions
```

## Key Files

### API Route (`src/app/[username]/route.ts`)
The main endpoint that:
1. Extracts username from URL params
2. Parses query parameters (theme, show options)
3. Fetches LeetCode data
4. Generates and returns SVG

**Important**: Next.js 15 requires `await params` in route handlers.

### Data Fetching (`src/lib/leetcode-api.ts`)
Functions for fetching from LeetCode's GraphQL API:
- `fetchLeetCodeStats()` - Orchestrates all data fetching
- Handles user stats, calendar data, and recent submissions
- Processes raw API responses into clean data structures

### SVG Generation (`src/lib/svg-generators.ts`)
Core rendering functions:
- `generateLeetCodeCard()` - Main card assembly
- `generateProgressCircle()` - Central progress indicator
- `generateDifficultyStats()` - Easy/Medium/Hard breakdowns
- `generateContributionGraph()` - Activity heatmap
- `generateRecentQuestions()` - Recent submissions list

### Themes (`src/config/themes.ts`)
Theme color definitions. Each theme has:
- `title_color` - Main heading color
- `icon_color` - Progress circle/accent color
- `text_color` - Body text color
- `bg_color` - Background color
- `border_color` - Border/divider color
- `accent_color` - Highlight color

## Common Tasks

### Adding a New Theme
1. Add theme object to `rawThemes` in `src/config/themes.ts`
2. Update theme list in `src/app/page.tsx` for the gallery
3. Test with `http://localhost:3000/username?theme=newtheme`

### Modifying Card Layout
Edit functions in `src/lib/svg-generators.ts`:
- Adjust coordinates in `transform="translate(x, y)"` for positioning
- Change font sizes in CSS style definitions
- Update `cardHeight` calculation for vertical spacing

### Adding New Data
1. Add GraphQL query to `src/lib/queries.ts`
2. Update `LeetCodeStats` interface in `src/types/leetcode.ts`
3. Add processing logic in `fetchLeetCodeStats()`
4. Create SVG generator function in `src/lib/svg-generators.ts`
5. Call generator in `generateLeetCodeCard()`

## Development Workflow

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

### Testing Endpoints
```
# Basic card
http://localhost:3000/username

# With theme
http://localhost:3000/username?theme=dark

# With extras
http://localhost:3000/username?theme=radical&show=graph,recent

# Custom width
http://localhost:3000/username?card_width=600
```

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | string | `default` | Color scheme name |
| `show` | string | - | Comma-separated: `graph`, `recent` |
| `hide_rank` | boolean | `false` | Hide ranking badge |
| `hide_border` | boolean | `false` | Remove card border |
| `card_width` | number | `500` | Card width in pixels |

## Error Handling

Errors are handled in `src/lib/error-utils.ts`:
- User not found → 404 with error card
- API failures → 500 with error card
- Network issues → 500 with error card

Error cards are themed SVGs that display user-friendly messages.

## Code Style Guidelines

- Use descriptive variable names (avoid single letters except in loops)
- Add comments for non-obvious logic
- Keep functions focused on one task
- Use TypeScript strict mode
- Prefer explicit types over inference for public APIs

## SVG Best Practices

- Use semantic grouping with `<g>` elements
- Add ARIA labels for accessibility
- Keep animations subtle (0.3-0.8s durations)
- Use CSS classes over inline styles when possible
- Test with different data ranges (0 problems, 1000+ problems, etc.)

## Common Gotcas

1. **Circle Progress Direction**: Progress circles start at 3 o'clock by default. The path in `generateProgressCircle` is designed to start at 12 o'clock and fill clockwise.

2. **Stroke Dash Animation**: The progress arc uses stroke-dasharray and stroke-dashoffset with SMIL animation to create the fill-in effect on load.

3. **Text Anchoring**: Use `text-anchor="middle"` with centered x-coordinate for centering

4. **Async Params**: Always `await params` in Next.js 15 route handlers

5. **GraphQL Errors**: LeetCode API returns 200 even on errors. Check `data.matchedUser` for null.

## Performance Notes

- SVG generation is fast (~10ms)
- LeetCode API calls are the bottleneck (~500-1500ms)
- Consider adding Redis cache for production
- Current setup has no caching (fresh data on every request)

## Future Ideas

- Add caching layer (Redis/Vercel KV)
- Support custom color overrides via query params
- Add more graph types (language breakdown, difficulty over time)
- Implement rate limiting
- Add unit tests for SVG generation
- Support dark mode toggle
- Add locale support for numbers/dates

## Deployment

Designed for Vercel deployment:
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

Environment variables needed: None (uses public LeetCode API)

## Troubleshooting

**Issue**: Progress circle doesn't animate
- Check SMIL `<animate>` element is present in the SVG
- Verify `stroke-dasharray` and `stroke-dashoffset` values

**Issue**: Wrong acceptance rate
- Verify calculation uses total submissions across all difficulties
- Check GraphQL response structure

**Note**: This project uses a file-backed persistent cache at `.cache/leetcode-cache.json` when running locally. If you change API parsing or calculation logic (like acceptance rate), clear or delete that file so the next request fetches fresh data from LeetCode.

**Issue**: Recent questions not showing
- Ensure `show=recent` query param is present
- Check GraphQL response for `recentAcSubmissionList`

**Issue**: Theme colors not applying
- Verify theme name exists in `rawThemes`
- Check color format (no # prefix needed in theme definition)
- Ensure `getTheme()` normalizes the theme object

## Resources

- [LeetCode GraphQL Endpoint](https://leetcode.com/graphql)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [SVG Reference](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [GitHub README Stats](https://github.com/anuraghazra/github-readme-stats) (inspiration)
