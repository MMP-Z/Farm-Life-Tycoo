import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FieldPlot, Season, AnimalPen } from '../types/farmSystem';
import { CROPS_CONFIG } from '../config/farmData';
import { ANIMALS_CONFIG } from '../config/farmData';
import { GameTab } from './NavigationTabs';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import { CROP_SPRITES } from '../utils/sprites';
import { SpriteIcon } from './SpriteIcon';
import {
  Lights, Island, Sea, VoxelClouds, FpsProbe, webglAvailable,
  CanvasShell, stdCanvasProps,
} from './three/decor';
import { FieldZone } from './three/zones/FieldZone';
import { PastureZone } from './three/zones/PastureZone';
import { VillageZone, RegionInfo } from './three/zones/VillageZone';

/**
 * Phase 5 — Thế giới 3D thống nhất: MỘT đảo duy nhất gồm 3 khu
 * (cánh đồng / chuồng trại / làng), camera bay mượt giữa các khu.
 * Mọi tương tác thế giới làm trực tiếp trong 3D. Logic game giữ nguyên.
 */

export type WorldZone = 'overview' | 'field' | 'pasture' | 'village';

export interface WorldData {
  plots: FieldPlot[];
  currentDay: number;
  timeOfDay: number;
  currentSeason: Season;
  isHardworking: boolean;
  newPlayerBoost: boolean;
  inventory: { itemId: string; quantity: number }[];
  pen: AnimalPen;
  regions: RegionInfo[];
  unlockedRegions: string[];
  money: number;
  onPlowPlot: (plotId: number) => void;
  onPlantCrop: (plotId: number, cropId: string) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onCurePestPlot: (plotId: number) => void;
  onFeedPen: () => void;
  onFillWaterTrough: () => void;
  onCureAnimal: (animalId: string) => void;
  onSellAnimal: (animalId: string) => void;
  onSelectTab: (tab: GameTab) => void;
  onUnlockRegion: (regionId: string, cost: number) => void;
}

/* Vị trí các khu trên đảo */
const FIELD_POS: [number, number] = [-5.6, -0.5];
const PASTURE_POS: [number, number] = [5.4, -1.2];
const VILLAGE_POS: [number, number] = [0.4, 5.6];

interface CamPreset { pos: [number, number, number]; look: [number, number, number]; zoom: number; }

const PRESETS: Record<WorldZone, CamPreset> = {
  overview: { pos: [15, 14, 16], look: [0, 0, 1.2], zoom: 21 },
  field: { pos: [FIELD_POS[0] + 9, 8, FIELD_POS[1] + 9], look: [FIELD_POS[0], 0, FIELD_POS[1]], zoom: 33 },
  pasture: { pos: [PASTURE_POS[0] + 9, 8, PASTURE_POS[1] + 9], look: [PASTURE_POS[0], 0, PASTURE_POS[1]], zoom: 33 },
  village: { pos: [VILLAGE_POS[0] + 9, 8, VILLAGE_POS[1] + 9], look: [VILLAGE_POS[0], 0, VILLAGE_POS[1]], zoom: 30 },
};

/** Camera bay mượt tới khu được chọn */
function CameraRig({ zone }: { zone: WorldZone }) {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const look = useRef(new THREE.Vector3(...PRESETS[zone].look));
  const first = useRef(true);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = PRESETS[zone];
    if (first.current) {
      camera.position.set(...p.pos);
      look.current.set(...p.look);
      camera.zoom = p.zoom;
      camera.updateProjectionMatrix();
      camera.lookAt(look.current);
      first.current = false;
      return;
    }
    const k = 1 - Math.exp(-3.2 * dt);
    camera.position.lerp(new THREE.Vector3(...p.pos), k);
    look.current.lerp(new THREE.Vector3(...p.look), k);
    camera.lookAt(look.current);
    camera.zoom += (p.zoom - camera.zoom) * k;
    camera.updateProjectionMatrix();
  });
  return null;
}

/** Cây trang trí rải quanh đảo lớn */
function WorldDecor() {
  const trees: Array<[number, number, number]> = [
    [-9.5, -3.5, 1], [9.5, -4.5, 1.2], [-8, 6.5, 0.9], [8.5, 6.8, 1.1],
    [-3, -8.5, 1], [4, -8.8, 0.85], [-10, 1.5, 0.9], [10.2, 2.5, 1],
  ];
  return (
    <group>
      {trees.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 0.7, 6]} />
            <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <coneGeometry args={[0.55, 0.9, 7]} />
            <meshStandardMaterial color="#3E8E41" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <coneGeometry args={[0.38, 0.65, 7]} />
            <meshStandardMaterial color="#4DA34F" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
      {/* Nhà chính của nông trại */}
      <group position={[-0.5, 0, -6.8]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.9, 1.3]} />
          <meshStandardMaterial color="#F2E3C2" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.35, 0.7, 4]} />
          <meshStandardMaterial color="#3E8E41" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.35, 0.66]}>
          <boxGeometry args={[0.44, 0.7, 0.06]} />
          <meshStandardMaterial color="#5A3D26" flatShading roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- World ---------- */

export const FarmWorld3D: React.FC<{ data: WorldData; initialZone: WorldZone }> = ({ data, initialZone }) => {
  const [fps, setFps] = useState(0);
  const [failed, setFailed] = useState(false);
  const [zone, setZone] = useState<WorldZone>(initialZone);
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<GameTab | null>(null);

  const selectedAnimal = data.pen.animals.find((a) => a.id === selectedAnimalId) || null;
  const selectedAnimalDef = selectedAnimal ? ANIMALS_CONFIG[selectedAnimal.type] : null;
  const animalReady = selectedAnimal
    ? selectedAnimal.daysUntilProduce <= 0 && !selectedAnimal.isSick && selectedAnimal.hunger > 20
    : false;

  const selectedRegion = data.regions.find((r) => r.id === selectedRegionId) || null;
  const regionLocked = selectedRegion ? !data.unlockedRegions.includes(selectedRegion.id) : false;
  const regionAffordable = selectedRegion ? data.money >= selectedRegion.cost : false;

  const zoneTabs: Array<{ id: WorldZone; label: string }> = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'field', label: 'Cánh đồng' },
    { id: 'pasture', label: 'Chuồng trại' },
    { id: 'village', label: 'Làng' },
  ];

  if (!webglAvailable() || failed) {
    return (
      <div className="rounded-md border-[3px] border-[#3a2b3f] bg-amber-50 p-4 text-center text-sm font-bold text-amber-900">
        Thiết bị không hỗ trợ WebGL — đang dùng giao diện 2D.
      </div>
    );
  }

  const init = PRESETS[initialZone];

  return (
    <div>
      <CanvasShell fps={fps} label="Thế giới 3D">
        <Canvas
          {...stdCanvasProps}
          camera={{ position: init.pos, zoom: init.zoom, near: 0.1, far: 160 }}
          onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
          onError={() => setFailed(true)}
        >
          <Lights />
          <Island radius={11.5} />
          <Sea />
          <VoxelClouds />
          <WorldDecor />
          <CameraRig zone={zone} />
          <group position={[FIELD_POS[0], 0, FIELD_POS[1]]}>
            <FieldZone
              plots={data.plots}
              selectedCropId={selectedCropId}
              currentDay={data.currentDay}
              timeOfDay={data.timeOfDay}
              currentSeason={data.currentSeason}
              isHardworking={data.isHardworking}
              newPlayerBoost={data.newPlayerBoost}
              onPlowPlot={data.onPlowPlot}
              onPlantCrop={data.onPlantCrop}
              onHarvestPlot={data.onHarvestPlot}
              onCurePestPlot={data.onCurePestPlot}
            />
          </group>
          <group position={[PASTURE_POS[0], 0, PASTURE_POS[1]]}>
            <PastureZone
              pen={data.pen}
              selectedId={selectedAnimalId}
              onSelect={(id) => setSelectedAnimalId((cur) => (cur === id ? null : id))}
              onFeedPen={data.onFeedPen}
              onFillWaterTrough={data.onFillWaterTrough}
            />
          </group>
          <group position={[VILLAGE_POS[0], 0, VILLAGE_POS[1]]}>
            <VillageZone
              regions={data.regions}
              unlockedRegions={data.unlockedRegions}
              selectedId={selectedRegionId}
              onSelect={(id) => setSelectedRegionId((cur) => (cur === id ? null : id))}
            />
          </group>
          <FpsProbe onFps={setFps} />
        </Canvas>
      </CanvasShell>

      {/* Thanh di chuyển giữa các khu */}
      <div className="mt-2 flex gap-1.5 overflow-x-auto">
        {zoneTabs.map((z) => (
          <button
            key={z.id}
            onClick={() => setZone(z.id)}
            className={`shrink-0 rounded-full border-2 border-[#3a2b3f] px-3 py-1.5 text-xs font-bold ${
              zone === z.id ? 'bg-[#2E4A35] text-white' : 'bg-white text-slate-600'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Chọn hạt giống (khi đang ở khu cánh đồng) */}
      {zone === 'field' && (
        <div className="mt-2 rounded-xl border-[3px] border-[#3a2b3f] bg-white p-2.5">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Hạt giống đang chọn</p>
          <div className="flex gap-1.5 overflow-x-auto">
            {Object.values(CROPS_CONFIG).map((crop) => {
              const count = data.inventory.find((i) => i.itemId === `${crop.id}_seed`)?.quantity || 0;
              const active = selectedCropId === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`flex shrink-0 flex-col items-center rounded-lg border-2 px-2 py-1.5 ${
                    active ? 'border-[#2E4A35] bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  {CROP_SPRITES[crop.id]
                    ? <SpriteIcon src={CROP_SPRITES[crop.id].seed} alt={crop.name} size={26} />
                    : <span className="text-lg">{crop.icon}</span>}
                  <span className="mt-0.5 text-[10px] font-bold text-slate-700">{crop.name}</span>
                  <span className="text-[10px] text-slate-400">x{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Panel con vật đang chọn */}
      {selectedAnimal && (
        <div className="mt-2 rounded-xl border-[3px] border-[#3a2b3f] bg-white p-3 shadow-[4px_4px_0_#3a2b3f]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">{selectedAnimal.name}</p>
              <p className="text-[11px] text-slate-500">
                {selectedAnimalDef?.name} ·{' '}
                {selectedAnimal.isSick ? 'Đang ốm' : selectedAnimal.hunger < 20 ? 'Đang đói' : animalReady ? 'Sẵn sàng thu hoạch' : 'Bình thường'}
              </p>
            </div>
            <button onClick={() => setSelectedAnimalId(null)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">Đóng</button>
          </div>
          <div className="mt-2 flex gap-2">
            {selectedAnimal.isSick && (
              <button onClick={() => { data.onCureAnimal(selectedAnimal.id); setSelectedAnimalId(null); }} className="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white">Chữa bệnh</button>
            )}
            <button onClick={() => { data.onSellAnimal(selectedAnimal.id); setSelectedAnimalId(null); }} className="flex-1 rounded-lg border border-amber-300 bg-amber-50 py-2 text-xs font-bold text-amber-700">Bán</button>
          </div>
        </div>
      )}

      {/* Panel tòa nhà đang chọn */}
      {selectedRegion && (
        <div className="mt-2 rounded-xl border-[3px] border-[#3a2b3f] bg-white p-3 shadow-[4px_4px_0_#3a2b3f]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">
                {selectedRegion.label} {regionLocked && <span className="text-xs text-slate-400">(chưa mở khóa)</span>}
              </p>
              <p className="text-[11px] text-slate-500">{selectedRegion.desc}</p>
            </div>
            <button onClick={() => setSelectedRegionId(null)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">Đóng</button>
          </div>
          <div className="mt-2">
            {!regionLocked ? (
              <button onClick={() => data.onSelectTab(selectedRegion.id)} className="w-full rounded-lg bg-[#2E4A35] py-2 text-xs font-bold text-white">
                Mở {selectedRegion.label}
              </button>
            ) : regionAffordable ? (
              <button onClick={() => { data.onUnlockRegion(selectedRegion.id, selectedRegion.cost); setSelectedRegionId(null); }} className="flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white">
                Mở khóa: <CoinIcon /> {formatMoney(selectedRegion.cost)}
              </button>
            ) : (
              <p className="py-2 text-center text-xs font-bold text-rose-600">
                Cần <CoinIcon /> {formatMoney(selectedRegion.cost)} để mở khóa
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmWorld3D;
