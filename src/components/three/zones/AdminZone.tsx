import React from 'react';
import { Label } from '../Label';

/* ---------- Hành chính 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface AdminZoneProps {
  onOpenAdmin: () => void;
}

export function AdminZone({ onOpenAdmin }: AdminZoneProps) {
  return (
    <group>
      <Label text="Hành Chính" position={[0, 5.6, -4]} scale={1.1} />
      <group
        position={[0, 0, -4]}
        onClick={(e) => { e.stopPropagation(); onOpenAdmin(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[4.5, 3.6, 3.5]} />
          <meshStandardMaterial color="#D8D0C0" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.9, 0]}>
          <boxGeometry args={[5, 0.3, 4]} />
          <meshStandardMaterial color="#5A6A7A" flatShading roughness={1} />
        </mesh>
        {[-1.3, 0, 1.3].map((x, i) => (
          <mesh key={i} position={[x, 2.2, 1.8]}>
            <boxGeometry args={[0.9, 0.9, 0.1]} />
            <meshStandardMaterial color="#B8D8E8" flatShading roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 1.0, 1.8]}>
          <boxGeometry args={[1.4, 2.0, 0.12]} />
          <meshStandardMaterial color="#4A3A2A" flatShading roughness={1} />
        </mesh>
        <Label text="Bấm để mở hành chính" position={[0, 4.8, 0]} scale={0.65} />
      </group>
    </group>
  );
}
