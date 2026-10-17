import React from "react";

const GRASS = "#62B44B";
const DIRT = "#8A5A33";
const STONE = "#B9B2A2";
const PATH = "#A67C52";
const WOOD = "#6B4A2B";
const WATER = "#4A90D9";

const m = (color: string) => (
  <meshStandardMaterial color={color} flatShading roughness={1} />
);

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
