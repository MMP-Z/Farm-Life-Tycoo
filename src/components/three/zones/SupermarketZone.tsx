import React from 'react';
import { Label } from '../Label';

/* ---------- Siêu thị 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface SupermarketZoneProps {
  onOpenSupermarket: () => void;
}

export function SupermarketZone({ onOpenSupermarket }: SupermarketZoneProps) {
  return (
    <group>
      <Label text="Siêu Thị" position={[0, 5.2, -4]} scale={1.1} />
      <group
        position={[0, 0, -4]}
        onClick={(e) => { e.stopPropagation(); onOpenSupermarket(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[5.5, 2.8, 3.5]} />
          <meshStandardMaterial color="#E8E0D0" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[6, 0.3, 4]} />
          <meshStandardMaterial color="#2E6FA5" flatShading roughness={0.8} />
        </mesh>
        {[-1.5, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 1.0, 1.8]}>
            <boxGeometry args={[1.4, 2.0, 0.1]} />
            <meshStandardMaterial color="#B8D8E8" flatShading roughness={0.4} />
          </mesh>
        ))}
        <Label text="Bấm để mở siêu thị" position={[0, 4.2, 0]} scale={0.65} />
      </group>
    </group>
  );
}
