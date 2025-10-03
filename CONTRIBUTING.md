Thanks for taking a look! This project started as a compact Next.js server that renders LeetCode
SVG stat cards for README files. If you'd like to contribute, a few helpful notes:

- Keep changes small and focused. SVG layout changes should come with a screenshot or a small
  description of why the layout needed adjustment.
- If you're changing GraphQL queries, please verify they work against https://leetcode.com/graphql
  (no auth required for public profiles). Prefer adding a fallback query for missing fields rather
  than making larger structural changes to the API responses.
- This project uses a tiny file-backed cache at `.cache/leetcode-cache.json` for local dev. If you
  test caching behavior, remove that file between runs to ensure a clean start.
- Run `npm run dev` and test with multiple usernames. Try `?show=graph,recent` and `?show=recent`.

Code style:
- TypeScript + Next.js. Follow existing types in `src/types/leetcode.ts` when adding fields.
- Add unit tests for data processing when possible. The repo currently prefers practical edits
  over perfect coverage, but a couple of tests helps a lot.

Thanks again — small PRs are welcome!
# Contributing

Thanks for taking an interest — contributions are welcome.

- File a clear issue if something is broken or you'd like a feature.
- Open a small PR that does one thing (bugfix, doc, small enhancement).
- Keep code readable and add a short comment for non-obvious logic.
- Run `npm run dev` and verify the card renders for a couple of usernames.

Local testing
```bash
npm install
npm run dev
# visit e.g. http://localhost:3000/NinePiece2?show=graph,recent
```

Please follow existing style and keep changes focused. If you're unsure, open an issue first.
