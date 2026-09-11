# World Quest — MVP product spec

A parent and child learn world geography together through a friendly, shared-device game. No timer or typing of answers; four choices keep play light.

## Core experience
1. Enter two nicknames and choose 2, 4, or 6 turns per player.
2. Show a handoff screen before every turn. Alternate players strictly.
3. Present three emoji-and-text visual anchors for a randomly selected country. Correct country: +100 points.
4. Ask its capital regardless of the country answer. Correct capital: +50 points.
5. Bank the turn’s points or risk them on a flag question: correct +100, incorrect loses the entire current turn pot. Previous banked points cannot be lost.
6. Reveal the country, capital, flag and one short fact; bank exactly once and pass the device.
7. After equal turns, show winner or tie and all visited countries. Replay starts a fresh shuffled match.

## Content and fairness
12 countries across six inhabited continents; three anchors each span landmarks, nature, animals or culture. Countries never repeat within a match. Four unique answer options always include the correct answer; option order is randomized. Both players get the same number and structure of questions, although countries can differ in difficulty. No answer is disclosed on handoff screens. Flag options have neutral accessible labels so country names do not reveal the answer; full identification appears after answering.

## Presentation and access
Responsive travel-card design, large touch controls, visible keyboard focus, labelled inputs, feedback announced as status, no time pressure. Emoji symbols are mnemonic icons with explicit text labels, not literal photographs (for example, kiwi fruit stands in for the kiwi association). Flag SVGs are bundled for reliable cross-platform rendering. Country associations are introductory examples, not exhaustive descriptions of cultures.

## Technical scope
Vite + React; pure state transitions; bundled dataset; no backend, accounts, tracking, secrets, API costs or storage. Reloading resets the game. Optional Google Fonts have local system-font fallbacks. Static assets use relative paths for Vercel and repository-based GitHub Pages. No remote multiplayer, profiles, adaptive difficulty, audio, map exploration or saved progress in MVP.

## Acceptance criteria
A complete match works for each trip length; every country has four unique options; double-clicks cannot award twice; bank and flag failure preserve prior scores; equal turns and ties are handled; replay resets scores; production build succeeds; scoring and match completion tests pass.
