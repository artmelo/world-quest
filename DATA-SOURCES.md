# Country data and map sources

## Coverage and clues
The pool contains **197 entries**: 193 UN members, Palestine, Vatican City (the Holy See), Kosovo and Taiwan. Inclusion is an educational coverage choice, not a claim about recognition. Dependent territories are not separate quiz entries. Every match samples without replacement from the full pool; Grand Adventure still gives each player six turns.

Every country has exactly three clues (591 total). The original 12 retain their landmark, animal and food associations. Additional countries use sourced geographic and language clues: subregion, a language spoken there, and whether the country is landlocked, coastal or has no land borders. Language clues are examples, not claims that a country has only one language. Map Explorer hides these clues until the country answer is submitted.

Names, capitals, language, region, coordinates and border metadata derive from [mledoze/countries](https://github.com/mledoze/countries), downloaded 2026-09-10. The modified dataset is provided in `src/data/countries.json` under the same [ODbL license](public/licenses/countries-ODbL.txt). This license applies to the country database, not automatically to application code. The small original cultural clue set is retained in the dataset. Geographic and language clues are generated from the source fields; custom names, capital prompts and capital notes are documented below.

## Capital handling
- Equatorial Guinea: Ciudad de la Paz replaced Malabo in January 2026. [Government announcement](https://www.guineaecuatorialpress.com/noticias/el_presidente_de_la_republica_proclama_la_ciudad_de_la_paz_como_capital_de_la_republica_de_guinea_ecuatorial_con_la_firma_de_un_decreto_ley).
- Sri Lanka: ask for the legislative capital, Sri Jayawardenepura Kotte. [Government overview](https://www.gov.lk/sri-lanka/country-overview).
- South Africa: ask for the administrative capital, Pretoria, and explain all three. [Government overview](https://www.gov.za/south-africa-glance).
- Eswatini: ask for administrative capital Mbabane and explain Lobamba’s royal and legislative role. [Government description](https://40years.gov.sz/mbabane-from-town-to-capital-city/).
- Nauru: ask for government district Yaren rather than imply an official capital. [Independent states reference](https://2021-2025.state.gov/independent-states-in-the-world/).
- Palestine: ask for the Palestinian Authority’s administrative centre, Ramallah; explain the East Jerusalem claim and disputed status. Israel: ask for its seat of government, Jerusalem, and note the disputed status. Kosovo and Taiwan are included as additional quiz entries.
- Switzerland: ask for the federal city, Bern. Bolivia: ask for constitutional capital Sucre and explain government seat La Paz. Netherlands and Malaysia have separate capital and government-centre notes.
- Indonesia: retain Jakarta during the transition and explain Nusantara’s 2028 political-capital target. [Capital authority update, July 2026](https://ikn.go.id/id/posts/pembangunan-tahap-ii-ikn-terus-berjalan-otorita-ikn-lakukan-evaluasi-berkala).

Review changing facts before future educational releases. Recognition and administration can differ from quiz conventions; specific prompts prevent ambiguous scoring.

## Border map
[world-atlas](https://github.com/topojson/world-atlas) packages [Natural Earth’s public-domain country boundaries](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/). Natural Earth generally represents de facto boundaries; the map is not a statement about disputed sovereignty. Its border snapshot may differ from current claims.

`npm run map:build` converts the pinned 10m package into simplified SVG paths. It creates all 197 target shapes, resolves Kosovo by name where the numeric ID is absent, preserves detailed tiny-country shapes, and frames each country’s largest landmass. A locator ring identifies tiny countries without replacing their real borders. Repeated world geometry supports map edges. No place labels or satellite layers appear. The generated data is ignored in source control and regenerated from the lockfile on install/build workflows. Maps load only when Map Explorer is used.

D3 geo and TopoJSON are used only to prepare map data. Animation changes the SVG viewport in the browser and respects reduced-motion settings. The world-atlas package license is included in `public/licenses/world-atlas.txt`.

## Flags and fonts
Flags are bundled by Vite from the pinned MIT-licensed `flag-icons` package. Country questions never show answer-revealing flags. Flag answer options have neutral A–H labels. Existing license: `public/flags/LICENSE`.

Google Fonts remain optional with system-font fallbacks. No runtime country, map or flag API is required.
