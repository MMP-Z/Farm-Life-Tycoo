import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimalItem, AnimalPen } from '../types/farmSystem';
import { ANIMALS_CONFIG } from '../config/farmData';
import {
  Lights, Island, Sea, VoxelClouds, FpsProbe, webglAvailable,
  CanvasShell, stdCanvasProps, setInstance, touchInstances,
} from './three/decor';

/**
 * Phase 3 — Chuồng trại 3D: vật nuôi low-poly đi lại, bấm để chữa/bán,
 * máng ăn / máng nước bấm được. Logic game giữ nguyên (tái dùng handler 2D).
 */

interface Props {
  pen: AnimalPen;
  onFeedPen: () => void;
  onFillWaterTrough: () => void;
  onCureAnimal: (animalId: string) => void;
  onSellAnimal: (animalId: string) => void;
}

const PX = 3.4; // nửa chiều rộng bãi chăn
const PZ = 2.5; // nửa chiều sâu bãi chăn

function randPoint(): [number, number] {
  return [(Math.random() * 2 - 1) * (PX - 0.5), (Math.random() * 2 - 1) * (PZ - 0.5)];
}

/* ---------- Mô hình từng loài (low-poly, mặt hướng +Z) ---------- */

function ChickenModel({ sick }: { sick: boolean }) {
  const body = sick ? '#D9A0A0' : '#F5F2EA';
  return (
    <group>
      <mesh position={[0, 0.32, 0]}><sphereGeometry args={[0.26, 7, 6]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.55, 0.16]}><sphereGeometry args={[0.14, 7, 6]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.53, 0.3]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.05, 0.1, 5]} /><meshStandardMaterial color="#F2994A" flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.68, 0.14]}><boxGeometry args={[0.05, 0.1, 0.08]} /><meshStandardMaterial color="#E15A5A" flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.38, -0.26]} rotation={[-0.7, 0, 0]}><coneGeometry args={[0.09, 0.22, 5]} /><meshStandardMaterial color={sick ? '#C98F8F' : '#E8E2D2'} flatShading roughness={0.9} /></mesh>
      <mesh position={[-0.09, 0.1, 0]}><cylinderGeometry args={[0.025, 0.025, 0.2, 5]} /><meshStandardMaterial color="#F2994A" roughness={0.9} /></mesh>
      <mesh position={[0.09, 0.1, 0]}><cylinderGeometry args={[0.025, 0.025, 0.2, 5]} /><meshStandardMaterial color="#F2994A" roughness={0.9} /></mesh>
    </group>
  );
}

function DuckModel({ sick }: { sick: boolean }) {
  const body = sick ? '#D9B06A' : '#F2D06B';
  return (
    <group>
      <mesh position={[0, 0.3, 0]} scale={[1, 0.85, 1.25]}><sphereGeometry args={[0.26, 7, 6]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.55, 0.22]}><sphereGeometry args={[0.15, 7, 6]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.52, 0.38]} scale={[1.4, 0.5, 1]}><boxGeometry args={[0.12, 0.05, 0.1]} /><meshStandardMaterial color="#F2994A" flatShading roughness={0.9} /></mesh>
      <mesh position={[-0.09, 0.09, 0]}><cylinderGeometry args={[0.03, 0.03, 0.18, 5]} /><meshStandardMaterial color="#F2994A" roughness={0.9} /></mesh>
      <mesh position={[0.09, 0.09, 0]}><cylinderGeometry args={[0.03, 0.03, 0.18, 5]} /><meshStandardMaterial color="#F2994A" roughness={0.9} /></mesh>
    </group>
  );
}

function CowModel({ sick }: { sick: boolean }) {
  const body = sick ? '#C9A48E' : '#E8DCC8';
  const dark = sick ? '#8E6A5A' : '#8A5A33';
  return (
    <group>
      <mesh position={[0, 0.55, 0]}><boxGeometry args={[0.55, 0.5, 0.95]} /><meshStandardMaterial color={body} flatShading roughness={0.95} /></mesh>
      <mesh position={[0, 0.85, 0.55]}><boxGeometry args={[0.34, 0.34, 0.32]} /><meshStandardMaterial color={body} flatShading roughness={0.95} /></mesh>
      <mesh position={[0, 0.78, 0.72]}><boxGeometry args={[0.22, 0.14, 0.06]} /><meshStandardMaterial color={dark} flatShading roughness={0.95} /></mesh>
      <mesh position={[-0.2, 1.06, 0.55]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.05, 0.18, 5]} /><meshStandardMaterial color="#EDE6D6" flatShading roughness={0.9} /></mesh>
      <mesh position={[0.2, 1.06, 0.55]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.05, 0.18, 5]} /><meshStandardMaterial color="#EDE6D6" flatShading roughness={0.9} /></mesh>
      {[[-0.18, 0.32], [0.18, 0.32], [-0.18, -0.32], [0.18, -0.32]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]}><cylinderGeometry args={[0.07, 0.08, 0.36, 5]} /><meshStandardMaterial color={dark} flatShading roughness={0.95} /></mesh>
      ))}
    </group>
  );
}

function PigModel({ sick }: { sick: boolean }) {
  const body = sick ? '#D89AA8' : '#F2A7B8';
  return (
    <group>
      <mesh position={[0, 0.4, 0]} scale={[1, 0.9, 1.2]}><sphereGeometry args={[0.32, 7, 6]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      <mesh position={[0, 0.38, 0.42]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.1, 7]} /><meshStandardMaterial color={sick ? '#C98A98' : '#E08AA0'} flatShading roughness={0.9} /></mesh>
      <mesh position={[-0.14, 0.66, 0.18]}><coneGeometry args={[0.07, 0.14, 4]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      <mesh position={[0.14, 0.66, 0.18]}><coneGeometry args={[0.07, 0.14, 4]} /><meshStandardMaterial color={body} flatShading roughness={0.9} /></mesh>
      {[[-0.16, 0.22], [0.16, 0.22], [-0.16, -0.22], [0.16, -0.22]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]}><cylinderGeometry args={[0.06, 0.06, 0.24, 5]} /><meshStandardMaterial color={sick ? '#C98A98' : '#E08AA0'} flatShading roughness={0.9} /></mesh>
      ))}
    </group>
  );
}

function AnimalModel({ type, sick }: { type: string; sick: boolean }) {
  switch (type) {
    case 'chicken': return <ChickenModel sick={sick} />;
    case 'duck': return <DuckModel sick={sick} />;
    case 'cow': return <CowModel sick={sick} />;
    case 'pig': return <PigModel sick={sick} />;
    default: return <ChickenModel sick={sick} />;
  }
}

/* ---------- Một con vật: đi lại + bấm chọn ---------- */

function Animal({
  animal, selected, onSelect,
}: {
  animal: AnimalItem;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const g = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const start = useMemo(() => randPoint(), []);
  const nav = useRef({ tx: start[0], tz: start[1], speed: 0.35 + Math.random() * 0.3, phase: Math.random() * 10 });

  const isReady = animal.daysUntilProduce <= 0 && !animal.isSick && animal.hunger > 20;

  useFrame((_, rawDt) => {
    const grp = g.current;
    if (!grp) return;
    const dt = Math.min(rawDt, 0.05);
    const n = nav.current;
    const spd = n.speed * (animal.isSick ? 0.25 : 1);
    const dx = n.tx - grp.position.x;
    const dz = n.tz - grp.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.12) {
      const [nx, nz] = randPoint();
      n.tx = nx; n.tz = nz;
    } else {
      const step = Math.min(dist, spd * dt);
      grp.position.x += (dx / dist) * step;
      grp.position.z += (dz / dist) * step;
      grp.rotation.y = Math.atan2(dx, dz);
      n.phase += dt * 9;
      grp.position.y = Math.abs(Math.sin(n.phase)) * 0.04;
    }
    if (ring.current && isReady) {
      const s = 1 + Math.sin(performance.now() * 0.006) * 0.12;
      ring.current.scale.set(s, s, s);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(animal.id);
  };

  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      <group onClick={handleClick} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
        <AnimalModel type={animal.type} sick={animal.isSick} />
      </group>
      {(isReady || selected) && (
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} raycast={() => null}>
          <ringGeometry args={[0.42, 0.55, 20]} />
          <meshBasicMaterial color={selected ? '#F59E0B' : '#FBBF24'} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Hàng rào ---------- */

function Fence() {
  const posts = useMemo(() => {
    const arr: Array<[number, number]> = [];
    const step = 1.15;
    for (let x = -PX; x <= PX + 0.01; x += step) { arr.push([x, -PZ]); arr.push([x, PZ]); }
    for (let z = -PZ + step; z <= PZ - step + 0.01; z += step) { arr.push([-PX, z]); arr.push([PX, z]); }
    return arr;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null!);

  useMemo(() => {}, []);
  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    posts.forEach(([x, z], i) => setInstance(mesh, i, x, 0.35, z, 1, 1, 1, '#8A5A33'));
    touchInstances(mesh);
  }, [posts]);

  const rail = (w: number, d: number, x: number, z: number, y: number) => (
    <mesh position={[x, y, z]} raycast={() => null}>
      <boxGeometry args={[w, 0.09, d]} />
      <meshStandardMaterial color="#A9744F" flatShading roughness={1} />
    </mesh>
  );

  return (
    <group>
      {/* Nền bãi chăn */}
      <mesh position={[0, 0.02, 0]} receiveShadow={false} raycast={() => null}>
        <cylinderGeometry args={[4.7, 4.7, 0.06, 24]} />
        <meshStandardMaterial color="#6FBF52" flatShading roughness={1} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, posts.length)]} raycast={() => null}>
        <boxGeometry args={[0.14, 0.7, 0.14]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      {[0.32, 0.58].map((y) => (
        <React.Fragment key={y}>
          {rail(PX * 2 + 0.14, 0.1, 0, -PZ, y)}
          {rail(PX * 2 + 0.14, 0.1, 0, PZ, y)}
          {rail(0.1, PZ * 2 + 0.14, -PX, 0, y)}
          {rail(0.1, PZ * 2 + 0.14, PX, 0, y)}
        </React.Fragment>
      ))}
    </group>
  );
}

/* ---------- Máng ăn / máng nước ---------- */

function Troughs({ onFeedPen, onFillWaterTrough }: { onFeedPen: () => void; onFillWaterTrough: () => void }) {
  const hover = {
    onPointerOver: () => (document.body.style.cursor = 'pointer'),
    onPointerOut: () => (document.body.style.cursor = 'auto'),
  };
  return (
    <group>
      {/* Máng ăn */}
      <group position={[-2.7, 0, -1.9]} onClick={(e) => { e.stopPropagation(); onFeedPen(); }} {...hover}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.2, 0.3, 0.55]} />
          <meshStandardMaterial color="#8A5A33" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.05, 0.12, 0.42]} />
          <meshStandardMaterial color="#E8C547" flatShading roughness={1} />
        </mesh>
      </group>
      {/* Máng nước */}
      <group position={[2.7, 0, -1.9]} onClick={(e) => { e.stopPropagation(); onFillWaterTrough(); }} {...hover}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.2, 0.3, 0.55]} />
          <meshStandardMaterial color="#7A6A5A" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[1.05, 0.06, 0.42]} />
          <meshStandardMaterial color="#4AA8E8" flatShading roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Scene ---------- */

function PastureScene({ pen, onFeedPen, onFillWaterTrough, onSelect, selectedId, onFps }: Props & {
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  onFps: (fps: number) => void;
}) {
  return (
    <>
      <Lights />
      <Island radius={5.6} />
      <Sea />
      <VoxelClouds />
      <Fence />
      <Troughs onFeedPen={onFeedPen} onFillWaterTrough={onFillWaterTrough} />
      {pen.animals.map((a) => (
        <Animal key={a.id} animal={a} selected={selectedId === a.id} onSelect={onSelect} />
      ))}
      <FpsProbe onFps={onFps} />
    </>
  );
}

/* ---------- Wrapper ---------- */

export const PastureCanvas3D: React.FC<Props> = (props) => {
  const [fps, setFps] = useState(0);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = props.pen.animals.find((a) => a.id === selectedId) || null;
  const selectedDef = selected ? ANIMALS_CONFIG[selected.type] : null;
  const isReady = selected
    ? selected.daysUntilProduce <= 0 && !selected.isSick && selected.hunger > 20
    : false;

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
        label={`3D thử nghiệm · ${props.pen.animals.length} con`}
        hint="Chạm vào con vật để chữa / bán. Chạm máng ăn để cho ăn, máng nước để đổ nước."
      >
        <Canvas
          {...stdCanvasProps}
          onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
          onError={() => setFailed(true)}
        >
          <PastureScene
            {...props}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
            onFps={setFps}
          />
        </Canvas>
      </CanvasShell>

      {/* Panel thao tác con vật đang chọn */}
      {selected && (
        <div className="mt-2 rounded-xl border-[3px] border-[#3a2b3f] bg-white p-3 shadow-[4px_4px_0_#3a2b3f]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">{selected.name}</p>
              <p className="text-[11px] text-slate-500">
                {selectedDef?.name} ·{' '}
                {selected.isSick ? 'Đang ốm' : selected.hunger < 20 ? 'Đang đói' : isReady ? 'Sẵn sàng thu hoạch' : 'Bình thường'}
              </p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500"
            >
              Đóng
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            {selected.isSick && (
              <button
                onClick={() => { props.onCureAnimal(selected.id); setSelectedId(null); }}
                className="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white"
              >
                Chữa bệnh
              </button>
            )}
            <button
              onClick={() => { props.onSellAnimal(selected.id); setSelectedId(null); }}
              className="flex-1 rounded-lg border border-amber-300 bg-amber-50 py-2 text-xs font-bold text-amber-700"
            >
              Bán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastureCanvas3D;
