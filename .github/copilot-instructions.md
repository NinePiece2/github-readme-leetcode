# Copilot Instructions for LeetCode Stats Card

## What This Project Does

Generates dynamic SVG cards showing LeetCode statistics. Think github-readme-stats but for LeetCode.

- Single API route at `/[username]` returns SVG cards
- Fetches real-time data from LeetCode GraphQL API
- Supports 40+ themes and customization options
- No database - everything is generated on the fly

## Code Organization

The codebase is split into logical modules:

**API Layer** (`src/app/[username]/route.ts`)
- Clean 80-line route handler
- Parses query params, fetches data, generates SVG
- Uses Next.js 15 App Router patterns

**Data Layer** (`src/lib/leetcode-api.ts`, `src/lib/queries.ts`)
- GraphQL queries for user stats, calendar, recent submissions
- Data transformation from LeetCode API to our types
- Error handling for missing users and API failures

**Rendering Layer** (`src/lib/svg-generators.ts`)
- SVG generation with inline styles
- Modular functions for each card section
- Animations using SMIL and CSS

**Configuration** (`src/config/themes.ts`, `src/types/leetcode.ts`)
- Theme color schemes
- TypeScript interfaces
- Type safety across the codebase

## Key Patterns

### Next.js 15 Route Handlers
```typescript
export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params; // Must await!
  // ... rest of handler
}
```

### LeetCode Data Fetching
```typescript
// Three main queries:
userStatsQuery        // Always fetched - basic stats
userCalendarQuery     // Optional - when show=graph
recentSubmissionsQuery // Optional - when show=recent

// API: https://leetcode.com/graphql
// No auth needed for public profiles
```

### SVG Generation
```typescript
// Each component is a separate function
generateProgressCircle()  // Center circle with progress
generateDifficultyStats() // Easy/Medium/Hard bars
generateContributionGraph() // GitHub-style heatmap
generateRecentQuestions()  // Recent 5 problems

// All return SVG strings that get assembled in generateLeetCodeCard()
```

### Theme System
```typescript
// Themes inherit from github-readme-stats
// Colors stored without # prefix
// getTheme() normalizes to full Theme interface
// 40+ themes available
```

## Important Details

### Progress Circle Start Position
The progress circle needs special handling to start at 12 o'clock:
- Uses SVG path instead of circle for reliable start point
- Path draws from top: `M 0 -${radius} a ...`
- SMIL animation for fill-in effect on load
- Animates stroke-dashoffset from circumference to final offset

### Difficulty Bar Animation
Bars use CSS transform animation:
- Start at `transform: scaleX(0)`
- Animate to `transform: scaleX(1)`
- Different delays for stagger effect
- 0.6s duration with ease-in-out

### Error Handling
- Return SVG error cards (not JSON)
- 404 for user not found
- 500 for API failures
- All errors are themed SVGs

### Caching Strategy
Currently no caching:
- Every request hits LeetCode API
- Consider adding Redis/Vercel KV for production
- GitHub caches images for ~30 minutes

## When Making Changes

### Adding Features
1. Check if it needs new GraphQL data (add to queries.ts)
2. Update TypeScript types (types/leetcode.ts)
3. Add processing logic (leetcode-api.ts)
4. Create SVG generator (svg-generators.ts)
5. Wire it up in the main card generator

### Modifying Layout
- All positions use SVG transforms: `transform="translate(x, y)"`
- Adjust coordinates for repositioning
- Update cardHeight calculation if adding vertical content
- Test with different username lengths and data ranges

### New Themes
- Add to rawThemes object in config/themes.ts
- Follow existing color naming convention
- Test with different card configurations
- Update landing page theme gallery

### Debugging
- Check browser DevTools Network tab for API responses
- Inspect SVG source for structure issues
- Test animations by disabling cache
- Use different usernames to test edge cases

## Common Gotchas

1. **Next.js 15 params** - Always await params in route handlers
2. **SVG namespaces** - Not needed for inline SVG
3. **Color formats** - Store colors without # prefix in themes
4. **Text overflow** - Truncate long titles (35 chars max)
5. **GraphQL errors** - API returns 200 even on user not found
6. **Animation timing** - Stagger delays to avoid overwhelming users
7. **Stroke caps** - Use `stroke-linecap="round"` for smooth progress arcs

## Development Tips

- Run `npm run dev` for hot reload
- Test with multiple usernames (edge cases matter)
- Check SVG output in browser inspector
- Verify TypeScript types compile
- Test theme variations
- Check mobile rendering (SVG is responsive)

## File Locations

Quick reference for where things are:

- Route handler: `src/app/[username]/route.ts`
- SVG generation: `src/lib/svg-generators.ts`
- Data fetching: `src/lib/leetcode-api.ts`
- GraphQL queries: `src/lib/queries.ts`
- Types: `src/types/leetcode.ts`
- Themes: `src/config/themes.ts`
- Error handling: `src/lib/error-utils.ts`
- Landing page: `src/app/page.tsx`

## Testing Locally

```bash
npm run dev

# Then test these URLs:
http://localhost:3000/NinePiece2
http://localhost:3000/NinePiece2?theme=dark
http://localhost:3000/NinePiece2?theme=radical&show=graph,recent
http://localhost:3000/invaliduser  # Should show error card
```

## Helpful Context

- LeetCode API is public, no auth needed
- GraphQL endpoint: https://leetcode.com/graphql
- SVGs are generated server-side on every request
- Built for Vercel deployment (serverless functions)
- Designed to be embedded in GitHub READMEs

## Style Preferences

- Casual comments over rigid documentation
- Descriptive variable names (recentFive vs displayQuestions)
- Natural function names (formatTimeAgo vs getTimeAgo)
- Practical over perfect
- Working code over clever code