import React from 'react';
import { Label } from '../Label';

/* ---------- Chợ 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface MarketZoneProps {
  onOpenMarket: () => void;
}

export function MarketZone({ onOpenMarket }: MarketZoneProps) {
  // Sạp trang trí (không bấm được)
  const stalls = [
    { x: -3, z: 0, color: '#C44A4A' },
    { x: 0, z: 0.5, color: '#4A7AC4' },
    { x: 3, z: 0, color: '#4AA84A' },
  ];

  return (
    <group>
      <Label text="Chợ Làng" position={[0, 5.2, -4]} scale={1.1} />

      {/* Nhà chợ chính — bấm để mở menu 2D */}
      <group
        position={[0, 0, -4.5]}
        onClick={(e) => { e.stopPropagation(); onOpenMarket(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[5, 2.4, 3.5]} />
          <meshStandardMaterial color="#D9C9A8" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[5.6, 0.3, 4]} />
          <meshStandardMaterial color="#8A5A3A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.9, 1.8]}>
          <boxGeometry args={[2, 1.8, 0.12]} />
          <meshStandardMaterial color="#5A3A22" flatShading roughness={1} />
        </mesh>
        <Label text="Bấm để mở chợ" position={[0, 3.8, 0]} scale={0.65} />
      </group>

      {/* Sạp trang trí */}
      {stalls.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} raycast={() => null}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.6, 0.12, 1.0]} />
            <meshStandardMaterial color="#A9744F" flatShading roughness={0.9} />
          </mesh>
          {[[-0.7, 0], [0.7, 0]].map(([px], j) => (
            <mesh key={j} position={[px, 1.0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 1.4, 6]} />
              <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
            </mesh>
          ))}
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[2.0, 0.08, 1.4]} />
            <meshStandardMaterial color={s.color} flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.2, 0.4, 0.7]} />
            <meshStandardMaterial color="#C49A6C" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
