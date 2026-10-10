import React from 'react';
import { Label } from '../Label';

/* ---------- Vận tải 3D: môi trường + nhà chính (menu 2D) ---------- */

export interface TransportZoneProps {
  onOpenTransport: () => void;
}

export function TransportZone({ onOpenTransport }: TransportZoneProps) {
  return (
    <group>
      <Label text="Vận Tải" position={[0, 5.2, -4]} scale={1.1} />
      <group
        position={[0, 0, -4]}
        onClick={(e) => { e.stopPropagation(); onOpenTransport(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[6, 2.4, 3.5]} />
          <meshStandardMaterial color="#8A7A5A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[6.5, 0.3, 4]} />
          <meshStandardMaterial color="#5A4A3A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 1.0, 1.8]}>
          <boxGeometry args={[4, 2.0, 0.12]} />
          <meshStandardMaterial color="#3A2E22" flatShading roughness={1} />
        </mesh>
        <Label text="Bấm để mở vận tải" position={[0, 3.8, 0]} scale={0.65} />
      </group>
      {/* Xe trang trí */}
      {[-3.5, 3.5].map((x, i) => (
        <group key={i} position={[x, 0, 1]} raycast={() => null}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.6, 0.5, 0.9]} />
            <meshStandardMaterial color="#4A7AC4" flatShading roughness={0.8} />
          </mesh>
          {[[-0.5, 0.35], [0.5, 0.35], [-0.5, -0.35], [0.5, -0.35]].map(([wx, wz], j) => (
            <mesh key={j} position={[wx, 0.22, wz]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.12, 8]} />
              <meshStandardMaterial color="#333" flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
