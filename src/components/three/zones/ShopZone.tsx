import React from 'react';
import { Label } from '../Label';

/* ---------- Cửa hàng 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface ShopZoneProps {
  onOpenShop: () => void;
}

export function ShopZone({ onOpenShop }: ShopZoneProps) {
  return (
    <group>
      <Label text="Cửa Hàng" position={[0, 5.2, -4]} scale={1.1} />

      {/* Nhà cửa hàng chính — bấm để mở menu 2D */}
      <group
        position={[0, 0, -4]}
        onClick={(e) => { e.stopPropagation(); onOpenShop(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[4, 2.0, 3]} />
          <meshStandardMaterial color="#D9B382" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[3.2, 1.4, 4]} />
          <meshStandardMaterial color="#B5433A" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.7, 1.55]}>
          <boxGeometry args={[1.2, 1.4, 0.12]} />
          <meshStandardMaterial color="#5A3A22" flatShading roughness={1} />
        </mesh>
        {/* Biển hiệu */}
        <mesh position={[0, 1.8, 1.58]}>
          <boxGeometry args={[2.2, 0.5, 0.08]} />
          <meshStandardMaterial color="#2E4A35" flatShading roughness={0.9} />
        </mesh>
        <Label text="Bấm để mở cửa hàng" position={[0, 3.4, 0]} scale={0.65} />
      </group>

      {/* Trang trí: cây + đèn */}
      {[[-3.5, -1], [3.5, -1], [-3.5, -6], [3.5, -6]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 1.0, 6]} />
            <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <coneGeometry args={[0.8, 1.4, 7]} />
            <meshStandardMaterial color="#3A7A3A" flatShading roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
