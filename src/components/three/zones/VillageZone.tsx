import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { GameTab } from '../../NavigationTabs';
import { setInstance, touchInstances } from '../decor';

/** Zone làng trong thế giới 3D thống nhất — 9 tòa nhà instanced. Tọa độ local. */

export interface RegionInfo {
  id: GameTab;
  label: string;
  desc: string;
  cost: number;
  wall: string;
  roof: string;
}

export interface VillageZoneProps {
  regions: RegionInfo[];
  unlockedRegions: string[];
  selectedId: GameTab | null;
  onSelect: (id: GameTab | null) => void;
}

const GAP = 2.75;
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _c = new THREE.Color();

function setInstRot(
  mesh: THREE.InstancedMesh, i: number,
  x: number, y: number, z: number, ry: number,
  sx: number, sy: number, sz: number, color?: string,
) {
  _p.set(x, y, z);
  _e.set(0, ry, 0);
  _q.setFromEuler(_e);
  _s.set(Math.max(sx, 0.0001), Math.max(sy, 0.0001), Math.max(sz, 0.0001));
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(i, _m);
  if (color) mesh.setColorAt(i, _c.set(color));
}

function hideInst(mesh: THREE.InstancedMesh, i: number) {
  _p.set(0, -60, 0); _s.set(0.0001, 0.0001, 0.0001); _q.identity();
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(i, _m);
}

export function VillageZone({ regions, unlockedRegions, selectedId, onSelect }: VillageZoneProps) {
  const n = Math.max(1, regions.length);
  const wallRef = useRef<THREE.InstancedMesh>(null!);
  const roofRef = useRef<THREE.InstancedMesh>(null!);
  const doorRef = useRef<THREE.InstancedMesh>(null!);
  const winRef = useRef<THREE.InstancedMesh>(null!);
  const chimRef = useRef<THREE.InstancedMesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  const pos = useMemo(() => {
    return regions.map((_, i) => {
      const col = (i % 3) - 1;
      const row = Math.floor(i / 3) - 1;
      return { x: col * GAP, z: row * GAP };
    });
  }, [regions]);

  useLayoutEffect(() => {
    const wall = wallRef.current, roof = roofRef.current, door = doorRef.current;
    const win = winRef.current, chim = chimRef.current;
    if (!wall || !roof || !door || !win || !chim) return;

    regions.forEach((region, i) => {
      const { x, z } = pos[i];
      const locked = !unlockedRegions.includes(region.id);
      const wallC = locked ? '#B5B0A6' : region.wall;
      const roofC = locked ? '#8E8A82' : region.roof;

      setInstRot(wall, i, x, 0.55, z, 0, 1, 1, 1, wallC);
      setInstRot(roof, i, x, 1.42, z, Math.PI / 4, 1, 1, 1, roofC);
      setInstRot(door, i, x, 0.32, z + 0.71, 0, 1, 1, 1, locked ? '#4A4640' : '#5A3D26');
      const winC = locked ? '#6A655C' : '#BFE3F2';
      setInstRot(win, i * 2, x - 0.5, 0.68, z + 0.71, 0, 1, 1, 1, winC);
      setInstRot(win, i * 2 + 1, x + 0.5, 0.68, z + 0.71, 0, 1, 1, 1, winC);
      setInstRot(chim, i, x + 0.45, 1.7, z - 0.25, 0, 1, 1, 1, locked ? '#8E8A82' : '#A89880');
    });

    [wall, roof, door, win, chim].forEach(touchInstances);
  }, [regions, unlockedRegions, pos]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined || idx >= regions.length) return;
    const id = regions[idx].id;
    onSelect(selectedId === id ? null : id);
  };

  const selIdx = regions.findIndex((r) => r.id === selectedId);
  const selPos = selIdx >= 0 ? pos[selIdx] : null;

  return (
    <group>
      {/* Quảng trường + giếng trung tâm */}
      <mesh position={[0, 0.015, 0]} raycast={() => null}>
        <cylinderGeometry args={[1.1, 1.1, 0.05, 20]} />
        <meshStandardMaterial color="#D9CFAE" flatShading roughness={1} />
      </mesh>
      <group position={[0, 0, 0]} raycast={() => null}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.5, 8]} />
          <meshStandardMaterial color="#A89880" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 8]} />
          <meshStandardMaterial color="#7A6A5A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.55, 0.35, 4]} />
          <meshStandardMaterial color="#E2725B" flatShading roughness={1} />
        </mesh>
      </group>

      {/* Thân nhà — bấm được */}
      <instancedMesh
        ref={wallRef}
        args={[undefined, undefined, n]}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[1.6, 1.1, 1.4]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      {/* Mái pyramid (geometry xoay sẵn 45°) */}
      <instancedMesh ref={roofRef} args={[undefined, undefined, n]} raycast={() => null}>
        <coneGeometry args={[1.32, 0.75, 4]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={doorRef} args={[undefined, undefined, n]} raycast={() => null}>
        <boxGeometry args={[0.42, 0.64, 0.06]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={winRef} args={[undefined, undefined, Math.max(1, n * 2)]} raycast={() => null}>
        <boxGeometry args={[0.3, 0.3, 0.06]} />
        <meshStandardMaterial flatShading roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={chimRef} args={[undefined, undefined, n]} raycast={() => null}>
        <boxGeometry args={[0.22, 0.55, 0.22]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>

      {/* Vòng chọn */}
      {selPos && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[selPos.x, 0.03, selPos.z]} raycast={() => null}>
          <ringGeometry args={[1.15, 1.32, 24]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export default VillageZone;
