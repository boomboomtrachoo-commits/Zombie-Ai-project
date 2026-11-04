import React from "react";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Pl, Sp, rnd, useTex, type V3 } from "../kit/three";
import { Atmos } from "./yard";

/** CELLAR under your house. One hanging bulb (warm), a tablet glowing purple (the thermal feed), brick walls, jars.
 *  Plan (metres): room x −2..2, z −2..2, floor y=0, ceiling y=2.2.
 *    STAIRS against the back wall (z=−1.55), rising along +x from x=−1.6 to x=0.3,
 *    ending at the HATCH in the ceiling (x≈0.75, y≈2.2), which opens to the house door.
 *    BULB hangs at [0.2, 1.85, 0.2]. Mattress + blanket along the left wall (x≈−1.5). Shelves of jars on the right wall (x=2).
 *    CRATE with the TABLET at [0.9, 0, 0.6]. Empty BUCKET tipped over at [−0.4, 0, 1.0].
 *  Front wall (+z) is left open for the cameras. */
export const STAIRS_FOOT: V3 = [-1.2, 0, -0.9];
export const BULB: V3 = [0.2, 1.85, 0.2];
export const CRATE: V3 = [0.9, 0, 0.6];
export const BUCKET: V3 = [-0.4, 0, 1.0];

const FLOOR = "#4A4038", PLANK = "#6A5240", PLANK_D = "#4A392C";

export const Cellar: React.FC<{ bulb?: number; hatch?: number; tablet?: boolean; children?: React.ReactNode }> = ({ bulb = 1, hatch = 0, tablet = true, children }) => {
  const f = useCurrentFrame();
  const flick = 1 - 0.06 * (rnd(Math.floor(f / 3)) > 0.85 ? 1 : 0); // the bulb flickers now and then
  const bricks = useTex(256, 256, (g) => {
    g.fillStyle = "#4E3A30"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++) {
      const sh = 0.85 + rnd(r * 7 + c) * 0.3;
      g.fillStyle = `rgb(${Math.round(122 * sh)},${Math.round(86 * sh)},${Math.round(70 * sh)})`;
      g.fillRect(c * 56 - (r % 2) * 28 + 2, r * 32 + 2, 52, 28);
    }
  }, "cellar-bricks");
  bricks.wrapS = bricks.wrapT = 1000; // RepeatWrapping
  bricks.repeat.set(4, 2.4);
  return (
    <group>
      <Atmos c="#0E0B09" far={0} />
      <ambientLight intensity={0.35} color="#E8CDB0" />
      <hemisphereLight args={["#F0D2B0", "#2A2018", 0.35]} />
      {/* the bulb = key light */}
      <pointLight position={BULB} intensity={3.2 * bulb * flick} distance={6} decay={1.6} color="#FFC98A" />
      {/* the room */}
      <Bx p={[0, -0.05, 0]} s={[4, 0.1, 4]} c={FLOOR} />
      <Bx p={[0, 2.25, 0]} s={[4, 0.1, 4]} c="#2E241E" />
      {[0.4, 1.2, 1.9].map((x) => <Bx key={x} p={[x - 1, 2.15, 0]} s={[0.14, 0.12, 4]} c={PLANK_D} />)}
      <Pl p={[0, 1.1, -2]} s={[4, 2.2]} c="#ffffff" map={bricks} />
      <Pl p={[-2, 1.1, 0]} s={[4, 2.2]} c="#ffffff" ry={Math.PI / 2} map={bricks} />
      <Pl p={[2, 1.1, 0]} s={[4, 2.2]} c="#ffffff" ry={-Math.PI / 2} map={bricks} />
      {/* stairs rising along +x against the back wall, up to the hatch */}
      {Array.from({ length: 8 }, (_, i) => <Bx key={i} p={[-1.6 + i * 0.27, 0.13 + i * 0.27, -1.55]} s={[0.3, 0.06, 0.8]} c={PLANK} />)}
      <Bx p={[-0.55, 1.05, -1.15]} s={[2.6, 0.08, 0.06]} c={PLANK_D} rz={0.78} />
      {/* hatch door at the top (opens up = light from the house) */}
      <group position={[0.75, 2.2, -1.55]}>
        <group position={[-0.4, 0, 0]} rotation={[0, 0, hatch * 1.2]}>
          <Bx p={[0.4, 0, 0]} s={[0.8, 0.06, 0.8]} c={PLANK} />
        </group>
        {hatch > 0 ? <><pointLight position={[0, 0.6, 0]} intensity={2 * hatch} distance={4} color="#D8E2EE" /><Glow p={[0, 0.1, 0]} s={1.6} o={0.5 * hatch} c="#E6EEF8" /></> : null}
      </group>
      {/* hanging bulb: wire, socket, glowing glass + halo */}
      <Cy p={[BULB[0], 2.05, BULB[2]]} r={0.005} h={0.3} c="#141414" />
      <Cy p={[BULB[0], 1.91, BULB[2]]} r={0.025} h={0.05} c="#2A2A2A" />
      <Sp p={BULB} r={0.045} c="#FFE2B0" e="#FFC98A" ei={2 * bulb * flick} />
      <Glow p={BULB} s={1.3} o={0.6 * bulb * flick} />
      {/* shelves of jars on the right wall */}
      {[0.6, 1.2, 1.8].map((y, r) => (
        <group key={y}>
          <Bx p={[1.82, y, 0.2]} s={[0.32, 0.04, 2.6]} c={PLANK} />
          {Array.from({ length: 7 }, (_, i) => rnd(r * 9 + i) > 0.3 ? <Cy key={i} p={[1.8, y + 0.11, -0.95 + i * 0.36]} r={0.065} h={0.18} c={["#C0582E", "#B23A34", "#7E8E3A", "#D9A441"][(r + i) % 4]} /> : null)}
        </group>
      ))}
      {/* mattress + grey blanket on the left */}
      <Bx p={[-1.5, 0.09, 0.7]} s={[0.85, 0.18, 1.9]} c="#8A8274" />
      <Bx p={[-1.48, 0.21, 0.95]} s={[0.88, 0.07, 1.3]} c="#5E6470" r={1} />
      {/* the crate with the tablet (purple thermal glow) */}
      <group position={CRATE}>
        <Bx p={[0, 0.25, 0]} s={[0.6, 0.5, 0.45]} c={PLANK} />
        {[0.12, 0.38].map((y) => <Bx key={y} p={[0, y, 0.23]} s={[0.6, 0.04, 0.01]} c={PLANK_D} />)}
        {tablet ? <group position={[0, 0.52, 0]} rotation={[-1.2, 0, 0]}>
          <Bx s={[0.26, 0.18, 0.015]} c="#1A1B1F" />
          <Bx p={[0, 0, 0.009]} s={[0.24, 0.16, 0.002]} c="#5B2D86" e="#7A3CB0" ei={1.2} />
          <Glow p={[0, 0, 0.05]} s={0.5} o={0.35} c="#9A6AE0" />
        </group> : null}
      </group>
      {/* the EMPTY bucket: zinc pail, dry bottom, a ladle across it */}
      <group position={BUCKET}>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.15, 0.115, 0.26, 24, 1, true]} /><meshStandardMaterial color="#A3ABB2" roughness={0.4} side={2} /></mesh>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.115, 24]} /><meshStandardMaterial color="#6E767C" roughness={0.6} /></mesh>
        <mesh position={[0, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.008, 6, 28]} /><meshStandardMaterial color="#C3CACF" roughness={0.35} /></mesh>
        <Bx p={[0.02, 0.27, 0.0]} s={[0.36, 0.015, 0.03]} c="#6A5240" ry={0.5} />
      </group>
      {/* sandbag + jerrycan by the stairs */}
      <Sp p={[-1.75, 0.12, -0.6]} r={0.3} c="#8E8160" sc={[1, 0.45, 0.7]} />
      <Bx p={[-1.75, 0.2, 0.0]} s={[0.18, 0.4, 0.3]} c="#3E5A3A" />
      {children}
    </group>
  );
};
