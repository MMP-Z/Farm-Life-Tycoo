import React from 'react';
import { VEHICLES_CONFIG } from '../../../config/farmData';
import { TransportTrip } from '../../../types/farmSystem';
import { Label } from '../Label';

/* ---------- Vận tải 3D: bãi xe ---------- */

export interface TransportZoneProps {
  ownedVehicles: string[];
  activeTrips: TransportTrip[];
  money: number;
  onSelectVehicle: (id: string | null) => void;
}

export function TransportZone({ ownedVehicles, activeTrips, money, onSelectVehicle }: TransportZoneProps) {
  const vehicles = Object.values(VEHICLES_CONFIG);
  const select = (id: string) => (e: any) => {
    e.stopPropagation();
    onSelectVehicle(id);
  };

  return (
    <group>
      <Label text="Vận Tải" position={[0, 4.6, -3.5]} scale={1.1} />

      {/* Nhà để xe */}
      <group position={[0, 0, -4]}>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[5, 2.0, 3]} />
          <meshStandardMaterial color="#8A7A5A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[5.5, 0.3, 3.5]} />
          <meshStandardMaterial color="#5A4A3A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.8, 1.55]}>
          <boxGeometry args={[3.5, 1.6, 0.1]} />
          <meshStandardMaterial color="#3A2E22" flatShading roughness={1} />
        </mesh>
      </group>

      {/* Xe */}
      {vehicles.map((v, i) => {
        const owned = ownedVehicles.includes(v.id);
        const x = (i - (vehicles.length - 1) / 2) * 2.4;
        const onTrip = activeTrips.some((t) => t.vehicleId === v.id);
        return (
          <group
            key={v.id}
            position={[x, 0, 0.5]}
            onClick={select(v.id)}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            {/* Thân xe */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[1.4, 0.5, 0.8]} />
              <meshStandardMaterial color={owned ? '#4A7AC4' : '#999'} flatShading roughness={0.8} />
            </mesh>
            {/* Cabin */}
            <mesh position={[-0.4, 0.85, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.7]} />
              <meshStandardMaterial color={owned ? '#2E5A94' : '#777'} flatShading roughness={0.8} />
            </mesh>
            {/* Bánh */}
            {[[-0.45, 0.35], [0.45, 0.35], [-0.45, -0.35], [0.45, -0.35]].map(([wx, wz], j) => (
              <mesh key={j} position={[wx, 0.22, wz]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.12, 8]} />
                <meshStandardMaterial color="#333" flatShading roughness={1} />
              </mesh>
            ))}
            <Label
              text={owned ? v.name : `${v.name} (Chưa có)`}
              position={[0, 1.6, 0]}
              scale={0.55}
              bg={owned ? undefined : 'rgba(90,90,90,0.92)'}
            />
            {!owned && (
              <Label text={`${v.buyPrice}`} position={[0, 1.2, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
            )}
            {onTrip && (
              <Label text="Đang chạy" position={[0, 2.0, 0]} scale={0.45} bg="rgba(200,120,20,0.92)" />
            )}
          </group>
        );
      })}
    </group>
  );
}
