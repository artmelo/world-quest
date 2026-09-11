# World Quest — MVP product spec

A parent and child learn world geography together through a friendly, shared-device game. No timer or typing of answers; four choices keep play light.

## Core experience
1. Enter two nicknames. Grand Adventure (6 turns per player) is the default; 2- and 4-turn trips remain available. Choose Clue Explorer (4 options) or Map Explorer (8 options).
2. Show a handoff screen before every turn. Alternate players strictly.
3. Clue Explorer presents three emoji-and-text clues. Map Explorer flies from the world map to a highlighted, unlabelled territorial border; clues appear after answering. Correct country: +100 points.
4. Ask its capital regardless of the country answer. Correct capital: +50 points.
5. Bank the turn’s points or risk them on a flag question: correct +100, incorrect loses the entire current turn pot. Previous banked points cannot be lost.
6. Reveal the country, capital, flag and one short fact; bank exactly once and pass the device.
7. After equal turns, show winner or tie and all visited countries. Replay starts a fresh shuffled match.

## Content and fairness
197 countries across six inhabited continents, with three clues each. Original 12: cultural/nature anchors. Additional countries: sourced geography and language tips. Coverage: 193 UN members plus Palestine, Vatican City, Kosovo and Taiwan. Countries never repeat within a match. Four unique answer options in Clue Explorer or eight in Map Explorer always include the correct answer; option order is randomized. Both players get the same number and structure of questions, although countries can differ in difficulty. No answer is disclosed on handoff screens. Flag options have neutral accessible labels so country names do not reveal the answer; full identification appears after answering.

## Presentation and access
Responsive travel-card design, large touch controls, visible keyboard focus, labelled inputs, feedback announced as status, no time pressure. Emoji symbols are mnemonic icons with explicit text labels, not literal photographs (for example, kiwi fruit stands in for the kiwi association). Flag SVGs are bundled for reliable cross-platform rendering. Correct answers are green with a check; wrong selected answers are red with a cross, while the correct answer is also green. Real Natural Earth border geometry is bundled, names are hidden during map guessing, flights can replay, and reduced-motion settings skip the animation. Tiny countries retain real boundaries plus a locator ring. Country associations are introductory examples, not exhaustive descriptions of cultures.

## Technical scope
Vite + React; pure state transitions; bundled dataset; no backend, accounts, tracking, secrets, API costs or storage. Reloading resets the game. Optional Google Fonts have local system-font fallbacks. Static assets use relative paths for Vercel and repository-based GitHub Pages. No remote multiplayer, profiles, adaptive difficulty, audio or saved progress. Capital-role exceptions use specific questions and reveal explanations.

## Acceptance criteria
A complete match works for each trip length; every country has four or eight unique options depending on difficulty; all 197 countries have three clues, flags and valid map targets; double-clicks cannot award twice; bank and flag failure preserve prior scores; equal turns and ties are handled; replay resets scores; production build succeeds; scoring and match completion tests pass.
