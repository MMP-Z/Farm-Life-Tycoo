import React from 'react';
import { Label } from '../Label';

/* ---------- Kho 3D: nhà kho + nâng cấp ---------- */

export interface BarnZoneProps {
  totalItems: number;
  capacity: number;
  hasColdStorage: boolean;
  upgradeCost: number;
  coldStorageCost: number;
  money: number;
  onUpgradeCapacity: () => void;
  onBuildColdStorage: () => void;
}

export function BarnZone(props: BarnZoneProps) {
  const { totalItems, capacity, hasColdStorage, upgradeCost, coldStorageCost, money, onUpgradeCapacity, onBuildColdStorage } = props;
  const percent = Math.min(100, Math.floor((totalItems / Math.max(1, capacity)) * 100));

  // Thùng hàng xếp theo mức đầy
  const crates = Math.min(12, Math.ceil((totalItems / Math.max(1, capacity)) * 12));

  return (
    <group>
      <Label text="Nhà Kho" position={[0, 4.8, -3.5]} scale={1.1} />

      {/* Nhà kho */}
      <group position={[0, 0, -3.5]}>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[4, 2.0, 3]} />
          <meshStandardMaterial color="#B08A5A" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4.6, 0.25, 3.6]} />
          <meshStandardMaterial color="#7A5A3A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.7, 1.55]}>
          <boxGeometry args={[1.4, 1.4, 0.12]} />
          <meshStandardMaterial color="#4A3220" flatShading roughness={1} />
        </mesh>
        {hasColdStorage && (
          <mesh position={[1.6, 1.6, 1.55]}>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#4AA8E8" flatShading roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* Thùng hàng phía trước */}
      {Array.from({ length: crates }).map((_, i) => {
        const x = (i % 4 - 1.5) * 0.9;
        const z = 0.5 + Math.floor(i / 4) * 0.9;
        const y = 0.25 + (Math.floor(i / 8) % 2) * 0.55;
        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#C49A6C' : i % 3 === 1 ? '#A97A4A' : '#8A6238'} flatShading roughness={1} />
          </mesh>
        );
      })}

      <Label
        text={`${totalItems}/${capacity}`}
        position={[0, 3.2, -1.5]}
        scale={0.8}
        bg={percent > 85 ? 'rgba(180,40,40,0.92)' : 'rgba(46,74,53,0.92)'}
      />

      {/* Trạm nâng cấp */}
      <group position={[-3.2, 0, 1.5]}>
        <group
          onClick={(e) => { e.stopPropagation(); onUpgradeCapacity(); }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.0, 1.0, 0.8]} />
            <meshStandardMaterial color="#5A8A4A" flatShading roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.6, 0.4, 0.5]} />
            <meshStandardMaterial color="#3A6A3A" flatShading roughness={1} />
          </mesh>
          <Label text="Mở rộng +25" position={[0, 1.9, 0]} scale={0.55} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
          <Label text={`${upgradeCost}`} position={[0, 1.5, 0]} scale={0.45} bg={money >= upgradeCost ? 'rgba(0,0,0,0.55)' : 'rgba(120,120,120,0.7)'} fg="#FFD75E" />
        </group>
      </group>

      {!hasColdStorage && (
        <group position={[3.2, 0, 1.5]}>
          <group
            onClick={(e) => { e.stopPropagation(); onBuildColdStorage(); }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.0, 1.0, 0.8]} />
              <meshStandardMaterial color="#4AA8E8" flatShading roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <boxGeometry args={[0.7, 0.3, 0.6]} />
              <meshStandardMaterial color="#E8F4FF" flatShading roughness={0.6} />
            </mesh>
            <Label text="Kho Lạnh" position={[0, 1.9, 0]} scale={0.55} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
            <Label text={`${coldStorageCost}`} position={[0, 1.5, 0]} scale={0.45} bg={money >= coldStorageCost ? 'rgba(0,0,0,0.55)' : 'rgba(120,120,120,0.7)'} fg="#FFD75E" />
          </group>
        </group>
      )}
    </group>
  );
}
