import React from 'react';
import { ALL_ITEMS_CATALOG } from '../../../config/farmData';
import { Label } from '../Label';

/* ---------- Chợ 3D: sạp bán nông sản ---------- */

export interface MarketStall {
  itemId: string;
  name: string;
  price: number;
  stock: number;
  demand: number;
}

export interface MarketZoneProps {
  stalls: MarketStall[];
  onSelectStall: (s: MarketStall | null) => void;
}

const STALL_COLORS = ['#C44A4A', '#4A7AC4', '#4AA84A', '#C4A44A', '#8A4AC4', '#4AC4B4'];

/** Sạp chợ: bàn + mái che + thùng hàng */
function Stall({ stall, position, colorIdx, onClick }: {
  stall: MarketStall;
  position: [number, number, number];
  colorIdx: number;
  onClick: (e: any) => void;
}) {
  const color = STALL_COLORS[colorIdx % STALL_COLORS.length];
  const demandLabel = stall.demand >= 0.95 ? 'Cầu cao' : stall.demand < 0.75 ? 'Bão hòa' : '';
  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Bàn */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.3, 0.12, 0.9]} />
        <meshStandardMaterial color="#A9744F" flatShading roughness={0.9} />
      </mesh>
      {[[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
        </mesh>
      ))}
      {/* Mái che */}
      {[[-0.65, 0], [0.65, 0]].map(([x], i) => (
        <mesh key={`p${i}`} position={[x, 1.1, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 6]} />
          <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 1.75, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.7, 0.08, 1.2]} />
        <meshStandardMaterial color={color} flatShading roughness={0.9} />
      </mesh>
      {/* Thùng hàng trên bàn */}
      <mesh position={[-0.3, 0.68, 0]}>
        <boxGeometry args={[0.45, 0.35, 0.45]} />
        <meshStandardMaterial color="#C49A6C" flatShading roughness={1} />
      </mesh>
      <mesh position={[0.3, 0.68, 0]}>
        <boxGeometry args={[0.45, 0.35, 0.45]} />
        <meshStandardMaterial color="#C49A6C" flatShading roughness={1} />
      </mesh>
      {/* Sản phẩm mẫu */}
      <mesh position={[-0.3, 0.95, 0]}>
        <sphereGeometry args={[0.18, 7, 6]} />
        <meshStandardMaterial color="#7AC44A" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.95, 0]}>
        <sphereGeometry args={[0.18, 7, 6]} />
        <meshStandardMaterial color="#E8A44A" flatShading roughness={0.9} />
      </mesh>
      <Label text={`${stall.name} x${stall.stock}`} position={[0, 2.25, 0]} scale={0.55} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
      <Label text={`${stall.price}${demandLabel ? ` · ${demandLabel}` : ''}`} position={[0, 1.95, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
    </group>
  );
}

export function MarketZone({ stalls, onSelectStall }: MarketZoneProps) {
  const select = (s: MarketStall) => (e: any) => {
    e.stopPropagation();
    onSelectStall(s);
  };

  // Xếp sạp thành lưới 4 cột
  const cols = 4;
  return (
    <group>
      <Label text="Chợ Làng" position={[0, 4.6, -3.5]} scale={1.1} />
      {stalls.length === 0 && (
        <Label text="Kho trống — chưa có hàng để bán" position={[0, 2, 0]} scale={0.9} />
      )}
      {stalls.slice(0, 12).map((s, i) => {
        const x = (i % cols - (cols - 1) / 2) * 2.2;
        const z = Math.floor(i / cols) * 2.6 - 1;
        return (
          <Stall key={s.itemId} stall={s} position={[x, 0, z]} colorIdx={i} onClick={select(s)} />
        );
      })}
    </group>
  );
}
