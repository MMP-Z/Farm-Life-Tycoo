import { useMemo } from "react";

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const BUILDINGS: [number, number][] = [
  [0, 5],
  [0, 11],
  [15, -8],
  [15, -2],
  [15, 4],
  [-14, -2],
  [14, 10],
  [-14, 10],
  [-8, 12],
  [-18, 12],
];

function isAvoided(x: number, z: number) {
  if (Math.abs(x) < 1.5) return true;
  if (Math.abs(z) < 1.5) return true;
  if (Math.hypot(x, z) < 5) return true;
  for (const [bx, bz] of BUILDINGS) {
    if (Math.hypot(x - bx, z - bz) < 3) return true;
  }
  return false;
}

const TREE_POSITIONS: [number, number][] = [
  [2.5, -13],
  [2.5, -6],
  [2.5, 8],
  [-2.5, -13],
  [-2.5, -6],
  [-2.5, 8],
  [-14, 2.5],
  [-6, 2.5],
  [8, 2.5],
  [-14, -2.5],
  [-6, -2.5],
  [8, -2.5],
];

const LIGHTS: [number, number][] = [
  [3, 3],
  [-3, 3],
  [3, -3],
  [-3, -3],
  [0, 8],
  [0, -8],
];

function buildFence(x1: number, z1: number, x2: number, z2: number) {
  const posts: [number, number][] = [];
  const rails: { pos: [number, number, number]; size: [number, number, number] }[] = [];
  const seen = new Set<string>();
  const addPost = (x: number, z: number) => {
    const k = `${x.toFixed(3)},${z.toFixed(3)}`;
    if (seen.has(k)) return;
    seen.add(k);
    posts.push([x, z]);
  };

  // bottom & top (horizontal)
  for (const z of [z1, z2]) {
    let x = x1;
    while (x < x2 - 1e-6) {
      addPost(x, z);
      x += 1.5;
    }
    addPost(x2, z);
    const cx = (x1 + x2) / 2;
    const len = x2 - x1;
    for (const y of [0.3, 0.55]) {
      rails.push({ pos: [cx, y, z], size: [len, 0.08, 0.08] });
    }
  }
  // left & right (vertical)
  for (const x of [x1, x2]) {
    let z = z1;
    while (z < z2 - 1e-6) {
      addPost(x, z);
      z += 1.5;
    }
    addPost(x, z2);
    const cz = (z1 + z2) / 2;
    const len = z2 - z1;
    for (const y of [0.3, 0.55]) {
      rails.push({ pos: [x, y, cz], size: [0.08, 0.08, len] });
    }
  }

  return { posts, rails };
}

const FARM = buildFence(-19, -7, -9, 3);
const BARN = buildFence(9, 5, 19, 15);

export function VillageDecor() {
  const { grass, flowers } = useMemo(() => {
    const rng = makeRng(20240517);
    const rand = () => rng();
    const range = (a: number, b: number) => a + (b - a) * rand();

    const grass: {
      x: number;
      z: number;
      blades: { x: number; z: number; rot: number; h: number; color: string }[];
    }[] = [];
    while (grass.length < 25) {
      const x = range(-22, 22);
      const z = range(-16, 16);
      if (isAvoided(x, z)) continue;
      const bladeCount = 3 + Math.floor(rand() * 3);
      const blades = [];
      for (let i = 0; i < bladeCount; i++) {
        blades.push({
          x: range(-0.25, 0.25),
          z: range(-0.25, 0.25),
          rot: rand() * Math.PI,
          h: 0.25 + rand() * 0.25,
          color: rand() < 0.5 ? "#3a7d2a" : "#4a9d3a",
        });
      }
      grass.push({ x, z, blades });
    }

    const flowerColors = ["#e74c3c", "#f1c40f", "#ffffff"];
    const flowers: { x: number; z: number; color: string; h: number }[] = [];
    while (flowers.length < 15) {
      const x = range(-22, 22);
      const z = range(-16, 16);
      if (isAvoided(x, z)) continue;
      flowers.push({
        x,
        z,
        color: flowerColors[Math.floor(rand() * 3)],
        h: 0.2 + rand() * 0.15,
      });
    }

    return { grass, flowers };
  }, []);

  const raycast = () => null;

  return (
    <group>
      {/* Grass + wildflowers */}
      {grass.map((g, gi) => (
        <group key={`grass-${gi}`} position={[g.x, 0, g.z]}>
          {g.blades.map((b, bi) => (
            <mesh
              key={bi}
              position={[b.x, b.h / 2, b.z]}
              rotation={[0, b.rot, 0]}
              raycast={raycast}
            >
              <coneGeometry args={[0.05, b.h, 5]} />
              <meshStandardMaterial color={b.color} flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {flowers.map((f, fi) => (
        <group key={`flower-${fi}`} position={[f.x, 0, f.z]}>
          <mesh position={[0, f.h / 2, 0]} raycast={raycast}>
            <cylinderGeometry args={[0.02, 0.02, f.h, 6]} />
            <meshStandardMaterial color="#3a7d2a" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, f.h + 0.05, 0]} raycast={raycast}>
            <sphereGeometry args={[0.07, 8, 6]} />
            <meshStandardMaterial color={f.color} flatShading roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Trees */}
      {TREE_POSITIONS.map((t, ti) => (
        <group key={`tree-${ti}`} position={[t[0], 0, t[1]]}>
          <mesh position={[0, 0.6, 0]} raycast={raycast}>
            <cylinderGeometry args={[0.12, 0.15, 1.2, 6]} />
            <meshStandardMaterial color="#6b4f2a" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.8, 0]} raycast={raycast}>
            <coneGeometry args={[0.9, 1.2, 6]} />
            <meshStandardMaterial color="#2f6b2f" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 2.7, 0]} raycast={raycast}>
            <coneGeometry args={[0.6, 1.0, 6]} />
            <meshStandardMaterial color="#3a7d3a" flatShading roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Street lights */}
      {LIGHTS.map((l, li) => (
        <group key={`light-${li}`} position={[l[0], 0, l[1]]}>
          <mesh position={[0, 0.8, 0]} raycast={raycast}>
            <cylinderGeometry args={[0.06, 0.08, 1.6, 6]} />
            <meshStandardMaterial color="#888888" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.75, 0]} raycast={raycast}>
            <sphereGeometry args={[0.15, 8, 6]} />
            <meshStandardMaterial color="#ffd24d" flatShading roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Fences */}
      {[FARM, BARN].map((fence, fi) => (
        <group key={`fence-${fi}`}>
          {fence.posts.map((p, pi) => (
            <mesh key={`post-${pi}`} position={[p[0], 0.35, p[1]]} raycast={raycast}>
              <boxGeometry args={[0.12, 0.7, 0.12]} />
              <meshStandardMaterial color="#8b6f47" flatShading roughness={1} />
            </mesh>
          ))}
          {fence.rails.map((r, ri) => (
            <mesh key={`rail-${ri}`} position={r.pos} raycast={raycast}>
              <boxGeometry args={r.size} />
              <meshStandardMaterial color="#8b6f47" flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export default VillageDecor;
