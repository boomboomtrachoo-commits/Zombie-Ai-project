import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { Bx, Cy, Glow, Sp, rnd, type V3 } from "../kit/three";

/** YARD — your house, the yard, the well, the village street. Grey winter dawn, −10 °C, fog.
 *  Plan (metres): house front wall at z=0 (house body z −6..0), CELLAR DOOR in the front wall at x=0.
 *    Yard runs toward +z. Low picket fences at x=±7 from z=0 to z=42.
 *    WELL at [1.5, 0, 40] (40 m from the door).
 *    Two snow mounds by the well: SANDBAGS (the real pile) at [2.9, 0, 38.4], BODY (the dead, under the snow) at [0.1, 0, 38.6] — both in front of the well.
 *    Street along x at z≈45 (−40..40), ruined houses on its far side at z≈52, birches, a dead car, smoke far away.
 *  The door faces +z, so "out" = +z.  Fog hides the set edges. */
export const DOOR: V3 = [0, 0, 0];
export const WELL: V3 = [1.5, 0, 40];
export const SANDBAGS: V3 = [2.9, 0, 38.4];
export const BODY: V3 = [0.1, 0, 38.6];

const SNOW = "#D6DDE5", SNOW_S = "#C3CCD6", WOOD = "#5E4A3A", WOOD_D = "#3E3128", WALL = "#B9B3A6", ROOF = "#4A4E55", STONE = "#8C8F92";

/** footprints: a line of small dark ovals from a to b (step 0.7 m, alternating left/right) */
export const Prints: React.FC<{ a: V3; b: V3; k?: number; c?: string; seed?: number }> = ({ a, b, k = 1, c = "#8E9AA8", seed = 0 }) => {
  const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz), n = Math.floor((L / 0.7) * k);
  const ry = Math.atan2(dx, dz), nx = dz / L, nz = -dx / L;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const t = (i * 0.7) / L, sd = i % 2 ? 1 : -1, j = (rnd(i + seed * 31) - 0.5) * 0.06;
        return (
          <mesh key={i} position={[a[0] + dx * t + nx * 0.13 * sd + j, 0.012, a[2] + dz * t + nz * 0.13 * sd]} rotation={[-Math.PI / 2, 0, -ry]} scale={[0.11, 0.26, 1]}>
            <circleGeometry args={[1, 14]} /><meshStandardMaterial color={c} roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
};

/** a snow mound: a flattened, lumpy ellipsoid. hollow = the dent left when something got up */
export const Mound: React.FC<{ p: V3; ry?: number; s?: number; hollow?: boolean }> = ({ p, ry = 0, s = 1, hollow }) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    {hollow ? (
      <>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.5, 1.0, 1]}><circleGeometry args={[1, 24]} /><meshStandardMaterial color="#A9B4C0" roughness={1} /></mesh>
        <Sp p={[0.55, 0.04, 0]} r={0.3} c={SNOW} sc={[0.4, 0.3, 2.6]} />
        <Sp p={[-0.55, 0.04, 0]} r={0.3} c={SNOW} sc={[0.4, 0.3, 2.6]} />
      </>
    ) : (
      <>
        <Sp p={[0, 0.0, 0]} r={0.5} c="#EEF2F6" sc={[1.0, 0.62, 2.0]} />
        <Sp p={[0.1, 0.12, 0.45]} r={0.32} c="#EEF2F6" sc={[1, 0.8, 1]} />
        <Sp p={[-0.08, 0.1, -0.5]} r={0.3} c="#EEF2F6" sc={[1, 0.7, 1.2]} />
        {/* soft blue shadow on the snow so the mound reads against the white ground */}
        <mesh position={[-0.25, 0.006, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.75, 1.25, 1]}><circleGeometry args={[1, 24]} /><meshStandardMaterial color="#A9B6C6" roughness={1} transparent opacity={0.7} /></mesh>
      </>
    )}
  </group>
);

/** falling snow: deterministic flakes in a box round `c` (w × h × d). rate = metres per frame */
export const Snowfall: React.FC<{ c: V3; w?: number; h?: number; d?: number; n?: number; rate?: number }> = ({ c, w = 8, h = 5, d = 8, n = 260, rate = 0.012 }) => {
  const f = useCurrentFrame();
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const y = h - ((rnd(i) * h + f * rate * (0.7 + rnd(i + 9) * 0.6)) % h);
        const x = (rnd(i + 3) - 0.5) * w + Math.sin(f / 30 + i) * 0.08, z = (rnd(i + 5) - 0.5) * d;
        return <mesh key={i} position={[c[0] + x, c[1] + y, c[2] + z]}><sphereGeometry args={[0.022, 6, 4]} /><meshBasicMaterial color="#F4F7FA" /></mesh>;
      })}
    </group>
  );
};

/** thermal view: every surface renders as one cold purple (objects at air temperature show no contrast). Warm things go in `warm`. */
const THERMAL = new THREE.MeshLambertMaterial({ color: "#4A2A7E" });
const ThermalView: React.FC = () => { const { scene } = useThree(); scene.overrideMaterial = THERMAL; return null; };
/** background + fog must be set on the SCENE (a <color attach> inside a group attaches to the group and does nothing) */
export const Atmos: React.FC<{ c: string; near?: number; far?: number }> = ({ c, near = 14, far = 75 }) => {
  const { scene } = useThree();
  scene.background = new THREE.Color(c);
  scene.fog = far > 0 ? new THREE.Fog(c, near, far) : null;
  return null;
};

export type YardProps = {
  /** door leaf open 0..1 (swings outward to +z) */ doorOpen?: number;
  /** the body mound is gone (only a hollow) */ gone?: boolean;
  /** your footprints to the well and back, 0..1 drawn */ yourPrints?: number;
  /** NEW footprints from the hollow to your door, 0..1 drawn */ newPrints?: number;
  /** last autumn: no snow, ONE pile of sandbags being stacked */ autumn?: boolean;
  /** night, snow falling (flashback) */ night?: boolean;
  /** thermal-camera look */ thermal?: boolean;
  children?: React.ReactNode;
};

export const Yard: React.FC<YardProps> = ({ doorOpen = 0, gone, yourPrints = 0, newPrints = 0, autumn, night, thermal, children }) => {
  const sky = night ? "#1B2230" : autumn ? "#8E8A80" : "#A9B4C0";
  const ground = autumn ? "#5E5A44" : SNOW;
  return (
    <group>
      <Atmos c={thermal ? "#170C2E" : sky} near={thermal ? 6 : 14} far={thermal ? 60 : night ? 40 : 75} />
      {thermal ? <ThermalView /> : null}
      {/* overcast dawn: cool sky fill, a weak low sun in the east (+x), cold bounce from the snow */}
      <hemisphereLight args={[night ? "#3A4A68" : "#DCE4EE", night ? "#1A1E28" : "#8A929C", night ? 0.55 : 1.05]} />
      <directionalLight position={[30, 12, 30]} intensity={night ? 0.15 : 0.9} color={autumn ? "#E8D2A8" : "#F2E2CC"} />
      <ambientLight intensity={0.25} color="#C8D4E2" />
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 30]}><planeGeometry args={[200, 200]} /><meshStandardMaterial color={ground} roughness={1} /></mesh>
      {/* the house (cellar door in the front wall) */}
      <group>
        <Bx p={[0, 1.5, -3]} s={[8, 3, 6]} c={WALL} />
        <Bx p={[-2.1, 3.7, -3]} s={[4.6, 0.2, 6.6]} c={ROOF} rz={0.62} />
        <Bx p={[2.1, 3.7, -3]} s={[4.6, 0.2, 6.6]} c={ROOF} rz={-0.62} />
        {!autumn ? <><Bx p={[-2.1, 3.86, -3]} s={[4.4, 0.12, 6.4]} c={SNOW} rz={0.62} /><Bx p={[2.1, 3.86, -3]} s={[4.4, 0.12, 6.4]} c={SNOW} rz={-0.62} /></> : null}
        {/* boarded window */}
        <Bx p={[2.4, 1.6, 0.01]} s={[1.0, 0.8, 0.04]} c="#2A2E35" />
        {[-0.2, 0.15].map((y, i) => <Bx key={i} p={[2.4, 1.6 + y, 0.05]} s={[1.2, 0.12, 0.04]} c={WOOD} rz={i ? -0.15 : 0.1} />)}
        {/* door frame + leaf hinged on the left (−x), opening outward */}
        <Bx p={[0, 2.08, 0.05]} s={[1.1, 0.1, 0.12]} c={WOOD_D} />
        {[-1, 1].map((sd) => <Bx key={sd} p={[sd * 0.5, 1.02, 0.05]} s={[0.1, 2.06, 0.12]} c={WOOD_D} />)}
        <group position={[-0.45, 0, 0.04]} rotation={[0, -doorOpen * 1.2, 0]}>
          <Bx p={[0.45, 1.01, 0]} s={[0.9, 2.0, 0.06]} c={WOOD} r={0.95} />
          {[0.5, 1.0, 1.5].map((y) => <Bx key={y} p={[0.45, y, 0.035]} s={[0.86, 0.05, 0.01]} c={WOOD_D} />)}
          <Cy p={[0.8, 1.0, 0.06]} r={0.02} h={0.1} c="#2A2A2A" rx={Math.PI / 2} />
        </group>
        {/* a dim bulb glow through the door gap when open */}
        {doorOpen > 0 && !thermal ? <Glow p={[0, 1.2, -0.3]} s={1.4} o={0.35 * doorOpen} c="#FFC98A" /> : null}
        {/* doorstep */}
        <Bx p={[0, 0.06, 0.45]} s={[1.4, 0.12, 0.7]} c={STONE} />
      </group>
      {/* picket fences */}
      {[-7, 7].map((x) => (
        <group key={x}>
          <Bx p={[x, 0.6, 21]} s={[0.06, 0.08, 42]} c={WOOD_D} />
          {Array.from({ length: 40 }, (_, i) => <Bx key={i} p={[x, 0.45, 1 + i * 1.05]} s={[0.1, 0.9 + rnd(i + x) * 0.15, 0.08]} c={WOOD} rz={(rnd(i * 3 + x) - 0.5) * 0.12} />)}
        </group>
      ))}
      {/* the well: stone ring, wooden roof, crank, a rope */}
      <group position={WELL}>
        <Cy p={[0, 0.4, 0]} r={0.62} h={0.8} c={STONE} seg={24} />
        <Cy p={[0, 0.81, 0]} r={0.48} h={0.02} c="#141618" seg={24} />
        {!autumn ? <Cy p={[0, 0.83, 0]} r={0.64} r2={0.64} h={0.05} c={SNOW} seg={24} /> : null}
        {[-1, 1].map((sd) => <Bx key={sd} p={[sd * 0.55, 1.2, 0]} s={[0.08, 1.6, 0.08]} c={WOOD_D} />)}
        <Bx p={[-0.4, 2.05, 0]} s={[1.1, 0.06, 1.2]} c={WOOD} rz={0.45} />
        <Bx p={[0.4, 2.05, 0]} s={[1.1, 0.06, 1.2]} c={WOOD} rz={-0.45} />
        <Cy p={[0, 1.55, 0]} r={0.06} h={1.1} c={WOOD_D} rz={Math.PI / 2} />
        <Cy p={[0, 1.2, 0]} r={0.008} h={0.7} c="#8A7A5A" />
      </group>
      {/* the REAL sandbag pile (autumn: being stacked, no snow) */}
      {autumn ? (
        <group position={SANDBAGS}>
          {[[-0.45, 0.13, 0], [0.45, 0.13, 0], [0, 0.13, 0.5], [-0.2, 0.37, 0.25], [0.3, 0.37, 0.2]].map(([x, y, z], i) => <Sp key={i} p={[x, y, z]} r={0.32} c="#8E8160" sc={[1.4, 0.45, 0.8]} />)}
        </group>
      ) : <Mound p={SANDBAGS} ry={0.4} />}
      {/* the BODY mound (the dead under the snow) — or the hollow it left */}
      {autumn ? null : <Mound p={BODY} ry={-0.3} hollow={gone} />}
      {/* footprints */}
      {yourPrints > 0 ? <><Prints a={[0.1, 0, 0.9]} b={[WELL[0] - 0.4, 0, WELL[2] - 0.8]} k={Math.min(1, yourPrints * 2)} /><Prints a={[WELL[0] - 0.6, 0, WELL[2] - 0.8]} b={[-0.25, 0, 0.9]} k={Math.max(0, yourPrints * 2 - 1)} seed={2} /></> : null}
      {newPrints > 0 ? <Prints a={[BODY[0], 0, BODY[2] - 0.9]} b={[0.25, 0, 0.75]} k={newPrints} c="#6E7A88" seed={5} /> : null}
      {/* the street + far side */}
      <Bx p={[0, 0.02, 45.5]} s={[90, 0.04, 5]} c={autumn ? "#4A4740" : SNOW_S} />
      {[-24, -13, -3, 9, 21].map((x, i) => (
        <group key={x} position={[x, 0, 53 + (i % 2) * 2]}>
          <Bx p={[0, 1.4, 0]} s={[6, 2.8 - (i === 2 ? 1.2 : 0), 5]} c={i % 2 ? "#8E887C" : "#7A766E"} />
          {i === 2 ? null : <Bx p={[0, 3.0, 0]} s={[6.4, 0.2, 5.4]} c={autumn ? ROOF : SNOW} rz={(i % 3 - 1) * 0.08} />}
          <Bx p={[-1.2, 1.5, -2.52]} s={[1, 0.9, 0.04]} c="#1E2024" />
        </group>
      ))}
      {/* dead car under snow on the street */}
      <group position={[-9, 0, 46]} rotation={[0, 0.15, 0]}>
        <Bx p={[0, 0.5, 0]} s={[4, 0.7, 1.8]} c="#4E5A5E" />
        <Bx p={[0.2, 1.05, 0]} s={[2.2, 0.5, 1.6]} c="#3E484C" />
        {!autumn ? <Sp p={[0.2, 1.3, 0]} r={0.9} c={SNOW} sc={[1.3, 0.25, 0.95]} /> : null}
      </group>
      {/* birches */}
      {[[-10, 30], [-12, 18], [10, 26], [12, 38], [-5, 49], [6, 50]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cy p={[0, 3, 0]} r={0.12} r2={0.16} h={6} c="#E4E0D8" />
          {[1.2, 2.4, 3.6, 4.6].map((y, j) => <Bx key={j} p={[0, y, 0.12]} s={[0.12, 0.05, 0.02]} c="#2A2622" />)}
          {[0, 1, 2].map((j) => <Cy key={`b${j}`} p={[0.5 * (j - 1), 5 + j * 0.3, 0]} r={0.03} h={1.6} c="#6A625A" rz={(j - 1) * 0.7} />)}
        </group>
      ))}
      {/* smoke columns on the horizon (the war, far away) */}
      {!thermal ? [[-30, 120], [40, 140]].map(([x, z], i) => (
        <group key={i}>
          {Array.from({ length: 8 }, (_, j) => <Sp key={j} p={[x + j * 1.2, 4 + j * 5, z]} r={3 + j * 0.8} c="#5E636A" />)}
        </group>
      )) : null}
      {night ? <Snowfall c={[BODY[0], 0, BODY[2]]} w={10} h={5} d={10} /> : null}
      {children}
    </group>
  );
};
