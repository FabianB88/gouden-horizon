# v8.3.0 validation

The release adds living animal summons and paid training, three optional areas, seven new creature families across the two updates, elite mechanics, optional guarded chests and two transformative exceptional items.

- 283 rule and actual-entrypoint menu checks passed across the existing suites plus16 companion checks and11 nature-region checks. Navigation checks use actual eight-direction keyboard movement, including every new city service, chest, gate and discovery plaza.
- Three complete24-chapter campaign simulations with normal earned gear, consumables, paid shopping and learned animal summons: tide won with0 retries; storm won with1; ember won with0. The simulator grants no health, gear, mana, skills or forced kills.
- Five endgame trial combinations cleared using the earned campaign build: all three Veteran arenas and Tide Expert/Master. Real enemy attacks hit the player; records and rewards were written normally.
- New optional arenas played from an earned level15 campaign snapshot. Without companions: waterfall51s/5 hits, crown60s/13 hits; with ordinary fox summons: waterfall39s/0 hits, crown61s/10 hits. All four attempts cleared without retry. These are automated-player times, not promised human completion times.
- Native Canvas loaded the actual decoded art and rendered all three new areas,16 creature poses, companion poses, warning circles and active boss fields. Crops use measured foot anchors and preserve source transparency.
- A warm-cache native Canvas comparison at1920×1280 measured25.68ms median in the original opening hub and25.59ms in the new city. The creature pose cache stayed below its12million-pixel cap. This is not browser FPS; browser CSS layout, speaker output and mobile performance have not been manually measured.
- The route into the forest opens after chapter22. The separate Crown Bear door stays locked until the waterfall victory. Returning and replaying preserve the player's current health, mana and consumable stock. Per-encounter rewards cannot pay twice; discovery rewards remain one-time across saves and retry.

Run `npm test` and `npm run site:build` with Node18 or newer. GitHub Pages can serve the repository root; Render uses the included static-site blueprint.
