# github-readme-leetocde

A small Next.js app that generates dynamic SVG cards for LeetCode statistics. It's inspired by
github-readme-stats but focused on LeetCode public profile stats and recent activity.

Quick start

1. Install dependencies:

   npm install

2. Run locally:

   LEETCODE_CACHE_TTL=60 npm run dev

3. Open a browser to:

   http://localhost:3000/<username>

Notes

- The app fetches data from LeetCode's public GraphQL endpoint. No auth is required for public
  profiles.
- There's a simple file-backed cache used for local development at `.cache/leetcode-cache.json`.
- If you change GraphQL queries, make sure to handle missing fields gracefully; LeetCode's API
  sometimes returns 200 even when data is missing.

Contributing

See `CONTRIBUTING.md` for a quick guide to contributing.
# LeetCode Stats Card 📊

Beautiful SVG cards for your GitHub README showing off your LeetCode progress. Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats).

This repo is a small, focused server that fetches public LeetCode data and renders an SVG card on the fly. It was built to be easy to fork and run locally — the README and CONTRIBUTING files below explain how.

Contributors
- NinePiece2 — original author & maintainer

Quick Start
```bash
npm install
npm run dev
# then visit http://localhost:3000/<username>
```

Examples
- Basic card: `http://localhost:3000/NinePiece2`
- With graph + recent: `http://localhost:3000/NinePiece2?show=graph,recent`

Notes
- The project uses a small file-backed cache at `.cache/leetcode-cache.json` for local dev. Delete it if you change API parsing logic.
# LeetCode Stats Card 📊

Beautiful SVG cards for your GitHub README showing off your LeetCode progress. Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) and [LeetCode-Stats-Card](https://github.com/JacobLinCool/LeetCode-Stats-Card).

## Quick Start

Just add this to your README:

```markdown
![LeetCode Stats](https://cloudflare_URL/your-username)
```

## Features

- 🎨 40+ themes (same as github-readme-stats)
- 📈 Activity heatmap (like GitHub contributions)
- 🔥 Recent submissions
- ⚡ Fast and lightweight
- 🎯 No tracking, no ads

## Examples

**Basic card:**
```markdown
![LeetCode](https:/cloudflare_URL/NinePiece2)
```

**Dark theme:**
```markdown
![LeetCode](https://cloudflare_URL/NinePiece2?theme=dark)
```

**With extras:**
```markdown
![LeetCode](https://cloudflare_URL/NinePiece2?theme=tokyonight&show=graph,recent)
```

## Options

| Option | Type | Default | What it does |
|--------|------|---------|--------------|
| `theme` | string | `default` | Choose a color scheme |
| `show` | string | - | Add `graph` and/or `recent` (comma-separated) |
| `hide_rank` | boolean | `false` | Hide the ranking badge |
| `hide_border` | boolean | `false` | Remove the card border |
| `card_width` | number | `500` | Custom width in pixels |

## Themes

We support all the themes from github-readme-stats. Some popular ones:

- `default` - Clean and simple
- `dark` - Dark mode
- `radical` - Pink/blue vibe
- `tokyonight` - Calm purple tones
- `gruvbox` - Retro terminal look
- `dracula` - The classic vampire theme

[See all themes →](/src/config/themes.ts)

## Deploy Your Own

1. Fork this repo
2. Deploy to Clouflare Worker (it's free!)
   1. Set Build Command to ``
   2. Set Deploy Command to ``
3. Use your deployment URL

## Development

```bash
# Install
npm install

# Start dev server
npm run dev

# Build
npm run build
```

Built with:
- Next.js 15
- TypeScript
- Tailwind CSS

## How It Works

1. You put the image URL in your README
2. When someone views your profile, GitHub fetches the image
3. Our API grabs your stats from LeetCode
4. We generate an SVG on the fly
5. GitHub caches it for ~30 minutes

No database needed! Everything is generated fresh each time (with some caching).

## Contributing

Found a bug? Want a new feature? PRs welcome!

Please:
- Follow the existing code style
- Test your changes
- Update the README if needed

## Credits

- Theme system from [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- Inspired by [JacobLinCool/LeetCode-Stats-Card](https://github.com/JacobLinCool/LeetCode-Stats-Card)

## License

MIT - do whatever you want with it!

