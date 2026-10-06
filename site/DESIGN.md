# Iron Temple: design direction (Day 11 · Round 0)

**Brand:** Iron Temple, a fictional strength gym (concept site, prices in ₹). **Sells:** memberships, training programmes, coached classes and a serious lifting floor.
**Audience:** people who lift (or want to), tired of neon "fitness app" gyms. **Mood:** raw, heavy, powerful: iron, chalk, sweat, one hard top light.
**Reel line:** "Gym websites don't have to be boring."
**Desktop only:** 1440×900. No phone layouts, no phone checks.

**Uniqueness:** 8 of 8 different from the last three sites; hero and signature are new for the whole log; no layout code from the last three sites; no motion code that any earlier day used. See the sites log.

---

## 1. Choices

| Menu | Pick | Why (this site) |
|---|---|---|
| Look | **L12 Brutalist mono, foundry edition**: cast-iron charcoal, chalk-white type, thick 6px rules, a visible 12-column grid, stencilled numbers, mono labels. Photos are lit by one hard top light | A strength gym is raw structure, so the page shows its own: hard edges, heavy weights, no soft shadows and no gradients except light in the photos |
| Palette | **Iron & chalk + plate blue**: bg `#111110` cast iron · surface `#1B1A18` · text `#ECE9E2` chalk · muted `#9B978E` · accent `#2F55E4` (the 20 kg competition plate's blue, flat paint, never a glow). **Chalk band** (Plans): bg `#E4E1DA`, text `#151413`. **Plate paint, signature only:** 25 kg red `#C8322A`, 20 kg blue (accent), 15 kg yellow `#E2B42B`, 10 kg green `#2F7D4A`, 5 kg white `#E8E6E0` | The category guess for a gym is black with neon or racing red. Here the colour comes from the plates on the bar: blue as one flat accent, the other plate colours only when the bar gets loaded. Blue is used for fills and big type only (it's too dark for small text on iron); buttons are chalk on blue |
| Type | **T18 Archivo** (variable: weight 100–900 **and** width 62–125) for headings, set black + expanded · Archivo for body · **IBM Plex Mono** for stencil labels, weights, times and prices (≤ 18px meta only, see lesson 60) | The heavy expanded cut feels like stamped iron. The variable weight/width axes drive the hero (the word gains weight as the bar rises). We haven't used this pair before |
| Nav | **N1 bar, built as NV14 ruled-cell scoreboard**: one full-width bar of ruled cells: `IRON TEMPLE` · Programs · Floor · Coaches · Plans · Timetable · a live **REP** cell (`REP 01 / 10`): the total is counted at runtime from the page's `[data-section]` elements (today 10: hero, rules, programmes, floor, signature, coaches, membership, timetable, join, footer), never hard-coded · a blue **Book a trial** cell | It reads like a gym whiteboard or scoreboard. The rep cell shows scroll progress as reps |
| Hero | **The lift**: a scroll film of an athlete deadlifting under one hard top light, seen from behind in silhouette. Headline sits left; **HEAVY** gains weight and width as the bar leaves the floor (M142, synced to the bar height measured in the film). A ruled spec strip runs along the bottom | Everything in the hero is about weight: the film's motion *is* the lift, and the type gets heavier with it. Nothing grows to full screen |
| Section shape | **S7 hard bands with a knurled seam**: iron / chalk / blue bands meet on a thick rule plus a 14px strip of diamond knurling, like a barbell's grip | The grip texture appears only at the seams, which makes it a gym-only edge |
| Cards | **C12 knurled steel bezel**: a card framed by a thin brushed-steel border with a knurl strip on top and a slow glint passing over it; square corners everywhere (one radius rule: 0) | Real iron instead of glass or paper. The glint keeps short holds alive on camera |
| Signature | **Load the bar**: a pinned stage, **drawn entirely in code** (SVG bar + plates, rubber texture, competition colours; the bar must bend, so no photos). Plates stand on a baseline; with the scroll they slide onto both sleeves at once (25 → 20 → 15 → 10 → 5) and slam home with a 2px jolt and a chalk puff. The bar whips a little more with every plate, the kilo readout rolls 20 → 170 kg, collars lock, and the bar lifts off the floor | It only makes sense for a gym, and it's the moment the reel is built around |
| Loader | **I16 corner counter becomes the wipe**: an iron plate covers the screen with a huge stencilled counter `000 → 100` in the corner. At 100 the digits slide up out of their mask and the chalk-white plate wipes up with a dusty edge, revealing the dark hero, which is already moving | Hard and quick, with no logo animation. The plate is light and the hero dark, so the change is clear to the camera (lesson 47) |

**Easing / feel:** heavy, not bouncy. Arrivals use `expo.out` and finish with a 1–2px settle (a weight set down). Exits are ~75% as long and travel less. Scrubs are linear. Stagger 40–60ms. Never `back`/elastic.

**Copy voice:** short, flat, confident. 2–6 words per line. Examples: "Lift heavy. / Rest. / Repeat." · "No mirrors on the platform." · "Chalk is free." · "Earn the plates."

---

## 2. Section plan (10 sections + loader + nav)

| # | Section | Layout | Starts from | How it's restyled here |
|---|---|---|---|---|
| 0 | Loader | — | `components/fx` I16 counter | Iron plate with a stencilled counter, chalk wipe edge (noise-masked) |
| 1 | Nav | **NV14** ruled-cell navbar | `components/sections` NV14 | Thick 2px rules, mono cells, live rep cell, blue Book cell; no hover underline, cells invert on hover |
| 2 | Hero · The lift | **HR01** split hero + strip | HR01 | Film full-bleed instead of a product panel. Headline left over the film's dark side: "Lift / **HEAVY.** / Rest. Repeat." (final copy in Round 1). The logo strip becomes a ruled spec strip: `2,400 sq ft floor · 6 platforms · 10 racks · DBs to 60 kg · 05:00–23:00` + **Book a trial** |
| 3 | House rules | **SY04** manifesto | SY04 | Five numbered rules as giant black-expanded lines on iron: 01 Chalk is free. 02 Re-rack your weight. 03 No mirrors on the platform. 04 Coaches watch every rep. 05 Earn the plates. |
| 4 | Programmes | **FT12** stacked pinned card pile | FT12 | 4 C12 steel cards (Strength · Olympic Lifting · Hypertrophy · Conditioning): photo half, mono spec block (weeks, sessions/week, focus), "included in Monthly+" tag |
| 5 | The floor | **GL17** perspective floor grid | GL17 | Six zone tiles lie on the floor in deep perspective like a floor plan seen from the door, then rise flat to face you: Platforms · Rack row · Dumbbell wall · Sled turf · Chalk station · Recovery. Each tile has a mono label + one number |
| 6 | **Signature · Load the bar** | **CP02** size line-up on a baseline | CP02 | The plates' line-up on a baseline *is* the start state (25 · 20 · 15 · 10 · 5 kg), and they get loaded onto a barbell above it. **All drawn in code:** the bar is an SVG path (sleeves, collars, knurled shaft) whose centre bends with load; each plate is an edge-on SVG shape in its competition colour with a rubber-grain texture (feTurbulence noise, matte), a steel hub, raised kg stencil on the rim and a hard top-light highlight. One shared `Plate` component, also used by the footer pile. Big rolling kilo readout, plate legend, final "170 KG. WEEK ONE." |
| 7 | Coaches | **TM02** staff directory rows with a cursor portrait | TM02 | Four ruled rows: name · discipline · best lifts (mono, `DL 260 · SQ 205 · BP 140`). The "portrait" that follows the pointer is each coach's **gear**: stencilled belt, chalked shoes, wraps, logbook. No faces |
| 8 | Membership | **PR14** radio plan list | PR14 | On the **chalk band** (light). Rows: Day pass ₹499 · Monthly ₹3,499 · Quarterly ₹8,999 · Annual "Lifer" ₹29,999 · + Coaching add-on ₹1,200 / session. A total card on the right, prices in Archivo expanded 48px |
| 9 | Timetable + booking | **EV06** month-grid calendar (restyled as one week) | EV06 | A dark split-flap board: Mon–Sun columns × 5 time rows (06:00 · 07:30 · 12:30 · 18:00 · 19:30). Classes: Barbell Club, Oly Technique, Engine (conditioning), Strongman Sat, Mobility. Spots left per class; a booking ticket card on the right |
| 10 | Join band | **CT01** accent band, giant CTA line | CT01 | Blue band, one giant line "FIRST SESSION / ON US." + a chalk button "Book a trial" |
| 11 | Footer | **FO10** physics pile footer | FO10 | Small plates (the same code-drawn `Plate` component as the signature, rendered to the canvas) and stencilled words (CHALK · REST · REPEAT) fall and pile on the floor line. Links in 3 mono columns, plus "Concept website by Triozen Tech" |

Cinematic: hero, house rules, floor, signature. Shop-style: programmes, coaches, membership, timetable, join.

---

## 3. Motion map

| # | Section | Layout | Motion | How it plays here | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | — | **I16** corner counter becomes the wipe | Counter rolls 000 → 100 on real hero-frame load; at 100 the digits slide up out of the mask and the chalk plate wipes upward (dust-noise edge, ~0.8s). The hero film is already pushing in under it | Plays from first paint (CSS grain + counter), ~2s |
| 1 | Nav | NV14 | **M283** slot cell text roll | The rep cell (`REP 01 / 10`, total = the real count of `[data-section]` on the page) rolls each changed digit in its own clipped cell when a new section arrives; the section-name cell rolls to the new name | Rolls by itself on every section change |
| 2 | Hero | HR01 | **M142** variable weight on scroll | **HEAVY** goes from wght 200 / wdth 62 to wght 900 / wdth 125 in step with the bar height measured in the film (lockout = full weight). Supporting: the film scrubs by video time; the spec strip's cells rise in turn | As built (Round 2): the film intro starts as the chalk plate starts lifting and plays 0 → 2.0 s (to lockout) linearly over 4 s; shown time = max(scroll, intro), so the still "bottom" second is played under the wipe and the scroll (bottom 0.3 s · pull 2.8 s · lockout 1.4 s) takes over at lockout. Entrance (LIFT, line + copy, spec cells) plays on the clock as the plate clears. Push-in = canvas scale 1 → 1.08 tied to the shown second |
| 3 | House rules | SY04 | **M90** dual curtain text wipe | Each rule line is uncovered by two blocks sweeping across it: chalk first, blue 0.15s behind | Lines trigger one after another as they enter; ~0.6s each |
| 4 | Programmes | FT12 | **M88** stacking cards tilt back in 3D | Cards slide up and stack; each covered card tilts back (rotateX −10°) and sinks in Z like a plate added to a pile | Scrub; the glint on the C12 bezels runs on the clock |
| 5 | The floor | GL17 | **M430** 3D grid unfurls flat | The zone grid lies in deep perspective (rotateX 58°, rotateZ −30°) and unfurls flat as the section passes, its columns at different parallax offsets. Labels count once landed | Scrub while passing (no pin) + slow drift |
| 6 | **Signature · Load the bar** | CP02 | **M253** halves slide in from both edges | Pinned ~300vh. Each plate pair slides in from both screen edges at once and meets on the sleeves. On contact: 2px stage jolt, chalk puff (canvas), readout rolls (+50 kg, +40…), bar whip increases (SVG bend). Last 15%: collars lock, the bar lifts 40px, and a chalk burst plays under "170 KG." | Scrub over the whole pin, linear, finishing exactly at the end; dust + bar sway keep it alive |
| 7 | Coaches | TM02 | **M160** list hover: photo follows the cursor | The gear photo follows the pointer down the rows; the active row inverts to chalk | Scripted pointer walks down the 4 rows by itself (record only) |
| 8 | Membership | PR14 | **M133** sliding digits | The selected plan steps down the list; the total's digits slide to the new price (₹3,499 → ₹8,999 → ₹29,999) | Auto-steps while on screen (record only, lesson 75); static shows Monthly selected |
| 9 | Timetable | EV06 | **M371** split-flap board | Class names flip through glyphs into their cells, column by column, like a departures board. Record only: a cursor picks THU 06:00 Barbell Club, spots flip 3 → 2, and the ticket prints "PLATFORM 4 · BOOKED" | Board flips on enter; booking runs from a ScrollTrigger and finishes inside the hold (lesson 74) |
| 10 | Join band | CT01 | **M289** text shadow pop (3D extrude) | Hard stacked shadows grow down-right in darker blue while the line shifts up-left, so the words extrude into a solid iron block | Plays on enter, then a slow extrude breath |
| 11 | Footer | FO10 | **M236** gravity tag pile | Plates and stencilled word tags drop, collide and pile on the floor line (2D canvas physics); a fake pointer sweeps through once | Plays on the clock once on screen (lesson 77); record stop goes on an element after it |

**No code twice. No code that any earlier day used.** Hero (M142) and signature (M253) are new to the whole log. No plain fades.

### Transitions (every boundary)

| From → to | Code | How |
|---|---|---|
| Loader → Hero | (I16 exit) | Chalk plate wipes up with a dust edge onto the moving film |
| Hero → House rules | **X14** atmospheric bleed | Chalk-dust haze rises from the film's floor, holds briefly, and clears onto the rules on iron |
| House rules → Programmes | **X1** overlap slide | The first programme card slides up over the dimmed last rule |
| Programmes → Floor | **X28** staircase column overlay | Seven iron "rack upright" columns drop in staircase order and lift away onto the floor grid (scrubbed) |
| Floor → Load the bar | **X5** hard cut on beat | No tween; the first plate pair is already moving when the stage reaches the top |
| Load the bar → Coaches | **X12** fade through black | After the lift, the top light switches off (fade to black, with grain alive), and the coach rows come up under a new hard light |
| Coaches → Membership | **X2** colour wash | Iron washes to the chalk band before the plans arrive; the knurled seam passes |
| Membership → Timetable | **X13** inversion cut | Chalk flips to its negative (light → dark) with a small rotateX settling: the board appears |
| Timetable → Join band | **X27** colour stripe sweep | Five plate-coloured stripes (red, blue, yellow, green, white) sweep across and leave the blue band |
| Join band → Footer | **X40** footer revealed under the page | The blue band lifts to reveal the footer floor, where the plates are falling |

### Details (Round 4, each also plays once by itself on camera)
- Buttons: chalk fill wipes left → right on hover (the button "gets chalked"); the Book cell has a 3D press (U120), and a fake pointer presses it once.
- `data-cursor` labels: "Load" on the signature, "Gear" on coach rows, "Book" on timetable cells.
- C12 bezel glint runs on a loop; it speeds up while scrolling.
- Kilo readout and prices use the odometer rule in lesson 73 (digit cells sized to the final digit).
- Page-wide ambience (lessons 70/71): a fixed, very faint **chalk-dust drift** layer (screen blend, coarse particles + a slow light flicker from the "top light") keeps short holds alive from the first paint.

---

## 4. Assets

**One grade for every image:** *one hard rectangular top light, deep black shadows, chalk dust hanging in the light, desaturated warm-grey, black rubber floor, film grain, no faces, no hands visible, no text, no logos.* All Flow (Nano Banana Pro still → Veo video). Rule for people: **seen from behind or as a silhouette only; face never visible; hands hidden in shadow or chalk dust.**

### Video (1) · start + end frame

| File | What it shows | Prompt |
|---|---|---|
| `raw/hero-lift.mp4` (8s, 16:9) | Veo **start frame** `raw/hero-start.jpg` → **end frame** `raw/hero-end.jpg`. Slow continuous push-in from the wide start to the slightly closer end. The athlete is seen from behind, slightly right of centre, a black silhouette under one hard top light. The bar rests on the floor at 0–1.5s, rises steadily to lockout by ~6s and holds while chalk dust drifts in the beam. Left 40% stays dark and calm for the headline | Video (template D, start + end frame): *"Smooth continuous move from the start frame to the end frame: the camera pushes in slowly and steadily for the whole shot while the athlete, seen from behind as a silhouette, deadlifts the barbell from the floor to full lockout over about five seconds and holds at the top. The face is never visible and the hands stay hidden in shadow and chalk dust. Chalk dust drifts slowly in the single hard top light. One continuous shot, no cuts, no camera shake. no text, no logos"* |

Frames: `site/frames.json` + `npm run film-frames` (video time, watermark painted out, ≤ 12 MB). I'll measure the bar-height landmarks (floor, knee, lockout seconds) on a contact sheet to drive M142 (lesson 6), and check that the clip's last frame matches `hero-end.jpg`.

### Stills (all `.jpg`, no cut-outs)

Shared style words for every still: *"dark warehouse strength gym, one hard rectangular top light, deep black shadows, chalk dust hanging in the light, black rubber floor, desaturated warm grey, film grain, photorealistic. no people's faces, no hands, no text, no logos"*.

| # | File (`raw/`) | Ratio | What it shows | Used in |
|---|---|---|---|---|
| 1 | `hero-start.jpg` | 16:9 | **Wide.** A powerlifter seen from directly behind, slightly right of centre, standing over a loaded barbell at the bottom of a deadlift (bar on the floor). Back and shoulders a near-black silhouette with a thin rim of light; black bumper plates; empty dark left third. Face never visible; hands and grip hidden in shadow and chalk dust | Film start frame + `?static` poster |
| 2 | `hero-end.jpg` | 16:9 | **Same athlete, same light, at lockout**, framed slightly closer (the push-in end): standing tall, bar at the hips, plates just off the floor, chalk dust thicker in the beam. Same position in frame, still a silhouette from behind | Film end frame |
| 3 | `prog-strength.jpg` | 4:3 | Loaded barbell on a wooden platform, close, chalk on the knurling | Programmes card |
| 4 | `prog-oly.jpg` | 4:3 | Bumper plates and a chalk bowl beside a lifting platform | Programmes card |
| 5 | `prog-hypertrophy.jpg` | 4:3 | Row of heavy dumbbells on a rack, light raking across them | Programmes card |
| 6 | `prog-conditioning.jpg` | 4:3 | A loaded sled on dark turf with a rope, dust in the light | Programmes card |
| 7 | `floor-platforms.jpg` | 1:1 | A row of lifting platforms, top lights in a line | Floor tile |
| 8 | `floor-racks.jpg` | 1:1 | A row of power racks with plates stacked on their horns | Floor tile |
| 9 | `floor-dumbbells.jpg` | 1:1 | A dumbbell wall, up to very heavy ones | Floor tile |
| 10 | `floor-turf.jpg` | 1:1 | The sled turf lane seen from one end | Floor tile |
| 11 | `floor-chalk.jpg` | 1:1 | A chalk station: a block of chalk in a steel bowl, dust in the light | Floor tile |
| 12 | `floor-recovery.jpg` | 1:1 | A dim recovery corner: cold-plunge tub, foam rollers, bands | Floor tile |
| 13 | `coach-belt.jpg` | 3:4 | A worn leather lifting belt with a stencilled name, chalk on it, on a bench | Coach row |
| 14 | `coach-shoes.jpg` | 3:4 | Chalked weightlifting shoes on a platform | Coach row |
| 15 | `coach-wraps.jpg` | 3:4 | Knee sleeves and wrist wraps on a plate | Coach row |
| 16 | `coach-logbook.jpg` | 3:4 | An open training logbook and pencil on a plate, rows of numbers (no readable brand text) | Coach row |

16 stills + 1 video. Bar, plates, collars and chalk bursts are drawn in code. Images ship as WebP in `public/images/iron-temple/`. The cover (`cover.jpg`) comes in Round 5 (`cover-check`).

### Video plan (measured, Round 1)

`hero-lift.mp4` uses raw **3.0–7.0 s only** (trimmed in `site/frames.json`; frame times below are of the trimmed clip): **0–1 s** bottom position, **1–2 s** the pull (floor → lockout), **2–4 s** lockout hold. Frames: 97 × 1600×900 WebP, 4.8 MB, `[0,1,16] [1,2,48] [2,4,16]` fps (the pull at 48). Veo mark painted out (delogo x 1848 y 1030 64×36). Scroll share (record seconds): bottom 1.2 · **pull 2.6** · lockout 1.4, so the pull gets the biggest share; **HEAVY** maps 1:1 to the pull (weight/width 0 at 1.0 s → full at 2.0 s). The slow push-in is a gentle code scale on the canvas (Round 2), not in the film. Stills: 9% trimmed off the right and bottom (Flow sparkle), ratio kept.

### Cards and tiles built around these ratios (1440×900)

- **Hero (16:9):** the film covers the full 1440×900 viewport (cover-fit crops ~5% from the sides only); headline on the dark left third, spec strip over the bottom 96px.
- **Programme cards (4:3):** C12 card ≈ 1120×500, split 4:3 photo **left** (≈ 600×450 inside the steel bezel) + spec block right (name 64px, weeks / sessions / focus in mono, tag). Stack offset 28px per card.
- **Floor tiles (1:1):** 3 × 2 grid of square tiles, ≈ 277×277 with a 20px gutter beside a 400px title column (as built, Round 1); mono label + one number sit on a 56px ruled strip **under** each square, not over the photo.
- **Coach gear (3:4):** the pointer-following "portrait" is a 3:4 frame ≈ 300×400 with the steel bezel; rows are 120px tall so the frame overlaps ~3 rows without covering the name column (it rides in the right half).

---

## 5. Notes for review

- **Hero vs Day 10's film:** both are push-in films. Today the film's motion is the lift itself (scrubbed by video time) and the type move is a variable-font weight/width swell synced to the bar's height (M142), on the left, not a bottom title flooding with colour. Nothing grows to full screen.
- **Signature vs Day 3's scoop stacker:** both add objects to something. Today's is sideways, plate pairs loading both sleeves at once, with a bending bar, a jolt + chalk on contact, a kilo readout (no ₹ receipt) and a final lift. No drop-and-squish.
- **Plate blue vs Day 7's electric blue:** flat paint on iron and chalk, used only for fills, the CTA band and the 20 kg plate. No glow, no frost, no ring lines.
- Booking demo, plan stepping and the coach pointer run **only in `?record=1`** (lesson 75); `?static=1` shows Monthly selected, the board filled and the first coach row active.
- **Loader signal (as built):** the engine loader is off, and the engine then fires `site:ready` at mount, so hero motion listens to `site/lib/plate.ts` (`onPlateLifting`, fired by PlateLoader as its wipe starts).
- Reel target ~36s: loader 2 · hero 5 · rules 3 · programmes 5 · floor 3 · signature 6 · coaches 3.5 · plans 3 · timetable 4 · join 1.5 · footer 2.5 (+ holds ≤ 1.2s).
- Traveling object: not a traveller day (next is Day 12).

## Round 3 · as built

- All transitions live in `site/components/Handovers.tsx` (scrubbed overlays + the bottom-aligned sticky for X1/X5); X40 is CSS sticky in `Page.tsx` + `PileFooter.tsx`. Z-order ladder: bar 2 · X12 black 15 · coaches 20 · X2 chalk 25 · plans/timetable 30 · join 32 · X14 haze / X28 uprights 35 · chalk air 40 · X27 stripes 45 · nav 50.
- Rolling text (`RollText.tsx`): "slot" = M283 (nav REP cell, timetable spots/button), "slide" = M133 (membership total).
- Record-only (`isRecording()`): coach pointer walk, plan stepping (Monthly → Quarterly → Lifer), THU 06:00 booking, footer pointer sweep. Normal mode: the real pointer/clicks drive them.
- Record timeline 34.7 s (+ loader ≈ 38.4 s reel): holds coaches 1.0 · plans 0.8 · timetable 0.6 (all ≤ 1.2 s).
- Signature: two jack stands under the empty bar (the loaded bar lifts off them); the dust is 1–2 px chalk specks drifting inside the top-light beam over a faint breathing haze.

## Round 4 · as built (details)

- Record-only pointer: `site/lib/fakePointer.ts` + `FakeCursor.tsx` (ring + data-cursor label, `.is-hover`, magnet events, `data-press` / `data-click`), scripted in `RecordScripts.tsx`: nav Book press (U120) · "Load" over the bar · "Gear" down the coach rows · Quarterly → Lifer + Join now · THU 06:00 cell + Book Platform 4 · join CTA pull + press · pile sweep + footer link underline. The pointer follows its target live (the page keeps scrolling under it).
- Magnet (`Magnet.tsx`, expo, never springy) on the hero strip CTA label, Join now, the join CTA. Count-ins (`Odo.tsx`, odometer rule): hero spec strip, floor tile numbers, plan prices. Plan name + ticket button swap whole words (`SwapText.tsx`: old lifts out 0.1 s, new clip-wipes in 0.15 s); price digits keep rolling.
- Glint speeds up with scroll (`Details.tsx`); footer links draw their underline.

## Round 5 · final

- Final reel `recordings/day-11-iron-temple-final.mp4`: 1440×900, 35.4 s (31.8 s record timeline + loader), PASS. Record seconds: hero 0.3 + 2.8 + 1.2 · rules 2.0 · programmes 1.8 + 3.2 · floor 1.8 · bar 1.4 + 5.6 (signature untouched) · coaches 2.0 (hold 0.8) · plans 2.0 (hold 0.6) · timetable 2.0 (hold 0.3) · join 1.8 · footer 2.2.
- X27: five plate panels race across overlapping (≈ 0.6 s on the record clock), blue last, onto the blue band.
- Readability audit (static, 235 text elements): none under 12 px, every small text ≥ 4.5:1, large ≥ 3:1. Frame timing with a screencast running: p99 16.8 ms at 1440×900 and 1920×1080, no console errors (normal + record).
