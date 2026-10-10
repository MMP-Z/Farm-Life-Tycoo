import React from 'react';
import * as THREE from 'three';
import { CROPS_CONFIG, ANIMALS_CONFIG } from '../../../config/farmData';
import { Label } from '../Label';

/* ---------- Cửa hàng 3D ---------- */

export interface ShopProduct {
  kind: 'seed' | 'supply' | 'animal' | 'automation';
  id: string;
  name: string;
  price: number;
  desc: string;
}

export interface ShopZoneProps {
  money: number;
  emptyPlotsCount: number;
  hasAutoIrrigation: boolean;
  autoWorkersCount: number;
  autoIrrigationCost: number;
  autoWorkerCost: number;
  onSelectProduct: (p: ShopProduct | null) => void;
}

const SEED_BAG_COLORS: Record<string, string> = {
  wheat: '#E8C547', carrot: '#E8823C', tomato: '#E15A5A',
  corn: '#F2D06B', pumpkin: '#E8912D', strawberry: '#E84A6F',
};

/** Quầy hàng gỗ */
function Stand({ position, children, onClick }: {
  position: [number, number, number];
  children: React.ReactNode;
  onClick: (e: any) => void;
}) {
  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Mặt quầy */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.1, 0.12, 0.8]} />
        <meshStandardMaterial color="#A9744F" flatShading roughness={0.9} />
      </mesh>
      {/* Chân quầy */}
      {[[-0.45, -0.3], [0.45, -0.3], [-0.45, 0.3], [0.45, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
        </mesh>
      ))}
      {children}
    </group>
  );
}

export function ShopZone(props: ShopZoneProps) {
  const { money, emptyPlotsCount, hasAutoIrrigation, autoWorkersCount } = props;
  const crops = Object.values(CROPS_CONFIG);
  const animals = Object.values(ANIMALS_CONFIG);
  const supplies: ShopProduct[] = [
    { kind: 'supply', id: 'fertilizer', name: 'Phân Bón', price: 8, desc: 'Tăng 25% độ phì' },
    { kind: 'supply', id: 'pesticide', name: 'Thuốc Trừ Sâu', price: 12, desc: 'Diệt sâu bệnh' },
    { kind: 'supply', id: 'vet_medicine', name: 'Thuốc Thú Y', price: 25, desc: 'Chữa vật nuôi ốm' },
  ];

  const select = (p: ShopProduct) => (e: any) => {
    e.stopPropagation();
    props.onSelectProduct(p);
  };

  return (
    <group>
      <Label text="Cửa Hàng" position={[0, 4.6, -3.5]} scale={1.1} />

      {/* Nhà cửa hàng (trang trí) */}
      <group position={[0, 0, -4.5]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[3, 1.6, 2.2]} />
          <meshStandardMaterial color="#D9B382" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <coneGeometry args={[2.4, 1.0, 4]} />
          <meshStandardMaterial color="#B5433A" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.6, 1.15]}>
          <boxGeometry args={[0.9, 1.2, 0.1]} />
          <meshStandardMaterial color="#5A3A22" flatShading roughness={1} />
        </mesh>
      </group>

      {/* Khu hạt giống */}
      <Label text="Hạt Giống" position={[-3.5, 2.2, 1.5]} scale={0.8} />
      {crops.map((crop, i) => {
        const x = -5.2 + (i % 3) * 1.7;
        const z = 1.5 + Math.floor(i / 3) * 1.6;
        const p: ShopProduct = {
          kind: 'seed', id: `${crop.id}_seed`, name: `Giống ${crop.name}`,
          price: crop.seedPrice, desc: `${crop.growDays} ngày thu hoạch`,
        };
        return (
          <Stand key={crop.id} position={[x, 0, z]} onClick={select(p)}>
            <mesh position={[0, 0.75, 0]} scale={[1, 0.85, 1]}>
              <sphereGeometry args={[0.3, 8, 6]} />
              <meshStandardMaterial color={SEED_BAG_COLORS[crop.id] || '#D9C9A8'} flatShading roughness={0.95} />
            </mesh>
            <Label text={`${crop.name}`} position={[0, 1.45, 0]} scale={0.5} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
            <Label text={`${crop.seedPrice}`} position={[0, 1.05, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
          </Stand>
        );
      })}

      {/* Khu vật tư */}
      <Label text="Vật Tư" position={[3.5, 2.2, 1.5]} scale={0.8} />
      {supplies.map((s, i) => {
        const x = 2.6 + i * 1.7;
        return (
          <Stand key={s.id} position={[x, 0, 1.5]} onClick={select(s)}>
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color={i === 0 ? '#8A6F3C' : i === 1 ? '#4A7A4F' : '#C44A4A'} flatShading roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[0.54, 0.08, 0.54]} />
              <meshStandardMaterial color="#5A4A30" flatShading roughness={1} />
            </mesh>
            <Label text={s.name} position={[0, 1.6, 0]} scale={0.5} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
            <Label text={`${s.price}`} position={[0, 1.2, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
          </Stand>
        );
      })}

      {/* Khu con giống */}
      <Label text="Con Giống" position={[0, 2.2, 4.2]} scale={0.8} />
      {animals.map((def, i) => {
        const x = -2.55 + i * 1.7;
        const p: ShopProduct = {
          kind: 'animal', id: def.id, name: def.name,
          price: def.buyPrice, desc: `${def.produceDays} ngày cho thu`,
        };
        const color = def.id === 'chicken' ? '#F5F2EA' : def.id === 'duck' ? '#E8D44A' : def.id === 'cow' ? '#8A6F5C' : '#E89A9A';
        return (
          <group
            key={def.id}
            position={[x, 0, 4.2]}
            onClick={select(p)}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            {/* Chuồng mini */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[1.2, 0.3, 1.0]} />
              <meshStandardMaterial color="#C49A6C" flatShading roughness={1} />
            </mesh>
            {/* Con vật mẫu */}
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.28, 8, 6]} />
              <meshStandardMaterial color={color} flatShading roughness={0.9} />
            </mesh>
            <mesh position={[0.18, 0.72, 0.1]}>
              <sphereGeometry args={[0.16, 7, 6]} />
              <meshStandardMaterial color={color} flatShading roughness={0.9} />
            </mesh>
            <Label text={def.name} position={[0, 1.35, 0]} scale={0.5} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
            <Label text={`${def.buyPrice}`} position={[0, 0.95, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
          </group>
        );
      })}

      {/* Khu tự động hóa */}
      {!hasAutoIrrigation && (
        <group
          position={[-4.5, 0, -1.5]}
          onClick={select({ kind: 'automation', id: 'auto_irrigation', name: 'Tưới Tự Động', price: props.autoIrrigationCost, desc: 'Tự tưới mỗi ngày' })}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 1.2, 8]} />
            <meshStandardMaterial color="#4AA8E8" flatShading roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <sphereGeometry args={[0.25, 8, 6]} />
            <meshStandardMaterial color="#2E6FA5" flatShading roughness={0.8} />
          </mesh>
          <Label text="Tưới Tự Động" position={[0, 2.0, 0]} scale={0.55} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
          <Label text={`${props.autoIrrigationCost}`} position={[0, 1.6, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
        </group>
      )}
      <group
        position={[4.5, 0, -1.5]}
        onClick={select({ kind: 'automation', id: 'auto_worker', name: 'Thuê Công Nhân', price: props.autoWorkerCost, desc: `Đang có ${autoWorkersCount}` })}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.5, 1.0, 0.4]} />
          <meshStandardMaterial color="#5A8A4A" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.22, 8, 6]} />
          <meshStandardMaterial color="#E8B88A" flatShading roughness={0.9} />
        </mesh>
        <Label text="Thuê Công Nhân" position={[0, 1.9, 0]} scale={0.55} bg="rgba(255,255,255,0.92)" fg="#2E4A35" />
        <Label text={`${props.autoWorkerCost}`} position={[0, 1.5, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
      </group>
    </group>
  );
}
