import React from 'react';
import { FactoryBuilding } from '../../../types/farmSystem';
import { Label } from '../Label';

/* ---------- Xưởng 3D: nhà máy ---------- */

export interface WorkshopZoneProps {
  factories: Record<string, FactoryBuilding>;
  onSelectFactory: (f: FactoryBuilding | null) => void;
}

const FACTORY_COLORS: Record<string, string> = {
  mill: '#C4A44A',
  dairy: '#E8E0D0',
  bakery: '#D98A4A',
  default: '#A4A4A4',
};

export function WorkshopZone({ factories, onSelectFactory }: WorkshopZoneProps) {
  const list = Object.values(factories);
  const select = (f: FactoryBuilding) => (e: any) => {
    e.stopPropagation();
    onSelectFactory(f);
  };

  return (
    <group>
      <Label text="Xưởng Chế Biến" position={[0, 4.6, -3.5]} scale={1.1} />
      {list.map((f, i) => {
        const x = (i - (list.length - 1) / 2) * 2.8;
        const color = FACTORY_COLORS[f.id] || FACTORY_COLORS.default;
        const doneCount = f.activeTasks.filter((t) => t.completed).length;
        const workingCount = f.activeTasks.filter((t) => !t.completed).length;
        return (
          <group
            key={f.id}
            position={[x, 0, 0]}
            onClick={select(f)}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            {/* Nhà xưởng */}
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[2.2, 1.6, 1.8]} />
              <meshStandardMaterial
                color={f.unlocked ? color : '#888'}
                flatShading
                roughness={0.9}
              />
            </mesh>
            {/* Mái */}
            <mesh position={[0, 1.9, 0]}>
              <boxGeometry args={[2.5, 0.25, 2.1]} />
              <meshStandardMaterial color="#5A5A5A" flatShading roughness={1} />
            </mesh>
            {/* Ống khói */}
            <mesh position={[0.7, 2.4, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.9, 6]} />
              <meshStandardMaterial color="#7A7A7A" flatShading roughness={1} />
            </mesh>
            {/* Khói khi đang chạy */}
            {workingCount > 0 && (
              <mesh position={[0.7, 3.0, 0]}>
                <sphereGeometry args={[0.2, 6, 5]} />
                <meshStandardMaterial color="#DDD" flatShading transparent opacity={0.7} />
              </mesh>
            )}
            <Label
              text={f.unlocked ? f.name : `${f.name} (Khóa)`}
              position={[0, 2.9, 0]}
              scale={0.6}
              bg={f.unlocked ? undefined : 'rgba(90,90,90,0.92)'}
            />
            {f.unlocked && (doneCount > 0 || workingCount > 0) && (
              <Label
                text={doneCount > 0 ? `Xong ${doneCount}` : `Đang làm ${workingCount}`}
                position={[0, 2.45, 0]}
                scale={0.45}
                bg={doneCount > 0 ? 'rgba(46,122,53,0.92)' : 'rgba(0,0,0,0.55)'}
              />
            )}
            {!f.unlocked && (
              <Label text={`${f.cost}`} position={[0, 2.45, 0]} scale={0.45} bg="rgba(0,0,0,0.55)" fg="#FFD75E" />
            )}
          </group>
        );
      })}
    </group>
  );
}
