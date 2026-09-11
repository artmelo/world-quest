# World Quest 🌍

A small, friendly two-player geography game for a shared laptop, tablet or phone. Follow visual clues, guess countries and capitals, and decide whether to risk your turn’s points for a flag bonus.

- 12 countries, three visual anchors and a short fact each
- 2, 4 or 6 turns each, with explicit device handoffs
- Country +100, capital +50; optional flag +100 or lose this turn’s points
- No login, database, paid API or timer
- Responsive, keyboard-friendly Vite + React app

See [SPEC.md](SPEC.md) for the concise product specification.

## Run locally
Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open the address printed in the terminal. To verify and build:

```sh
npm test
npm run build
npm run preview
```

`dist/` contains the complete static site. Refreshing starts a new game; progress is not saved.

## Free deployment: Vercel (recommended)
1. Sign in at https://vercel.com/new with GitHub using the free Hobby plan for this personal, non-commercial app.
2. Import `artmelo/world-quest` (grant access to this repository if prompted).
3. Framework: **Vite**. Root directory: repository root. Build: **npm run build**. Output: **dist**. Install: **npm ci**. No environment variables.
4. Click **Deploy** and open the assigned `.vercel.app` URL on both your laptop and phone. You still play together on one device.
5. Later pushes to `main` deploy automatically.

Official references: https://vercel.com/docs/frameworks/frontend/vite and https://vercel.com/docs/plans/hobby.

## Alternative: GitHub Pages
A ready-to-run deployment workflow is included. For free Pages hosting, keep this repository public.
1. In the repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy to GitHub Pages → Run workflow**, select `main`, and run it.
4. Wait for the workflow to succeed, then open https://artmelo.github.io/world-quest/.

The workflow is manual so Pages does not deploy or produce setup failures before you enable it. To deploy later changes, run the workflow again. Relative Vite asset paths support this repository subdirectory without configuration changes.

Official reference: https://vite.dev/guide/static-deploy#github-pages.

## Content and assets
Edit `src/countries.js` to adjust countries, capitals, clues and facts. Emoji art is provided by the device’s font; clue text clarifies each association. Flags are copied from the MIT-licensed `flag-icons` package; see `public/flags/LICENSE`. Google Fonts (DM Sans and Outfit) are optional and fall back to system fonts if unavailable. No runtime game API is used.

## Testing scope
Automated tests cover deck uniqueness, answer options, correct/incorrect scoring, repeat-answer prevention, banking, risk losses, turn progression, equal turns and match completion. Country difficulty is not calibrated. Flag questions are visual; screen-reader options identify A–D without revealing country names.
