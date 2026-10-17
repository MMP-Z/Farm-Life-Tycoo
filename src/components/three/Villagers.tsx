import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

function isValidWaypoint(x: number, z: number) {
  if (Math.hypot(x, z) <= 5.5) return false;
  for (const [bx, bz] of BUILDINGS) {
    if (Math.hypot(x - bx, z - bz) <= 3) return false;
  }
  return true;
}

function randomWaypoint(): [number, number] {
  let x = 0;
  let z = 0;
  do {
    x = -20 + Math.random() * 40;
    z = -14 + Math.random() * 28;
  } while (!isValidWaypoint(x, z));
  return [x, z];
}

const NPC1_WAYPOINTS: [number, number][] = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return [Math.cos(a) * 6.5, Math.sin(a) * 6.5];
});

const NPC2_WAYPOINTS: [number, number][] = [
  [0, -13],
  [0, 13],
];

const NPC3_WAYPOINTS: [number, number][] = [
  [-19, 0],
  [19, 0],
];

interface VillagerProps {
  shirtColor: string;
  startPosition: [number, number];
  waypoints?: [number, number][];
  random?: boolean;
}

function Villager({ shirtColor, startPosition, waypoints, random }: VillagerProps) {
  const group = useRef<THREE.Group>(null!);
  const phase = useRef(0);
  const wpIndex = useRef(0);
  const target = useRef<[number, number]>(
    waypoints && waypoints.length > 0
      ? waypoints[0]
      : randomWaypoint()
  );

  useFrame((_, rawDt) => {
    const g = group.current;
    if (!g) return;

    const dt = Math.min(rawDt, 0.05);
    const [tx, tz] = target.current;
    const dx = tx - g.position.x;
    const dz = tz - g.position.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 0.3) {
      if (random) {
        target.current = randomWaypoint();
      } else if (waypoints && waypoints.length > 0) {
        wpIndex.current = (wpIndex.current + 1) % waypoints.length;
        target.current = waypoints[wpIndex.current];
      }
      g.position.y = THREE.MathUtils.lerp(g.position.y, 0, Math.min(1, dt * 8));
      return;
    }

    const step = 1.2 * dt;
    const move = Math.min(step, dist);
    g.position.x += (dx / dist) * move;
    g.position.z += (dz / dist) * move;
    g.rotation.y = Math.atan2(dx, dz);
    phase.current += dt * 10;
    g.position.y = Math.abs(Math.sin(phase.current)) * 0.04;
  });

  return (
    <group ref={group} position={[startPosition[0], 0, startPosition[1]]}>
      {/* Đầu */}
      <mesh position={[0, 0.85, 0]} raycast={() => null}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color="#F5C89B" flatShading roughness={0.85} />
      </mesh>
      {/* Thân / áo */}
      <mesh position={[0, 0.5, 0]} raycast={() => null}>
        <boxGeometry args={[0.36, 0.42, 0.24]} />
        <meshStandardMaterial color={shirtColor} flatShading roughness={0.85} />
      </mesh>
      {/* Quần */}
      <mesh position={[0, 0.22, 0]} raycast={() => null}>
        <boxGeometry args={[0.32, 0.18, 0.22]} />
        <meshStandardMaterial color="#5A4A3A" flatShading roughness={0.85} />
      </mesh>
    </group>
  );
}

export function Villagers() {
  return (
    <group>
      <Villager shirtColor="#E07856" startPosition={NPC1_WAYPOINTS[0]} waypoints={NPC1_WAYPOINTS} />
      <Villager shirtColor="#6A8FC4" startPosition={[0, -13]} waypoints={NPC2_WAYPOINTS} />
      <Villager shirtColor="#F2D06B" startPosition={[-19, 0]} waypoints={NPC3_WAYPOINTS} />
      <Villager shirtColor="#9A6AA8" startPosition={randomWaypoint()} random />
      <Villager shirtColor="#E8A04C" startPosition={randomWaypoint()} random />
      <Villager shirtColor="#F2A7B8" startPosition={randomWaypoint()} random />
    </group>
  );
}

export default Villagers;
