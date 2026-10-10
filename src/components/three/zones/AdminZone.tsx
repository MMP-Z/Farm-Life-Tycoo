import React from 'react';
import { Label } from '../Label';

/* ---------- Hành chính 3D: văn phòng ---------- */

export interface AdminZoneProps {
  money: number;
  onOpenTax: () => void;
  onOpenLoan: () => void;
  onOpenInsurance: () => void;
}

export function AdminZone({ money, onOpenTax, onOpenLoan, onOpenInsurance }: AdminZoneProps) {
  const desks: Array<{ label: string; sub: string; color: string; onClick: () => void }> = [
    { label: 'Thuế', sub: 'Nộp thuế', color: '#8A4A4A', onClick: onOpenTax },
    { label: 'Vay vốn', sub: 'Vay / trả nợ', color: '#4A7A4A', onClick: onOpenLoan },
    { label: 'Bảo hiểm', sub: 'Mua bảo hiểm', color: '#4A7AC4', onClick: onOpenInsurance },
  ];

  return (
    <group>
      <Label text="Hành Chính" position={[0, 4.8, -3.5]} scale={1.1} />

      {/* Tòa văn phòng */}
      <group position={[0, 0, -4]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3.0, 3]} />
          <meshStandardMaterial color="#D8D0C0" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[4.5, 0.3, 3.5]} />
          <meshStandardMaterial color="#5A6A7A" flatShading roughness={1} />
        </mesh>
        {/* Cửa sổ */}
        {[-1.2, 0, 1.2].map((x, i) => (
          <mesh key={i} position={[x, 1.8, 1.55]}>
            <boxGeometry args={[0.8, 0.8, 0.1]} />
            <meshStandardMaterial color="#B8D8E8" flatShading roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0.9, 1.55]}>
          <boxGeometry args={[1.2, 1.8, 0.12]} />
          <meshStandardMaterial color="#4A3A2A" flatShading roughness={1} />
        </mesh>
      </group>

      {/* Bàn làm việc */}
      {desks.map((d, i) => {
        const x = (i - 1) * 2.4;
        return (
          <group
            key={d.label}
            position={[x, 0, 0.5]}
            onClick={(e) => { e.stopPropagation(); d.onClick(); }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[1.4, 0.1, 0.9]} />
              <meshStandardMaterial color={d.color} flatShading roughness={0.9} />
            </mesh>
            {[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].map(([lx, lz], j) => (
              <mesh key={j} position={[lx, 0.2, lz]}>
                <boxGeometry args={[0.08, 0.4, 0.08]} />
                <meshStandardMaterial color="#5A4A3A" flatShading roughness={1} />
              </mesh>
            ))}
            {/* Giấy tờ */}
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[0.5, 0.06, 0.35]} />
              <meshStandardMaterial color="#FFF" flatShading roughness={1} />
            </mesh>
            <Label text={d.label} position={[0, 1.4, 0]} scale={0.6} />
            <Label text={d.sub} position={[0, 1.0, 0]} scale={0.45} bg="rgba(255,255,255,0.92)" fg="#555" />
          </group>
        );
      })}
    </group>
  );
}
