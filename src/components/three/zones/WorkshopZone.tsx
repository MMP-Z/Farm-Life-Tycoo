import React from 'react';
import { Label } from '../Label';

/* ---------- Xưởng 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface WorkshopZoneProps {
  onOpenWorkshop: () => void;
}

export function WorkshopZone({ onOpenWorkshop }: WorkshopZoneProps) {
  return (
    <group>
      <Label text="Xưởng Chế Biến" position={[0, 5.2, -4]} scale={1.1} />
      <group
        position={[0, 0, -4]}
        onClick={(e) => { e.stopPropagation(); onOpenWorkshop(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[4.5, 2.0, 3]} />
          <meshStandardMaterial color="#C4A44A" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <boxGeometry args={[5, 0.3, 3.5]} />
          <meshStandardMaterial color="#5A5A5A" flatShading roughness={1} />
        </mesh>
        <mesh position={[1.5, 3.0, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.2, 6]} />
          <meshStandardMaterial color="#7A7A7A" flatShading roughness={1} />
        </mesh>
        <mesh position={[-1.5, 3.0, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.2, 6]} />
          <meshStandardMaterial color="#7A7A7A" flatShading roughness={1} />
        </mesh>
        <Label text="Bấm để mở xưởng" position={[0, 4.0, 0]} scale={0.65} />
      </group>
    </group>
  );
}
