import React from 'react';
import { Label } from '../Label';

/* ---------- Kho 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface BarnZoneProps {
  onOpenBarn: () => void;
}

export function BarnZone({ onOpenBarn }: BarnZoneProps) {
  return (
    <group>
      <Label text="Nhà Kho" position={[0, 5.4, -4]} scale={1.1} />

      {/* Nhà kho chính — bấm để mở menu 2D */}
      <group
        position={[0, 0, -4]}
        onClick={(e) => { e.stopPropagation(); onOpenBarn(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[5, 2.4, 3.5]} />
          <meshStandardMaterial color="#B08A5A" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.9, 0]}>
          <boxGeometry args={[5.6, 0.3, 4]} />
          <meshStandardMaterial color="#7A5A3A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.9, 1.8]}>
          <boxGeometry args={[1.8, 1.8, 0.12]} />
          <meshStandardMaterial color="#4A3220" flatShading roughness={1} />
        </mesh>
        <Label text="Bấm để mở kho" position={[0, 4.0, 0]} scale={0.65} />
      </group>

      {/* Thùng trang trí */}
      {[[-3, 0.5], [-2, 0.8], [3, 0.5], [2.2, 1.0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} raycast={() => null}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <meshStandardMaterial color={i % 2 ? '#C49A6C' : '#A97A4A'} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
