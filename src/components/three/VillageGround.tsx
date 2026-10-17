import React from "react";

const GRASS = "#7FB069";
const DIRT = "#8A5A33";
const STONE = "#C9C2B4";
const PATH = "#B08968";
const WOOD = "#6B4A2B";
const WATER = "#5AA8D8";
const PATCH_A = "#8FBC6F";
const PATCH_B = "#6FA055";

const m = (color: string) => (
  <meshStandardMaterial color={color} flatShading roughness={0.85} />
);

// Seeded RNG để patch cỏ mỗi lần load giống nhau
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Patch cỏ loang 2 tông xanh — tránh đường (x=0, z=0), quảng trường (r<5.5) và cụm công trình
const PATCHES: [number, number, number, string][] = (() => {
  const rand = seededRandom(20261017);
  const spots: [number, number, number, string][] = [];
  const avoid: [number, number, number][] = [
    [0, 0, 5.5], [0, 5, 3], [0, 11, 5], [15, -8, 3], [15, -2, 3],
    [15, 4, 3], [-14, -2, 4], [14, 10, 4.5], [-14, 10, 3], [-8, 12, 3], [-18, 12, 3],
  ];
  let guard = 0;
  while (spots.length < 14 && guard++ < 200) {
    const x = (rand() * 2 - 1) * 20;
    const z = (rand() * 2 - 1) * 14;
    if (Math.abs(x) < 2 || Math.abs(z) < 2) continue;
    if (avoid.some(([ax, az, r]) => Math.hypot(x - ax, z - az) < r)) continue;
    if (spots.some(([px, pz]) => Math.hypot(x - px, z - pz) < 4)) continue;
    const r = 1.5 + rand() * 2;
    spots.push([x, z, r, spots.length % 2 === 0 ? PATCH_A : PATCH_B]);
  }
  return spots;
})();

const clusters: [number, number][] = [
  [0, 11],
  [15, -2],
  [-14, -2],
  [14, 10],
  [-14, 10],
];

export function VillageGround() {
  return (
    <group>
      {/* Dirt body */}
      <mesh position={[0, -0.9, 0]} receiveShadow>
        <boxGeometry args={[44, 1.2, 32]} />
        {m(DIRT)}
      </mesh>
      {/* Grass top */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[44, 0.3, 32]} />
        {m(GRASS)}
      </mesh>

      {/* Patch cỏ loang 2 tông xanh cho đỡ phẳng */}
      {PATCHES.map(([x, z, r, c], i) => (
        <mesh key={`patch-${i}`} position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <circleGeometry args={[r, 20]} />
          {m(c)}
        </mesh>
      ))}

      {/* Stone border */}
      <mesh position={[0, 0.05, 16]} receiveShadow>
        <boxGeometry args={[44, 0.1, 0.2]} />
        {m(STONE)}
      </mesh>
      <mesh position={[0, 0.05, -16]} receiveShadow>
        <boxGeometry args={[44, 0.1, 0.2]} />
        {m(STONE)}
      </mesh>
      <mesh position={[22, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.1, 32]} />
        {m(STONE)}
      </mesh>
      <mesh position={[-22, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.1, 32]} />
        {m(STONE)}
      </mesh>

      {/* Main paths */}
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[2, 0.05, 32]} />
        {m(PATH)}
      </mesh>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[44, 0.05, 2]} />
        {m(PATH)}
      </mesh>

      {/* Paths to clusters */}
      {clusters.map(([x, z]) => {
        const len = Math.hypot(x, z);
        const cx = x / 2;
        const cz = z / 2;
        // rotation.y dương xoay trục X về phía -Z, nên dùng -atan2 để hướng đúng (x, z)
        const rot = -Math.atan2(z, x);
        return (
          <mesh
            key={`${x}-${z}`}
            position={[cx, 0.025, cz]}
            rotation={[0, rot, 0]}
            receiveShadow
          >
            <boxGeometry args={[len, 0.05, 1.2]} />
            {m(PATH)}
          </mesh>
        );
      })}

      {/* Plaza */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.08, 32]} />
        {m(STONE)}
      </mesh>

      {/* Well */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.8, 16]} />
          {m(STONE)}
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.1, 16]} />
          {m(WATER)}
        </mesh>
        {/* columns */}
        <mesh position={[-0.9, 1.0, 0]} castShadow>
          <boxGeometry args={[0.2, 1.2, 0.2]} />
          {m(WOOD)}
        </mesh>
        <mesh position={[0.9, 1.0, 0]} castShadow>
          <boxGeometry args={[0.2, 1.2, 0.2]} />
          {m(WOOD)}
        </mesh>
        {/* roof */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.2, 0.6, 3]} />
          {m(WOOD)}
        </mesh>
      </group>
    </group>
  );
}

export default VillageGround;
