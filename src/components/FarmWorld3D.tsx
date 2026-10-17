import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FieldPlot, Season, AnimalPen, OrderItem, FactoryBuilding, TransportTrip } from '../types/farmSystem';
import { ANIMALS_CONFIG, CROPS_CONFIG } from '../config/farmData';
import { GameTab } from './NavigationTabs';
import { formatMoney } from '../utils/format';
import { CoinIcon } from './CoinIcon';
import {
  Lights, Sea, VoxelClouds, FpsProbe, webglAvailable,
  CanvasShell, stdCanvasProps,
} from './three/decor';
import { VillageGround } from './three/VillageGround';
import { VillageDecor } from './three/VillageDecor';
import { Villagers } from './three/Villagers';
import { Label } from './three/Label';
import { PlayerCharacter } from './three/PlayerCharacter';
import { playerInput, playerState } from './three/playerInput';
import Joystick from './three/Joystick';
import { FieldZone } from './three/zones/FieldZone';
import { PastureZone } from './three/zones/PastureZone';
import { VillageZone, RegionInfo } from './three/zones/VillageZone';
import { ShopZone } from './three/zones/ShopZone';
import { MarketZone } from './three/zones/MarketZone';
import { BarnZone } from './three/zones/BarnZone';
import { SupermarketZone } from './three/zones/SupermarketZone';
import { WorkshopZone } from './three/zones/WorkshopZone';
import { TransportZone } from './three/zones/TransportZone';
import { AdminZone } from './three/zones/AdminZone';

/**
 * Phase 5 — Thế giới 3D thống nhất: MỘT đảo duy nhất gồm 3 khu
 * (cánh đồng / chuồng trại / làng), camera bay mượt giữa các khu.
 * Mọi tương tác thế giới làm trực tiếp trong 3D. Logic game giữ nguyên.
 */

export type WorldZone = 'overview' | 'field' | 'pasture' | 'village' | 'shop' | 'market' | 'barn' | 'supermarket' | 'workshop' | 'transport' | 'admin';

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
  emptyPlotsCount: number;
  hasAutoIrrigation: boolean;
  autoWorkersCount: number;
  autoIrrigationCost: number;
  autoWorkerCost: number;
  barnTotalItems: number;
  barnCapacity: number;
  hasColdStorage: boolean;
  barnUpgradeCost: number;
  coldStorageCost: number;
  onPlowPlot: (plotId: number) => void;
  onPlantCrop: (plotId: number, cropId: string) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onCurePestPlot: (plotId: number) => void;
  onWaterAll: () => void;
  onHarvestAll: () => void;
  onBuyNewPlot: () => void;
  onFeedPen: () => void;
  onFillWaterTrough: () => void;
  onCollectProduce: () => void;
  onCureAnimal: (animalId: string) => void;
  onSellAnimal: (animalId: string) => void;
  onBuyItem: (itemId: string, qty: number, price: number) => void;
  onBuySeedsForEmptyPlots: (itemId: string, qty: number, price: number) => void;
  onBuyAnimal: (animalId: string) => void;
  onBuyAutoIrrigation: () => void;
  onHireAutoWorker: () => void;
  onDirectSell: (itemId: string, qty: number, price: number) => void;
  onUpgradeBarnCapacity: () => void;
  onBuildColdStorage: () => void;
  orders: OrderItem[];
  factories: Record<string, FactoryBuilding>;
  ownedVehicles: string[];
  activeTrips: TransportTrip[];
  onFulfillOrder: (orderId: string) => void;
  onSkipOrder: (orderId: string) => void;
  onStartCraft: (factoryId: string, recipeId: string) => void;
  onCollectFinishedTask: (factoryId: string, taskId: string) => void;
  onUnlockFactory: (factoryId: string) => void;
  onBuyVehicle: (vehicleId: string) => void;
  onDispatchTrip: (vehicleId: string) => void;
  onOpenAdminPanel: (section: 'tax' | 'loan' | 'insurance') => void;
  onSelectTab: (tab: GameTab) => void;
  onUnlockRegion: (regionId: string, cost: number) => void;
  onOpenPanel: (panel: GameTab) => void;
}

/* Vị trí các khu trên làng chữ nhật (nền 44x32) */
const FIELD_POS: [number, number] = [-14, -2];
const PASTURE_POS: [number, number] = [14, 10];
const VILLAGE_POS: [number, number] = [0, 11];
const SHOP_POS: [number, number] = [15, -8];
const MARKET_POS: [number, number] = [15, -2];
const BARN_POS: [number, number] = [-8, 12];
const SUPERMARKET_POS: [number, number] = [15, 4];
const WORKSHOP_POS: [number, number] = [-14, 10];
const TRANSPORT_POS: [number, number] = [-18, 12];
const ADMIN_POS: [number, number] = [0, 5];

interface CamPreset { pos: [number, number, number]; look: [number, number, number]; zoom: number; }

/* Bảng công trình tương tác theo khoảng cách — đi bộ tới gần thì hiện nút "Vào khu" */
const SPOTS: Array<{ id: string; label: string; x: number; z: number }> = [
  { id: 'field', label: 'Cánh đồng', x: -14, z: -2 },
  { id: 'pasture', label: 'Chuồng trại', x: 14, z: 10 },
  { id: 'village', label: 'Làng', x: 0, z: 11 },
  { id: 'shop', label: 'Cửa hàng', x: 15, z: -8 },
  { id: 'market', label: 'Chợ làng', x: 15, z: -2 },
  { id: 'barn', label: 'Nhà kho', x: -8, z: 12 },
  { id: 'supermarket', label: 'Siêu thị', x: 15, z: 4 },
  { id: 'workshop', label: 'Xưởng chế biến', x: -14, z: 10 },
  { id: 'transport', label: 'Đội vận tải', x: -18, z: 12 },
  { id: 'admin', label: 'Hành chính', x: 0, z: 5 },
];

const PRESETS: Record<WorldZone, CamPreset> = {
  overview: { pos: [22, 20, 24], look: [0, 0, 0], zoom: 15 },
  field: { pos: [FIELD_POS[0] + 9, 8, FIELD_POS[1] + 9], look: [FIELD_POS[0], 0, FIELD_POS[1]], zoom: 33 },
  pasture: { pos: [PASTURE_POS[0] + 9, 8, PASTURE_POS[1] + 9], look: [PASTURE_POS[0], 0, PASTURE_POS[1]], zoom: 33 },
  village: { pos: [VILLAGE_POS[0] + 9, 8, VILLAGE_POS[1] + 9], look: [VILLAGE_POS[0], 0, VILLAGE_POS[1]], zoom: 30 },
  shop: { pos: [SHOP_POS[0] + 9, 8, SHOP_POS[1] + 9], look: [SHOP_POS[0], 0, SHOP_POS[1]], zoom: 30 },
  market: { pos: [MARKET_POS[0] + 9, 8, MARKET_POS[1] + 9], look: [MARKET_POS[0], 0, MARKET_POS[1]], zoom: 30 },
  barn: { pos: [BARN_POS[0] + 9, 8, BARN_POS[1] + 9], look: [BARN_POS[0], 0, BARN_POS[1]], zoom: 30 },
  supermarket: { pos: [SUPERMARKET_POS[0] + 9, 8, SUPERMARKET_POS[1] + 9], look: [SUPERMARKET_POS[0], 0, SUPERMARKET_POS[1]], zoom: 30 },
  workshop: { pos: [WORKSHOP_POS[0] + 9, 8, WORKSHOP_POS[1] + 9], look: [WORKSHOP_POS[0], 0, WORKSHOP_POS[1]], zoom: 30 },
  transport: { pos: [TRANSPORT_POS[0] + 9, 8, TRANSPORT_POS[1] + 9], look: [TRANSPORT_POS[0], 0, TRANSPORT_POS[1]], zoom: 30 },
  admin: { pos: [ADMIN_POS[0] + 9, 8, ADMIN_POS[1] + 9], look: [ADMIN_POS[0], 0, ADMIN_POS[1]], zoom: 30 },
};

/** Camera bay mượt: chế độ follow đi theo nhân vật, hoặc preset cố định theo khu */
function CameraRig({ zone, follow }: { zone: WorldZone; follow: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const look = useRef(new THREE.Vector3(...PRESETS[zone].look));
  const first = useRef(true);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    // Mục tiêu camera: follow nhân vật hoặc preset của khu
    let tx: number, ty: number, tz: number, lx: number, lz: number, zm: number;
    if (follow) {
      const px = playerState.x, pz = playerState.z;
      tx = px + 9; ty = 8; tz = pz + 9;
      lx = px; lz = pz; zm = 30;
    } else {
      const p = PRESETS[zone];
      tx = p.pos[0]; ty = p.pos[1]; tz = p.pos[2];
      lx = p.look[0]; lz = p.look[2]; zm = p.zoom;
    }
    if (first.current) {
      camera.position.set(tx, ty, tz);
      look.current.set(lx, 0, lz);
      camera.zoom = zm;
      camera.updateProjectionMatrix();
      camera.lookAt(look.current);
      first.current = false;
      return;
    }
    const k = 1 - Math.exp(-3.2 * dt);
    camera.position.lerp(new THREE.Vector3(tx, ty, tz), k);
    look.current.lerp(new THREE.Vector3(lx, 0, lz), k);
    camera.lookAt(look.current);
    camera.zoom += (zm - camera.zoom) * k;
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

export const FarmWorld3D: React.FC<{
  data: WorldData;
  initialZone: WorldZone;
  zone: WorldZone;
  onZoneChange: (zone: WorldZone) => void;
}> = ({ data, initialZone, zone, onZoneChange }) => {
  const [fps, setFps] = useState(0);
  const [failed, setFailed] = useState(false);
  const [seedMenuPlotId, setSeedMenuPlotId] = useState<number | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<GameTab | null>(null);
  // Chế độ đi bộ: camera follow nhân vật, hiện joystick. Mặc định bật.
  const [followMode, setFollowMode] = useState(true);
  // Công trình gần nhất trong tầm tương tác (để hiện nút "Vào khu")
  const [nearbyId, setNearbyId] = useState<string | null>(null);

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
    { id: 'shop', label: 'Cửa hàng' },
    { id: 'market', label: 'Chợ' },
    { id: 'barn', label: 'Kho' },
    { id: 'supermarket', label: 'Siêu thị' },
    { id: 'workshop', label: 'Xưởng' },
    { id: 'transport', label: 'Vận tải' },
    { id: 'admin', label: 'Hành chính' },
  ];

  // Phím WASD / mũi tên cho desktop (ghi vào playerInput.keys)
  useEffect(() => {
    const KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (KEYS.includes(k)) {
        playerInput.keys.add(k);
        if (k.startsWith('arrow')) e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      playerInput.keys.delete(e.key.toLowerCase());
    };
    const blur = () => playerInput.keys.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  // Quét công trình gần nhân vật mỗi 200ms — chỉ setState khi đổi để tránh render thừa
  useEffect(() => {
    if (!followMode) {
      setNearbyId(null);
      return;
    }
    const timer = setInterval(() => {
      let best: string | null = null;
      let bestD = 2.5;
      for (const s of SPOTS) {
        const d = Math.hypot(playerState.x - s.x, playerState.z - s.z);
        if (d < bestD) {
          bestD = d;
          best = s.id;
        }
      }
      setNearbyId((cur) => (cur === best ? cur : best));
    }, 200);
    return () => clearInterval(timer);
  }, [followMode]);

  const nearbySpot = SPOTS.find((s) => s.id === nearbyId) || null;

  // Mở khu khi bấm nút "Vào ...": field/pasture/village đổi góc camera, còn lại mở menu 2D
  const openSpot = (id: string) => {
    if (id === 'field' || id === 'pasture' || id === 'village') {
      setFollowMode(false);
      onZoneChange(id);
    } else {
      data.onOpenPanel(id as GameTab);
    }
  };

  if (!webglAvailable() || failed) {
    return (
      <div className="rounded-md border-[3px] border-[#3a2b3f] bg-amber-50 p-4 text-center text-sm font-bold text-amber-900">
        Thiết bị không hỗ trợ WebGL — đang dùng giao diện 2D.
      </div>
    );
  }

  const init = PRESETS[initialZone];

  return (
    <div className="relative h-full w-full">
      <CanvasShell fps={fps} label="Thế giới 3D" fullscreen>
        <Canvas
          {...stdCanvasProps}
          style={{ ...stdCanvasProps.style, height: '100dvh', width: '100vw' }}
          camera={{ position: init.pos, zoom: init.zoom, near: 0.1, far: 160 }}
          onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
          onError={() => setFailed(true)}
        >
          <Lights />
          <VillageGround />
          <Sea />
          <VoxelClouds />
          <VillageDecor />
          <Villagers />
          <PlayerCharacter />
          <CameraRig zone={zone} follow={followMode} />
          <group position={[FIELD_POS[0], 0, FIELD_POS[1]]} visible={followMode || zone === 'overview' || zone === 'field'}>
            <Label text="Cánh Đồng" position={[0, 4.6, -3.2]} scale={1.1} />
            <FieldZone
              plots={data.plots}
              inventory={data.inventory}
              currentDay={data.currentDay}
              timeOfDay={data.timeOfDay}
              currentSeason={data.currentSeason}
              isHardworking={data.isHardworking}
              newPlayerBoost={data.newPlayerBoost}
              onPlowPlot={data.onPlowPlot}
              onPlantCrop={data.onPlantCrop}
              onOpenSeedMenu={setSeedMenuPlotId}
              onHarvestPlot={data.onHarvestPlot}
              onCurePestPlot={data.onCurePestPlot}
              onWaterAll={data.onWaterAll}
              onHarvestAll={data.onHarvestAll}
              onBuyNewPlot={data.onBuyNewPlot}
            />
          </group>
          <group position={[PASTURE_POS[0], 0, PASTURE_POS[1]]} visible={followMode || zone === 'overview' || zone === 'pasture'}>
            <Label text="Chuồng Trại" position={[0, 4.2, -3.4]} scale={1.1} />
            <PastureZone
              pen={data.pen}
              selectedId={selectedAnimalId}
              onSelect={(id) => setSelectedAnimalId((cur) => (cur === id ? null : id))}
              onFeedPen={data.onFeedPen}
              onFillWaterTrough={data.onFillWaterTrough}
              onCollectProduce={data.onCollectProduce}
            />
          </group>
          <group position={[VILLAGE_POS[0], 0, VILLAGE_POS[1]]} visible={followMode || zone === 'overview' || zone === 'village'}>
            <VillageZone
              regions={data.regions}
              unlockedRegions={data.unlockedRegions}
              selectedId={selectedRegionId}
              onSelect={(id) => setSelectedRegionId((cur) => (cur === id ? null : id))}
            />
          </group>
          <group position={[SHOP_POS[0], 0, SHOP_POS[1]]} visible={followMode || zone === 'overview' || zone === 'shop'}>
            <ShopZone onOpenShop={() => data.onOpenPanel('shop')} />
          </group>
          <group position={[MARKET_POS[0], 0, MARKET_POS[1]]} visible={followMode || zone === 'overview' || zone === 'market'}>
            <MarketZone onOpenMarket={() => data.onOpenPanel('market')} />
          </group>
          <group position={[BARN_POS[0], 0, BARN_POS[1]]} visible={followMode || zone === 'overview' || zone === 'barn'}>
            <BarnZone onOpenBarn={() => data.onOpenPanel('barn')} />
          </group>
          <group position={[SUPERMARKET_POS[0], 0, SUPERMARKET_POS[1]]} visible={followMode || zone === 'overview' || zone === 'supermarket'}>
            <SupermarketZone onOpenSupermarket={() => data.onOpenPanel('supermarket')} />
          </group>
          <group position={[WORKSHOP_POS[0], 0, WORKSHOP_POS[1]]} visible={followMode || zone === 'overview' || zone === 'workshop'}>
            <WorkshopZone onOpenWorkshop={() => data.onOpenPanel('workshop')} />
          </group>
          <group position={[TRANSPORT_POS[0], 0, TRANSPORT_POS[1]]} visible={followMode || zone === 'overview' || zone === 'transport'}>
            <TransportZone onOpenTransport={() => data.onOpenPanel('transport')} />
          </group>
          <group position={[ADMIN_POS[0], 0, ADMIN_POS[1]]} visible={followMode || zone === 'overview' || zone === 'admin'}>
            <AdminZone onOpenAdmin={() => data.onOpenPanel('admin')} />
          </group>
          <FpsProbe onFps={setFps} />
        </Canvas>
      </CanvasShell>

      {/* Joystick ảo — chỉ hiện ở chế độ đi bộ */}
      {followMode && <Joystick />}

      {/* Nút "Vào khu" — hiện khi nhân vật đứng gần công trình */}
      {followMode && nearbySpot && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-30 flex justify-center">
          <button
            onClick={() => openSpot(nearbySpot.id)}
            className="pointer-events-auto rounded-full border-2 border-[#3a2b3f] bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95"
          >
            Vào {nearbySpot.label}
          </button>
        </div>
      )}

      {/* Nút bật lại chế độ đi bộ khi đang xem preset khu */}
      {!followMode && (
        <button
          onClick={() => {
            setFollowMode(true);
            onZoneChange('overview');
          }}
          className="absolute bottom-6 right-6 z-30 rounded-full border-2 border-[#3a2b3f] bg-[#2E4A35] px-4 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95"
        >
          Đi bộ
        </button>
      )}

      {/* Menu 2D chọn hạt giống — bấm ô đất đã cày */}
      {seedMenuPlotId !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSeedMenuPlotId(null)}
          />
          <div className="relative w-full max-w-md rounded-t-3xl border-t-[3px] border-x-[3px] border-[#3a2b3f] bg-[#F3EFE0] p-4 pb-6 sm:rounded-3xl sm:border-[3px]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800">Chọn cây trồng</h3>
              <button
                onClick={() => setSeedMenuPlotId(null)}
                className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CROPS_CONFIG).map((crop) => {
                const seedCount = data.inventory.find((i) => i.itemId === `${crop.id}_seed`)?.quantity || 0;
                return (
                  <button
                    key={crop.id}
                    disabled={seedCount <= 0}
                    onClick={() => {
                      data.onPlantCrop(seedMenuPlotId, crop.id);
                      setSeedMenuPlotId(null);
                    }}
                    className="flex items-center gap-2 rounded-xl border-2 border-[#3a2b3f] bg-white p-2.5 text-left shadow-[2px_2px_0_#3a2b3f] active:scale-95 disabled:opacity-40"
                  >
                    <span className="text-2xl">{crop.icon}</span>
                    <span>
                      <span className="block text-xs font-bold text-slate-800">{crop.name}</span>
                      <span className="block text-[11px] text-slate-500">Còn {seedCount} hạt</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Nút hành động 2D nổi theo khu */}
      {zone === 'field' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex justify-center gap-2">
          <button
            onClick={() => data.onWaterAll()}
            className="pointer-events-auto rounded-full border-2 border-[#3a2b3f] bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-95"
          >
            Tưới hết
          </button>
          <button
            onClick={() => data.onHarvestAll()}
            className="pointer-events-auto rounded-full border-2 border-[#3a2b3f] bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-95"
          >
            Thu hoạch hết
          </button>
        </div>
      )}
      {zone === 'pasture' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex justify-center gap-2">
          <button
            onClick={() => data.onFeedPen()}
            className="pointer-events-auto rounded-full border-2 border-[#3a2b3f] bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-95"
          >
            Cho ăn
          </button>
          <button
            onClick={() => data.onFillWaterTrough()}
            className="pointer-events-auto rounded-full border-2 border-[#3a2b3f] bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-95"
          >
            Đổ nước
          </button>
          <button
            onClick={() => data.onCollectProduce()}
            className="pointer-events-auto rounded-full border-2 border-[#3a2b3f] bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-95"
          >
            Thu sản phẩm
          </button>
        </div>
      )}

      {/* Thanh di chuyển giữa các khu — bấm là tắt chế độ đi bộ, về preset camera cũ */}
      <div className="mt-2 flex gap-1.5 overflow-x-auto">
        {zoneTabs.map((z) => (
          <button
            key={z.id}
            onClick={() => {
              setFollowMode(false);
              onZoneChange(z.id);
            }}
            className={`shrink-0 rounded-full border-2 border-[#3a2b3f] px-3 py-1.5 text-xs font-bold ${
              zone === z.id ? 'bg-[#2E4A35] text-white' : 'bg-white text-slate-600'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Panel con vật đang chọn */}
      {/* Panel sạp chợ đang chọn */}
      {/* Panel đơn hàng đang chọn */}
      
      {/* Panel xưởng đang chọn */}
      
      {/* Panel xe đang chọn */}
      
      
      
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
              <button
                onClick={() => {
                  const id = selectedRegion.id;
                  setSelectedRegionId(null);
                  if (id === 'field' || id === 'pasture') {
                    onZoneChange(id);
                  } else if (id === 'hub') {
                    onZoneChange('village');
                  } else {
                    data.onOpenPanel(id);
                  }
                }}
                className="w-full rounded-lg bg-[#2E4A35] py-2 text-xs font-bold text-white"
              >
                {selectedRegion.id === 'field' || selectedRegion.id === 'pasture' || selectedRegion.id === 'hub'
                  ? `Đến ${selectedRegion.label}`
                  : `Mở ${selectedRegion.label}`}
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
