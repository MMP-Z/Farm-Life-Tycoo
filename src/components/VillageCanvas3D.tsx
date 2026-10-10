import React, { useRef, useState } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { GameTab } from './NavigationTabs';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import {
  Lights, Island, Sea, VoxelClouds, FpsProbe, webglAvailable,
  CanvasShell, stdCanvasProps,
} from './three/decor';

/**
 * Phase 4 — Làng 3D: 9 tòa nhà low-poly (mỗi khu vực một nhà),
 * bấm để mở khu vực / mở khóa. Logic game giữ nguyên (tái dùng handler 2D).
 */

export interface RegionInfo {
  id: GameTab;
  label: string;
  desc: string;
  cost: number;
  wall: string;
  roof: string;
}

interface Props {
  regions: RegionInfo[];
  unlockedRegions: string[];
  money: number;
  onSelectTab: (tab: GameTab) => void;
  onUnlockRegion: (regionId: string, cost: number) => void;
}

const GAP = 2.75;

/* ---------- Một tòa nhà ---------- */

function Building({
  region, locked, selected, onSelect,
}: {
  region: RegionInfo;
  locked: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const wall = locked ? '#B5B0A6' : region.wall;
  const roof = locked ? '#8E8A82' : region.roof;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Thân nhà */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.6, 1.1, 1.4]} />
        <meshStandardMaterial color={wall} flatShading roughness={1} />
      </mesh>
      {/* Mái */}
      <mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.32, 0.75, 4]} />
        <meshStandardMaterial color={roof} flatShading roughness={1} />
      </mesh>
      {/* Cửa */}
      <mesh position={[0, 0.32, 0.71]}>
        <boxGeometry args={[0.42, 0.64, 0.06]} />
        <meshStandardMaterial color={locked ? '#4A4640' : '#5A3D26'} flatShading roughness={1} />
      </mesh>
      {/* Cửa sổ */}
      <mesh position={[-0.5, 0.68, 0.71]}>
        <boxGeometry args={[0.3, 0.3, 0.06]} />
        <meshStandardMaterial color={locked ? '#6A655C' : '#BFE3F2'} flatShading roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.68, 0.71]}>
        <boxGeometry args={[0.3, 0.3, 0.06]} />
        <meshStandardMaterial color={locked ? '#6A655C' : '#BFE3F2'} flatShading roughness={0.6} />
      </mesh>
      {/* Ống khói */}
      <mesh position={[0.45, 1.7, -0.25]}>
        <boxGeometry args={[0.22, 0.55, 0.22]} />
        <meshStandardMaterial color={locked ? '#8E8A82' : '#A89880'} flatShading roughness={1} />
      </mesh>
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} raycast={() => null}>
          <ringGeometry args={[1.15, 1.32, 24]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Trang trí làng ---------- */

function VillageDecor() {
  const trees: Array<[number, number]> = [
    [-4.6, -4.2], [4.6, -4.2], [-4.6, 4.2], [4.6, 4.2], [0, -4.6], [-4.8, 0.4],
  ];
  return (
    <group>
      {/* Quảng trường trung tâm */}
      <mesh position={[0, 0.015, 0]} raycast={() => null}>
        <cylinderGeometry args={[1.1, 1.1, 0.05, 20]} />
        <meshStandardMaterial color="#D9CFAE" flatShading roughness={1} />
      </mesh>
      {/* Giếng trung tâm */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.5, 8]} />
          <meshStandardMaterial color="#A89880" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 8]} />
          <meshStandardMaterial color="#7A6A5A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.55, 0.35, 4]} />
          <meshStandardMaterial color="#E2725B" flatShading roughness={1} />
        </mesh>
        {[[-0.3], [0.3]].map(([x], i) => (
          <mesh key={i} position={[x, 0.65, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial color="#8A5A33" flatShading roughness={1} />
          </mesh>
        ))}
      </group>
      {/* Cây */}
      {trees.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 0.7, 6]} />
            <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <coneGeometry args={[0.55, 0.9, 7]} />
            <meshStandardMaterial color="#3E8E41" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <coneGeometry args={[0.38, 0.65, 7]} />
            <meshStandardMaterial color="#4DA34F" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Scene ---------- */

function VillageScene({
  regions, unlockedRegions, selectedId, onSelect, onFps,
}: {
  regions: RegionInfo[];
  unlockedRegions: string[];
  selectedId: GameTab | null;
  onSelect: (id: GameTab | null) => void;
  onFps: (fps: number) => void;
}) {
  return (
    <>
      <Lights />
      <Island radius={6.6} />
      <Sea />
      <VoxelClouds />
      <VillageDecor />
      {regions.map((region, i) => {
        const col = (i % 3) - 1;
        const row = Math.floor(i / 3) - 1;
        return (
          <group key={region.id} position={[col * GAP, 0, row * GAP]}>
            <Building
              region={region}
              locked={!unlockedRegions.includes(region.id)}
              selected={selectedId === region.id}
              onSelect={() => onSelect(region.id)}
            />
          </group>
        );
      })}
      <FpsProbe onFps={onFps} />
    </>
  );
}

/* ---------- Wrapper ---------- */

export const VillageCanvas3D: React.FC<Props> = (props) => {
  const { regions, unlockedRegions, money, onSelectTab, onUnlockRegion } = props;
  const [fps, setFps] = useState(0);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<GameTab | null>(null);

  const selected = regions.find((r) => r.id === selectedId) || null;
  const isLocked = selected ? !unlockedRegions.includes(selected.id) : false;
  const canAfford = selected ? money >= selected.cost : false;

  if (!webglAvailable() || failed) {
    return (
      <div className="rounded-md border-[3px] border-[#3a2b3f] bg-amber-50 p-4 text-center text-sm font-bold text-amber-900">
        Thiết bị không hỗ trợ WebGL — đang dùng giao diện 2D.
      </div>
    );
  }

  return (
    <div>
      <CanvasShell
        fps={fps}
        label="Làng 3D thử nghiệm"
        hint="Chạm vào tòa nhà để mở khu vực. Nhà xám là chưa mở khóa."
      >
        <Canvas
          {...stdCanvasProps}
          camera={{ position: [10, 9, 10] as [number, number, number], zoom: 30, near: 0.1, far: 120 }}
          onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
          onError={() => setFailed(true)}
        >
          <VillageScene
            regions={regions}
            unlockedRegions={unlockedRegions}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
            onFps={setFps}
          />
        </Canvas>
      </CanvasShell>

      {selected && (
        <div className="mt-2 rounded-xl border-[3px] border-[#3a2b3f] bg-white p-3 shadow-[4px_4px_0_#3a2b3f]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">
                {selected.label} {isLocked && <span className="text-xs text-slate-400">(chưa mở khóa)</span>}
              </p>
              <p className="text-[11px] text-slate-500">{selected.desc}</p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500"
            >
              Đóng
            </button>
          </div>
          <div className="mt-2">
            {!isLocked ? (
              <button
                onClick={() => onSelectTab(selected.id)}
                className="w-full rounded-lg bg-[#2E4A35] py-2 text-xs font-bold text-white"
              >
                Mở {selected.label}
              </button>
            ) : canAfford ? (
              <button
                onClick={() => { onUnlockRegion(selected.id, selected.cost); setSelectedId(null); }}
                className="flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white"
              >
                Mở khóa: <CoinIcon /> {formatMoney(selected.cost)}
              </button>
            ) : (
              <p className="py-2 text-center text-xs font-bold text-rose-600">
                Cần <CoinIcon /> {formatMoney(selected.cost)} để mở khóa
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageCanvas3D;
