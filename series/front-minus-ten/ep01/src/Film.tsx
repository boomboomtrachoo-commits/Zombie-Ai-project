import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Cam, Shot, type V3 } from "./kit/three";
import { DUR, FPS, FadeOut, Flash, Grain, LINE, Vig, fr, io, lin } from "./kit/ui";
import { Char, headCenter, type Pose } from "./rig/char";
import { DEAD, YOU, YOU_BUCKET, YOU_TABLET } from "./rig/cast";
import { CROUCH, blendPose, reachPose, runPose } from "./rig/poses";
import { Bublyk } from "./rig/pets";
import { BUCKET, CRATE, Cellar, STAIRS_FOOT } from "./sets/cellar";
import { BODY, DOOR, Mound, SANDBAGS, WELL, Yard } from "./sets/yard";
import { Captions } from "./ui/captions";
import { Clock, Measure, NextCard, ProofCard, RuleSign, RuleTag, ThermalHUD } from "./ui/cards";

/** EP1 — แนวหน้าลบสิบ: "If, on a −10 °C night, the thermal camera says the street is empty, don't step outside."
 *  Sets: Cellar (sets/cellar.tsx) + Yard (sets/yard.tsx). Cast: you, Bublyk, the dead (seen only in the flashback).
 *  Plant: TWO snow mounds by the well (lines 8–9, 15). Twist: you only ever stacked ONE pile (line 20) → one mound left (21)
 *  → fresh footprints from its hollow to your door (22). */

/* ─── staging (fixed for the whole episode) ─── */
const YOU_C: V3 = [0.35, 0, 0.75];                 // you in the cellar, facing +z (the open side, where the cameras are)
const DOG_C: V3 = [STAIRS_FOOT[0] + 0.15, 0, STAIRS_FOOT[2] + 0.35];
const DOG_RY = Math.atan2(0.75 - DOG_C[0], -1.55 - DOG_C[2]);   // Bublyk stares up the stairs (toward the door / the well)
const FACE = headCenter(YOU);                      // standing head height
const blink = (f: number, s = 0) => ((f + s * 23) % 87 < 4 ? 1 : 0);
const HOLD_TAB: Pose = { shR: [-1.05, 0.15, -0.25], elR: -1.1, shL: [-0.9, -0.3, 0.3], elL: -1.2, head: [0.32, 0, 0], browUp: 0.5 };

/* ─── the cellar with you + Bublyk ─── */
type CAct = "tablet" | "stand" | "bucket" | "dread";
const InCellar: React.FC<{ act?: CAct; dogAlert?: number; children?: React.ReactNode }> = ({ act = "stand", dogAlert = 0.3, children }) => {
  const f = useCurrentFrame();
  const L = act === "tablet" ? YOU_TABLET : act === "bucket" ? YOU_BUCKET : YOU;
  const pose: Pose =
    act === "tablet" ? { ...HOLD_TAB, blink: blink(f) } :
    act === "dread" ? { head: [0.08, 0, 0], browUp: 1, mouth: 0.15, blink: 0, look: [0, -0.2] } :
    act === "bucket" ? { head: [0.0, Math.sin(f / 40) * 0.05, 0], browUp: 0.6, mouth: 0.1 + 0.08 * Math.abs(Math.sin(f / 9)), blink: blink(f, 2), spine: [0.08 + 0.03 * Math.sin(f / 9), 0, 0] } :
    { head: [0.05, 0, 0], browUp: 0.4, blink: blink(f, 1) };
  return (
    <Cellar tablet={act !== "tablet"}>
      {/* face fill: warm from the bulb side, purple from the tablet when you hold it */}
      <pointLight position={[YOU_C[0] + 0.8, 1.7, YOU_C[2] + 1.0]} intensity={1.1} distance={3.5} color="#FFD2A0" />
      {act === "tablet" ? <pointLight position={[YOU_C[0] - 0.05, 1.2, YOU_C[2] + 0.45]} intensity={0.55} distance={1.4} color="#9A5AE8" /> : null}
      <Char L={L} p={YOU_C} ry={0} pose={pose} seed={1} />
      <Bublyk p={DOG_C} ry={DOG_RY} s={0.85} pose={{ sit: 0, alert: dogAlert, head: [0, -0.35 * dogAlert], tail: f / (dogAlert > 0.5 ? 30 : 9), blink: blink(f, 4) }} />
      {children}
    </Cellar>
  );
};

/* cellar cameras */
const faceCam = (k: number, y = FACE): V3 => [YOU_C[0] + 0.15, y + 0.04, YOU_C[2] + k];
const SFaceTab = () => { const f = useCurrentFrame(); return <Shot><InCellar act="tablet" /><Cam p={faceCam(2.1 - f * 0.004)} t={[YOU_C[0], FACE - 0.12, YOU_C[2]]} fov={32} drift={0.4} /></Shot>; };
const SFace: React.FC<{ act?: CAct; push?: number }> = ({ act = "stand", push = 0.004 }) => { const f = useCurrentFrame(); return <Shot><InCellar act={act} dogAlert={0.8} /><Cam p={faceCam(2.0 - f * push)} t={[YOU_C[0], FACE - 0.1, YOU_C[2]]} fov={31} drift={0.35} /></Shot>; };
const SCellarWide: React.FC<{ act?: CAct }> = ({ act = "stand" }) => { const f = useCurrentFrame(); return <Shot><InCellar act={act} /><Cam p={[1.2, 1.75, 4.6 - f * 0.004]} t={[-0.3, 0.8, -0.5]} fov={50} drift={0.5} /></Shot>; };
const SBucket = () => { const f = useCurrentFrame(); return <Shot tilt={false}><InCellar /><pointLight position={[BUCKET[0] + 0.2, 0.9, BUCKET[2] + 0.4]} intensity={0.8} distance={1.6} color="#FFD2A0" /><Cam p={[BUCKET[0] + 0.15, 0.95 - f * 0.002, BUCKET[2] + 0.55]} t={[BUCKET[0], 0.05, BUCKET[2]]} fov={34} drift={0.25} /></Shot>; };
const SDog = () => { const f = useCurrentFrame(); const a = io(f, 4, 26, 0.4, 1); return <Shot><InCellar dogAlert={a} /><Cam p={[DOG_C[0] + 0.9, 0.75, DOG_C[2] + 2.1 - f * 0.003]} t={[DOG_C[0] + 0.1, 0.38, DOG_C[2] - 0.1]} fov={36} drift={0.3} /></Shot>; };

/* ─── yard cameras. "out" = +z; the well is 40 m from the door ─── */
const LOOK_OUT: V3 = [WELL[0] - 0.5, 0.6, WELL[2]];
/** the thermal screen = the doorway camera's view in thermal */
const SThermal: React.FC<{ push?: number }> = ({ push = 0.02 }) => { const f = useCurrentFrame(); return <Shot tilt={false}><Yard thermal /><Cam p={[0.3, 2.2, 1.0 + f * push]} t={LOOK_OUT} fov={34} drift={0.2} /></Shot>; };
const SYardWide: React.FC<{ thermal?: boolean }> = ({ thermal }) => { const f = useCurrentFrame(); return <Shot tilt={!thermal}><Yard thermal={thermal} /><Cam p={[-4.5, 3.4, 8 + f * 0.01]} t={[WELL[0], 0.5, WELL[2]]} fov={30} drift={0.3} /></Shot>; };
const SToWell = () => { const f = useCurrentFrame(); return <Shot><Yard /><Cam p={[0.4, 1.6, 0.9 + f * 0.012]} t={LOOK_OUT} fov={22} drift={0.3} /></Shot>; };
const MOUND_CAM = (f: number): V3 => [1.5, 1.45, WELL[2] - 10.5 + f * 0.008];
const MOUND_T: V3 = [1.5, 0.05, WELL[2] - 1.2];
const SMounds = () => { const f = useCurrentFrame(); return <Shot><Yard /><Cam p={MOUND_CAM(f)} t={MOUND_T} fov={44} drift={0.3} /></Shot>; };
const SDoorGap = () => { const f = useCurrentFrame(); return <Shot><Yard doorOpen={0.25} /><Cam p={[0.7, 1.55, 0.32 + f * 0.002]} t={[1.6 - f * 0.004, 0.9, 20]} fov={40} drift={0.25} /></Shot>; };
const SSnowLow = () => { const f = useCurrentFrame(); return <Shot><Yard /><Cam p={[-1.5 + f * 0.006, 0.32, 14]} t={[1.5, 0.15, 34]} fov={30} drift={0.2} /></Shot>; };
const SStreet = () => { const f = useCurrentFrame(); return <Shot><Yard /><Cam p={[0.5, 1.6, 30]} t={[-18 + f * 0.25, 0.8, 46]} fov={30} drift={0.3} /></Shot>; };

/* the run: driven by distance so the feet do not skate. Out: z 1 → ~9 (we cut), fill at the well, back: z 36 → toward camera */
const SPEED = 5.2 / FPS; // metres per frame
const SRunOut = () => {
  const f = useCurrentFrame(); const z = 1.2 + f * SPEED;
  return <Shot><Yard doorOpen={1} yourPrints={z / 80}><Char L={YOU_BUCKET} p={[0.2, 0, z]} ry={0.03} pose={{ ...runPose(z - 1.2), holdOff: false }} seed={1} /></Yard><Cam p={[-0.6, 1.5, z - 3.6]} t={[0.8, 0.9, z + 8]} fov={40} drift={0.6} /></Shot>;
};
const SFill = () => {
  const f = useCurrentFrame(); const k = io(f, 0, 14, 0, 1);
  return <Shot><Yard doorOpen={1} yourPrints={0.5}><Char L={YOU_BUCKET} p={[WELL[0] - 0.55, 0, WELL[2] - 0.85]} ry={0.5} pose={blendPose({ head: [0.3, 0, 0], browUp: 0.8 }, { ...reachPose(0.7), spine: [0.5, 0, 0], head: [0.5, 0, 0], browUp: 0.8 }, k)} seed={1} /></Yard><Cam p={[WELL[0] - 4.2, 1.5, WELL[2] - 5.0 + f * 0.004]} t={[WELL[0] - 0.4, 0.75, WELL[2] - 0.6]} fov={36} drift={0.5} /></Shot>;
};
const SRunBack = () => {
  const f = useCurrentFrame(); const z = 36 - f * SPEED;
  return <Shot><Yard doorOpen={1} yourPrints={0.5 + (36 - z) / 80}><Char L={YOU_BUCKET} p={[-0.1, 0, z]} ry={Math.PI} pose={runPose(36 - z, 1.3)} seed={1} /></Yard><Cam p={[-0.7, 1.35, z - 4.6]} t={[0.5, 0.9, z + 6]} fov={40} drift={0.6} /></Shot>;
};

/* flashbacks: night snowfall on the two mounds; the dead lying there BEFORE the snow; autumn — you stack ONE pile */
const SNightMounds = () => { const f = useCurrentFrame(); return <Shot dim={0.9}><Yard night /><Cam p={MOUND_CAM(f)} t={MOUND_T} fov={44} drift={0.3} /></Shot>; };
const SNightBody = () => {
  const f = useCurrentFrame(); const cover = io(f, 10, 70, 0.05, 0.75);
  return (
    <Shot dim={0.9}>
      <Yard night gone>
        {/* the dead, lying face up, arms by the sides — the snow builds up over it */}
        <group position={[BODY[0], 0.13, BODY[2]]} rotation={[0, -0.3, 0]}><group rotation={[-Math.PI / 2, 0, 0]}><Char L={DEAD} p={[0, -0.9, 0]} pose={{ head: [0.1, 0.2, 0], blink: 0.7 }} seed={7} /></group></group>
        <group scale={[1, cover, 1]}><Mound p={BODY} ry={-0.3} /></group>
      </Yard>
      <Cam p={[BODY[0] + 2.4, 1.9, BODY[2] - 3.0 + f * 0.003]} t={[BODY[0], 0.1, BODY[2]]} fov={36} drift={0.3} />
    </Shot>
  );
};
const SAutumn = () => {
  const f = useCurrentFrame();
  return <Shot><Yard autumn><Char L={YOU} p={[SANDBAGS[0] - 0.9, 0, SANDBAGS[2] - 0.6]} ry={1.0} pose={blendPose(CROUCH, { ...CROUCH, spine: [0.7, 0, 0] }, 0.5 + 0.5 * Math.sin(f / 12))} seed={1} /></Yard><Cam p={[SANDBAGS[0] + 1.7, 1.45, SANDBAGS[2] + 2.0 - f * 0.004]} t={[SANDBAGS[0] - 0.6, 0.55, SANDBAGS[2] - 0.4]} fov={38} drift={0.3} /></Shot>;
};
/* now: one mound + the hollow; then fresh footprints from it to your door */
const SOneMound = () => { const f = useCurrentFrame(); return <Shot><Yard gone yourPrints={1} newPrints={1} /><Cam p={MOUND_CAM(f)} t={MOUND_T} fov={44} drift={0.3} /></Shot>; };
const SPrints: React.FC<{ end?: boolean }> = ({ end }) => {
  const f = useCurrentFrame();
  /* end card: blur via the Shot itself (tilt-shift off). A CSS-filter wrapper (BlurIn) round the tilt-shift backdrop-filter crashes software-GL Chromium. */
  const k = end ? io(f, 0, 15, 0, 1) : 0;
  return <Shot blur={k * 12} dim={1 - k * 0.35} tilt={!end}><Yard gone yourPrints={1} newPrints={1} /><Cam p={[0.6, 0.55, 2.6 + (end ? 0 : f * 0.006)]} t={[0.2, 0.0, 14]} fov={40} drift={0.3} /></Shot>;
};

/* ─── the edit, by LINE NUMBER (a new voice take re-times the picture) ─── */
type Cut = { a: number; b: number; el: React.ReactNode };
const T = (n: number) => LINE[n - 1].t;
const E = (n: number) => LINE[n - 1].end;
const END = E(LINE.length) + 0.4;
const mid = (n: number) => (T(n) + E(n)) / 2;
export const CUTS: Cut[] = [
  { a: 0, b: mid(1) + 0.4, el: <><SThermal /><ThermalHUD /><RuleSign /></> },
  { a: mid(1) + 0.4, b: T(2) - 0.1, el: <><SFaceTab /><RuleTag /></> },
  { a: T(2) - 0.1, b: T(3) - 0.1, el: <><SThermal push={0.04} /><ThermalHUD /></> },
  { a: T(3) - 0.1, b: T(4) - 0.1, el: <><SCellarWide act="tablet" /><ProofCard title="คนเป็น อุณหภูมิร่างกาย" big="37" unit="°C" /></> },
  { a: T(4) - 0.1, b: T(5) - 0.1, el: <><SYardWide /><ProofCard title="ศพ เย็นลงราว" big="0.8" unit="°C / ชม." note="ในชั่วโมงแรก ๆ (ยิ่งหนาว ยิ่งเร็ว)" source="กฎคร่าว ๆ ทางนิติเวช (Glaister)" /></> },
  { a: T(5) - 0.1, b: T(6) - 0.1, el: <><SYardWide /><Measure value="−10 °C" label="ข้างนอก" y={420} /></> },
  { a: T(6) - 0.1, b: T(7) - 0.1, el: <><SYardWide thermal /><ThermalHUD /></> },
  { a: T(7) - 0.1, b: T(8) - 0.1, el: <><SCellarWide /><Clock t="06:00" label="หมู่บ้านโซเนียชเน" /></> },
  { a: T(8) - 0.1, b: mid(8), el: <><SBucket /><Clock t="06:01" /></> },
  { a: mid(8), b: T(9) - 0.1, el: <><SToWell /><Measure value="40 ม." label="ถึงบ่อน้ำ" y={420} /></> },
  { a: T(9) - 0.1, b: T(10) - 0.1, el: <SMounds /> },
  { a: T(10) - 0.1, b: T(11) - 0.1, el: <SDog /> },
  { a: T(11) - 0.1, b: mid(11), el: <SFace /> },
  { a: mid(11), b: T(12) - 0.1, el: <SDoorGap /> },
  { a: T(12) - 0.1, b: T(13) - 0.1, el: <><SSnowLow /><Clock t="03:00 → 06:10" /></> },
  { a: T(13) - 0.1, b: T(14) - 0.1, el: <SSnowLow /> },
  { a: T(14) - 0.1, b: T(15) - 0.1, el: <SStreet /> },
  { a: T(15) - 0.1, b: T(15) + 1.3, el: <><SRunOut /><Clock t="06:15" /></> },
  { a: T(15) + 1.3, b: T(15) + 2.3, el: <><SFill /><Clock t="06:15" /></> },
  { a: T(15) + 2.3, b: T(16) + 0.9, el: <><SRunBack /><Clock t="06:15" /></> },
  { a: T(16) + 0.9, b: T(17) - 0.1, el: <><SFace act="bucket" /><Clock t="06:15:30" /></> },
  { a: T(17) - 0.1, b: T(18) - 0.1, el: <SFace act="dread" push={0.006} /> },
  { a: T(18) - 0.1, b: T(19) - 0.1, el: <><SNightMounds /><Clock t="02:40" /></> },
  { a: T(19) - 0.1, b: T(20) - 0.1, el: <><SNightBody /><Clock t="02:40" /></> },
  { a: T(20) - 0.1, b: T(21) - 0.1, el: <><SAutumn /><Clock t="ต.ค." label="ฤดูใบไม้ร่วง" /></> },
  { a: T(21) - 0.1, b: T(22) - 0.1, el: <SOneMound /> },
  { a: T(22) - 0.1, b: END, el: <SPrints /> },
  { a: END, b: DUR / FPS, el: <><SPrints end /><NextCard /></> },
];

export const HERO_S = T(21);
export const Film: React.FC<{ noCaps?: boolean }> = ({ noCaps }) => (
  <AbsoluteFill style={{ background: "#07090F" }}>
    {CUTS.map((c, i) => (
      <Sequence key={i} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
        <AbsoluteFill>{c.el}</AbsoluteFill>
      </Sequence>
    ))}
    <Flash at={fr(T(17))} c="rgba(200,220,255,0.7)" />
    <Flash at={fr(HERO_S)} c="rgba(190,40,40,0.8)" />
    <Vig a={0.4} />
    <FadeOut from={DUR - 24} />
    <Grain amount={0.05} />
    {noCaps ? null : <Captions hideFrom={END} />}
  </AbsoluteFill>
);

/* unused helpers kept for later episodes */
export const _unused = { CRATE, DOOR, lin };
