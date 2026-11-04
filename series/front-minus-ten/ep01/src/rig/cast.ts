import type { Look } from "./char";

/* ─────────────────────────────────────────────────────────────────────────────
   CAST — แนวหน้าลบสิบ (Front Line, Minus Ten). Cards live in series/front-minus-ten/bible.md.
   Keep every value here; never edit a character inside a shot, or continuity breaks.
   Figure: default SLIM build, headS 0.95, face "dots" (series decision, same for the whole cast).
   ───────────────────────────────────────────────────────────────────────────── */

/** "you": civilian, olive parka (coat), grey-green knitted hat with a red stripe, orange work gloves.
 *  Never-change: the hat with the red stripe, the orange gloves. */
export const YOU: Look = {
  skin: "#D7A982", hair: "short", hairC: "#3A2A20", iris: "#2A211C", eyeW: 1, eyeH: 1,
  outfit: "coat", top: "#5E6B4A", pants: "#3B3F46", shoes: "#2A2420", sole: "#141210", brow: "#3A2A20",
  hat: "#6F7A62", hatStripe: "#B3343A", gloves: "#D9772B", height: 0.9,
};
export const YOU_BUCKET: Look = { ...YOU, holdR: "bucket" };
export const YOU_TABLET: Look = { ...YOU, holdR: "tablet" };

/** the dead: an ordinary person in a plain grey coat, grey-blue skin, frost on brows and hair. No insignia, no gore. */
export const DEAD: Look = {
  skin: "#9DA3A0", hair: "short", hairC: "#5A5C5E", iris: "#C9CFC0", eyeW: 1, eyeH: 0.6,
  outfit: "coat", top: "#5C5F62", pants: "#47494C", shoes: "#2A2A2C", sole: "#141414", brow: "#EEF3F6",
  frost: true, height: 0.92,
};

/** characters shown by the Turn-<id> QA comps (4 views + face). Add every new character here. */
export const CAST: Record<string, Look> = { you: YOU, dead: DEAD };
