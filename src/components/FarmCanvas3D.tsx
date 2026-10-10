import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { FieldPlot, Season } from '../types/farmSystem';
import { CROPS_CONFIG } from '../config/farmData';
import { calculateCropGrowth } from '../utils/cropGrowth';

/**
 * P0 SPIKE v2 — Farm view 3D low-poly, phong cách Airsylum (đảo bay, màu tươi).
 * Render bằng react-three-fiber, lazy-load. Logic game giữ nguyên (tái dùng handler 2D).
 */

interface Props {
  plots: FieldPlot[];
  selectedCropId: string;
  currentDay: number;
  timeOfDay: number;
  currentSeason: Season;
  isHardworking: boolean;
  newPlayerBoost: boolean;
  onPlowPlot: (plotId: number) => void;
  onPlantCrop: (plotId: number, cropId: string) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onCurePestPlot: (plotId: number) => void;
}

const SPACING = 1.3;
const SURFACE_TOP = 0.24;

type PlotStage = 'empty' | 'tilled' | 'sprout' | 'growing' | 'ready';

function stageOf(plot: FieldPlot, progress: number): PlotStage {
  if (plot.state === 'empty') return 'empty';
  if (plot.state === 'plowed') return 'tilled';
  if (plot.state === 'ready') return 'ready';
  if (!plot.cropId) return 'tilled';
  return progress < 0.35 ? 'sprout' : 'growing';
}

function surfaceColor(plot: FieldPlot, stage: PlotStage): string {
  const dry = plot.moisture < 30;
  switch (stage) {
    case 'empty': return dry ? '#EBD9A8' : '#DCC084';
    case 'tilled': return dry ? '#8A6242' : '#6B4A2F';
    case 'sprout':
    case 'growing': return dry ? '#75563A' : '#5A3D26';
    case 'ready': return '#556030';
  }
}

function makeFakeMouseEvent(clientX: number, clientY: number): React.MouseEvent {
  const rect = {
    left: clientX, top: clientY, width: 2, height: 2,
    right: clientX + 2, bottom: clientY + 2, x: clientX, y: clientY,
    toJSON: () => ({}),
  };
  return { target: { getBoundingClientRect: () => rect } } as unknown as React.MouseEvent;
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _c = new THREE.Color();

function setInstance(
  mesh: THREE.InstancedMesh, i: number,
  x: number, y: number, z: number,
  sx: number, sy: number, sz: number, color?: string,
) {
  _p.set(x, y, z);
  _s.set(Math.max(sx, 0.0001), Math.max(sy, 0.0001), Math.max(sz, 0.0001));
  _q.identity();
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(i, _m);
  if (color) mesh.setColorAt(i, _c.set(color));
}

function hideInstance(mesh: THREE.InstancedMesh, i: number) {
  _p.set(0, -60, 0);
  _s.set(0.0001, 0.0001, 0.0001);
  _q.identity();
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(i, _m);
}

function touch(mesh: THREE.InstancedMesh | null) {
  if (!mesh) return;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

function FarmScene(props: Props & { onFps: (fps: number) => void }) {
  const {
    plots, selectedCropId, currentDay, timeOfDay, currentSeason,
    isHardworking, newPlayerBoost,
    onPlowPlot, onPlantCrop, onHarvestPlot, onCurePestPlot, onFps,
  } = props;

  const frameRef = useRef<THREE.InstancedMesh>(null!);
  const surfRef = useRef<THREE.InstancedMesh>(null!);
  const ridgeRef = useRef<THREE.InstancedMesh>(null!);
  const sproutRef = useRef<THREE.InstancedMesh>(null!);
  const stemRef = useRef<THREE.InstancedMesh>(null!);
  const crownRef = useRef<THREE.InstancedMesh>(null!);
  const [hovered, setHovered] = useState<number | null>(null);

  const n = Math.max(1, plots.length);
  const nRidge = Math.max(1, plots.length * 3);
  const cols = Math.max(1, Math.ceil(Math.sqrt(plots.length)));
  const rows = Math.max(1, Math.ceil(plots.length / cols));
  const islandR = cols * SPACING * 0.85 + 1.7;

  const gridPos = (i: number): [number, number] => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return [(col - (cols - 1) / 2) * SPACING, (row - (rows - 1) / 2) * SPACING];
  };

  const plotData = useMemo(() => {
    return plots.map((plot) => {
      let progress = 0;
      if (plot.cropId && plot.plantedDay !== null && CROPS_CONFIG[plot.cropId]) {
        try {
          const g = calculateCropGrowth(
            plot, plot.cropId, currentDay, timeOfDay || 0, currentSeason, isHardworking, newPlayerBoost
          );
          progress = Math.min(1, Math.max(0, (g.progressPercent || 0) / 100));
        } catch { /* giu nguyen 0 */ }
      }
      return { plot, progress, stage: stageOf(plot, progress) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plots, currentDay, timeOfDay, currentSeason, isHardworking, newPlayerBoost]);

  useLayoutEffect(() => {
    const frame = frameRef.current, surf = surfRef.current, ridge = ridgeRef.current;
    const sprout = sproutRef.current, stem = stemRef.current, crown = crownRef.current;
    if (!frame || !surf || !ridge || !sprout || !stem || !crown) return;

    plotData.forEach(({ plot, progress, stage }, i) => {
      const [x, z] = gridPos(i);
      const hl = hovered === i ? 1.22 : 1;
      const pest = plot.hasPest;

      // Khung vien + mat o
      setInstance(frame, i, x, 0.03, z, 1.18, 0.3, 1.18,
        _c.set('#3A2A18').multiplyScalar(hl).getStyle());
      setInstance(surf, i, x, 0.06, z, 1.04, 0.36, 1.04,
        _c.set(surfaceColor(plot, stage)).multiplyScalar(hl).getStyle());

      // Ranh cay cho o da cay
      const tilled = stage !== 'empty';
      for (let r = 0; r < 3; r++) {
        const ri = i * 3 + r;
        if (tilled) {
          setInstance(ridge, ri, x, SURFACE_TOP + 0.02, z - 0.3 + r * 0.3, 0.94, 0.08, 0.14,
            _c.set(surfaceColor(plot, stage)).multiplyScalar(0.7 * hl).getStyle());
        } else hideInstance(ridge, ri);
      }

      // Cay theo giai doan
      const cy = SURFACE_TOP + 0.05;
      if (stage === 'sprout') {
        const s = 0.5 + progress * 1.4;
        setInstance(sprout, i, x, cy + 0.1 * s, z, s, s, s, pest ? '#B03A2E' : '#7CC46A');
        hideInstance(stem, i); hideInstance(crown, i);
      } else if (stage === 'growing') {
        const s = 0.45 + progress * 0.75;
        hideInstance(sprout, i);
        setInstance(stem, i, x, cy + 0.22 * s, z, 1, s, 1, pest ? '#8E3B2F' : '#4E8A3E');
        setInstance(crown, i, x, cy + (0.44 + 0.3 * progress) * s, z, s, s * 0.9, s,
          pest ? '#B03A2E' : '#58A447');
      } else if (stage === 'ready') {
        const s = 1.05;
        hideInstance(sprout, i);
        setInstance(stem, i, x, cy + 0.24, z, 1.1, 1.05, 1.1, '#C9A24B');
        // Bong lua vang + hieu ung sang
        setInstance(crown, i, x, cy + 0.62, z, s, s * 1.15, s, '#EFC44A');
      } else {
        hideInstance(sprout, i); hideInstance(stem, i); hideInstance(crown, i);
      }
    });

    [frame, surf, ridge, sprout, stem, crown].forEach(touch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotData, hovered, cols, rows]);

  const handlePlotClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined || idx >= plots.length) return;
    const plot = plots[idx];
    const fake = makeFakeMouseEvent(e.nativeEvent.clientX, e.nativeEvent.clientY);
    if (plot.state === 'empty') onPlowPlot(plot.id);
    else if (plot.state === 'plowed') onPlantCrop(plot.id, selectedCropId);
    else if (plot.state === 'ready') onHarvestPlot(plot.id, fake);
    else if (plot.hasPest) onCurePestPlot(plot.id);
  };

  const hoverProps = {
    onClick: handlePlotClick,
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (e.instanceId !== undefined) setHovered(e.instanceId);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHovered(null);
      document.body.style.cursor = 'auto';
    },
  };

  return (
    <>
      <hemisphereLight args={['#cfe8ff', '#7a9a5b', 0.9]} />
      <directionalLight position={[6, 10, 4]} intensity={1.25} color="#FFF3D6" />
      <fog attach="fog" args={['#CDEBF7', 20, 46]} />

      {/* Dao bay 3 tang */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[islandR, islandR * 0.94, 0.56, 28]} />
        <meshStandardMaterial color="#62B44B" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[islandR * 0.94, islandR * 0.68, 1.1, 28]} />
        <meshStandardMaterial color="#8A5A33" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -2.35, 0]}>
        <cylinderGeometry args={[islandR * 0.68, islandR * 0.22, 1.7, 28]} />
        <meshStandardMaterial color="#B9B2A2" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -3.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[islandR * 0.22, 0.9, 28]} />
        <meshStandardMaterial color="#A8A196" flatShading roughness={1} />
      </mesh>

      {/* Mat bien */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.4, 0]}>
        <circleGeometry args={[70, 40]} />
        <meshStandardMaterial color="#2E9BD6" flatShading roughness={0.6} transparent opacity={0.96} />
      </mesh>

      {/* May voxel */}
      <VoxelClouds />
      {/* Cay + nha trang tri */}
      <Decorations islandR={islandR} />

      {/* Cac o dat: vien + mat — 2 draw calls */}
      <instancedMesh ref={frameRef} args={[undefined, undefined, n]} {...hoverProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={surfRef} args={[undefined, undefined, n]} {...hoverProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
      {/* Ranh cay */}
      <instancedMesh ref={ridgeRef} args={[undefined, undefined, nRidge]} raycast={() => null}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>

      {/* Cay: mam (khau the) / than / tan — 3 draw calls */}
      <instancedMesh ref={sproutRef} args={[undefined, undefined, n]} raycast={() => null}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={stemRef} args={[undefined, undefined, n]} raycast={() => null}>
        <cylinderGeometry args={[0.035, 0.05, 0.5, 5]} />
        <meshStandardMaterial flatShading roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[undefined, undefined, n]} raycast={() => null}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>

      <FpsProbe onFps={onFps} />
    </>
  );
}

/** May khoi vuong kieu voxel, bob nhe — 1 draw call nho instancing */
function VoxelClouds() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);

  const puffs = useMemo(() => {
    const arr: Array<[number, number, number, number]> = [];
    const clouds: Array<[number, number, number, number]> = [
      [-8.5, 5.4, -5, 1.25], [7.5, 6.4, -7, 1.6], [2, 5.8, 7.5, 1.0], [-6, 6.8, 6, 0.85],
    ];
    const shape: Array<[number, number, number, number]> = [
      [0, 0, 0, 1], [1.15, 0.12, 0.2, 0.72], [-1.1, 0.08, -0.15, 0.66],
      [0.35, 0.5, -0.3, 0.58], [-0.4, 0.42, 0.35, 0.5],
    ];
    clouds.forEach(([cx, cy, cz, cs]) => {
      shape.forEach(([x, y, z, s]) => arr.push([cx + x * cs, cy + y * cs, cz + z * cs, s * cs]));
    });
    return arr;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    puffs.forEach(([x, y, z, s], i) => {
      setInstance(mesh, i, x, y, z, s, s * 0.7, s, '#FFFFFF');
    });
    touch(mesh);
  }, [puffs]);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.22;
      group.current.position.x = Math.sin(clock.elapsedTime * 0.12) * 0.5;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, puffs.length)]} raycast={() => null}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
    </group>
  );
}

/** Cay + nha trang tri goc dao — vai mesh tinh, re */
function Decorations({ islandR }: { islandR: number }) {
  const trees: Array<[number, number]> = [
    [-islandR + 1.2, -islandR + 1.6],
    [islandR - 1.4, -islandR + 1.1],
    [-islandR + 1.0, islandR - 1.8],
  ];
  return (
    <group>
      {trees.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
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
      {/* Nha nho goc dao */}
      <group position={[islandR - 1.6, 0, islandR - 1.6]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.1, 0.7, 0.9]} />
          <meshStandardMaterial color="#F2E3C2" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.95, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.95, 0.55, 4]} />
          <meshStandardMaterial color="#E2725B" flatShading roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

/** Dem FPS, bao ra ngoai toi da 1 lan/giay */
function FpsProbe({ onFps }: { onFps: (fps: number) => void }) {
  const frames = useRef(0);
  const last = useRef(performance.now());
  const cb = useRef(onFps);
  cb.current = onFps;
  useFrame(() => {
    frames.current += 1;
    const now = performance.now();
    const dt = now - last.current;
    if (dt >= 1000) {
      cb.current(Math.round((frames.current * 1000) / dt));
      frames.current = 0;
      last.current = now;
    }
  });
  return null;
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/** Wrapper: Canvas lazy-load + fallback 2D khi khong co WebGL */
export const FarmCanvas3D: React.FC<Props> = (props) => {
  const [fps, setFps] = useState(0);
  const [failed, setFailed] = useState(false);

  if (!webglAvailable() || failed) {
    return (
      <div className="rounded-md border-[3px] border-[#3a2b3f] bg-amber-50 p-4 text-center text-sm font-bold text-amber-900">
        Thiết bị không hỗ trợ WebGL — đang dùng giao diện 2D.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-2 top-2 z-10 flex items-center gap-2">
        <span className="rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-300 backdrop-blur-sm">
          {fps} FPS
        </span>
        <span className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-sm">
          3D thử nghiệm · {props.plots.length} ô
        </span>
      </div>
      <div
        className="overflow-hidden rounded-xl border-[3px] border-[#3a2b3f]"
        style={{ background: 'linear-gradient(180deg, #4AA8E8 0%, #8FD0F5 55%, #CDEBF7 100%)' }}
      >
        <Canvas
          flat
          orthographic
          dpr={[1, 1.5]}
          camera={{ position: [9, 8, 9], zoom: 36, near: 0.1, far: 120 }}
          style={{ height: 420, width: '100%', touchAction: 'pan-y' }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 0);
          }}
          onError={() => setFailed(true)}
        >
          <FarmScene {...props} onFps={setFps} />
        </Canvas>
      </div>
      <p className="mt-1.5 text-center text-[11px] font-medium text-slate-500">
        Chạm vào ô đất để cày / gieo / thu hoạch như bản 2D. Mục tiêu spike: giữ ≥ 30 FPS.
      </p>
    </div>
  );
};

export default FarmCanvas3D;
