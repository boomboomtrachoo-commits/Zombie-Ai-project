# Series bible — แนวหน้าลบสิบ (Front Line, Minus Ten)

## Pitch (2 lines)
คุณคือพลเรือนคนสุดท้ายที่ยังไม่อพยพ ในหมู่บ้านชายแดนแนวหน้าทางตะวันออกของยูเครน ฤดูหนาว ลบสิบองศา
สงครามยังไม่จบ แต่ศพตามแนวหน้าเริ่มลุกเดิน — และคนตายไม่เลือกข้าง ไม่ดูธง ไม่สนใจเส้นแบ่งเขต

You are the last civilian who never evacuated a front-line village in eastern Ukraine, in a −10 °C winter.
The war has not ended, but the dead along the front have started to walk — and the dead don't pick sides.

## Format
- Episodes: 6 (season 1), 65–72 s each. Language: Thai VO + English subtitles.
- Tone: survival horror, quiet and cold. Gore level: light (no wounds on screen; dark stains on snow only).
- Post as **(fiction)**. Hashtags never name a country as the enemy.

## Ground rules (never break)
- The war is background, never the joke. No real people, no real units, no real towns where real atrocities happened.
  The village "Sonyachne" (โซเนียชเน, "sunny") is fictional.
- No side is the villain. Soldiers from either side may appear as people or as the dead; uniforms carry NO flags or
  insignia. The season's theme: the dead don't choose sides — the living have to decide whether they will.
- The zombie rules are fiction, but every number in a "fact" line must be a real, checked fact.

## Zombie rules (fixed for the whole series — the season is built on them)
1. They are cold: a body takes the outside temperature within days, so thermal cameras don't see them.
2. They lie still for hours and snow covers them; they look like mounds, sandbags, drifts.
3. They follow sound and warmth, slowly. They do not run in the cold.
4. Unknown (season mystery): why only along the front line, and why now.

## Cast (each one also has a character card for the rig)
| Name (as the voice says it) | Role | Never-change details | Can die? |
|---|---|---|---|
| คุณ (you) | narrator's "you", civilian, ~30 | grey-green knitted hat with a red stripe; orange work gloves | no (season 1) |
| บุบลิก Bublyk | sidekick dog, shaggy mongrel, notices first | one ear up, one ear down; blue rope collar | NEVER |
| บาบาฮัลยา Baba Halya | elderly neighbour who refused to leave, ep 2+ | headscarf with sunflowers; walking stick | maybe (finale) |
| มีชา Misha | young soldier, side never stated, ep 3+ | uniform with the patches torn off; bandaged left hand | yes |
| the dead | threat | frost on eyebrows and shoulders; move stiffly, heads tilted | — |

### Character cards
```
Name: คุณ (you)       Role: you        Age: adult, 0.9      Figure: series build (decide with the look)
Silhouette: knitted hat + puffy olive parka + bucket/flashlight
Palette: skin #D7A982 / hair #3A2A20 / top #5E6B4A (parka) / bottom #3B3F46 / shoes #2A2420 / accent #D9772B gloves
Hair: short, matte under the hat    Outfit: coat    Face: dots
Never-change: hat with red stripe; orange gloves     Prop: flashlight (ep 1: bucket)
Default face: calm (browUp 0.4)     Can die: no
```
```
Name: บุบลิก Bublyk   Role: sidekick dog     Size: medium dog
Palette: fur #B08A5C with a cream chest / collar #3B6EA8 (blue rope)
Never-change: left ear up, right ear down; blue rope collar
Default: alert, sits facing the threat      Can die: NEVER
```
```
Name: the dead        Role: threat      Age: adult, 0.9–0.94    Figure: same build as the cast
Silhouette: same people as everyone else (civilian coats, plain uniforms) — the difference is the pose and the frost
Palette: skin #9DA3A0 (grey-blue) / frost #EEF3F6 on brows, shoulders, hair / clothes desaturated
Pose: "shamble" (head tilted, arms low), lying flat under snow when still
Face: dots, eyes half closed       Gore: none on body; at most a dark stain on the snow
```

## World
| Location | Set file | First episode | Notes (layout, light) |
|---|---|---|---|
| Cellar under your house | `src/sets/cellar.tsx` | 1 | brick walls, shelves of jars, one bulb + a tablet glowing with the thermal feed, stairs up to a wooden hatch/door |
| Your yard + well | `src/sets/yard.tsx` | 1 | snow, low wooden fence, well 40 m from the door, **two snow mounds by the well** (one is sandbags), street running left, birch trees, grey dawn light, smoke on the horizon |
| Village street | (reuse yard, other angle) | 2 | half-burnt houses, a dead car under snow |

## Season mystery ladder (one rung per episode)
| Ep | Rule (hook) | What is revealed | Object introduced (must pay off later) | Cliffhanger → next hook |
|---|---|---|---|---|
| 1 | ถ้าคืนลบสิบองศา กล้องความร้อนบอกว่าถนนว่าง อย่าเพิ่งเดินออกไป (If, on a −10 °C night, the thermal camera says the street is empty, don't step outside) | the dead are cold → invisible to thermal; they hide under snow | thermal tablet; the water bucket; sandbags by the well | one mound is gone; fresh footprints follow you to the door |
| 2 | ถ้ามีรอยเท้ามาหยุดที่ประตู อย่าส่องดูผ่านช่องประตู (If footprints stop at your door, don't look through the gap) | it follows warmth: it is pressed against the door where your breath comes through; Baba Halya knocks from the other side of the house | Baba Halya's walking stick | Baba Halya says "the soldiers in the forest are moving again — but nobody is shooting" |
| 3 | ถ้าทหารแปลกหน้าขอเข้าบ้าน อย่าดูที่ธง ดูที่มือ (If a stranger soldier asks to come in, don't look at the flag — look at his hands) | Misha's patches are torn off; his hand is bandaged but warm (alive); the dead have frost on bare skin | Misha's radio | the radio picks up both sides on one channel: "don't shoot them, they don't fall" |
| 4 | ถ้าโดรนบินวนเหนือหลังคาครบสามสิบวินาที อย่าวิ่งออกไป (If a drone circles your roof for 30 s, don't run outside) | the drone operator is guiding you, not hunting you; the dead turn toward the drone's buzz | a drone with a note tied to it | the note's map marks the well as "the source" |
| 5 | (TBD — the well) | the dead rose first from where the water froze/ thawed (fiction) | — | — |
| 6 | ถ้าหิมะเริ่มละลาย อย่าดีใจ (If the snow starts to melt, don't celebrate) | spring: they warm up, they get faster — and they appear on thermal for the first time, thousands of them | — | season 2 |

Rungs 2–6 are an outline. Every fact line in them must be checked before writing the episode.

## Recurring objects / payoffs
| Object | Introduced | Pays off |
|---|---|---|
| thermal tablet | ep 1 | ep 6 (the screen finally fills with shapes) |
| sandbags + mounds by the well | ep 1 | ep 4–5 (the well is "the source") |
| Misha's radio | ep 3 | ep 4 (talks to the drone operator) |
| Baba Halya's walking stick | ep 2 | ep 6 |

## Status (update after every episode)
- Ep 1: produced 2026-11-04 as a SILENT CUT (picture + captions + subtitles + room tone/SFX; timing estimated,
  voice pending — edge-tts / whisper hosts blocked in the cloud session). Look: default SLIM figure, cold grey snow, gore light.
  Sets built: `cellar.tsx`, `yard.tsx` (well 40 m from the door; mounds: SANDBAGS [2.9,0,38.4], BODY [0.1,0,38.6]).
  Rig added: knitted hat + stripe, gloves, frost, bucket + tablet props; Bublyk dog (pets.tsx); DEAD look (cast.ts).
  Revealed: the dead are invisible on thermal; one lay under the snow by the well. Open: footprints at your door.
