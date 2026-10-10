import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { FieldPlot, Season } from '../types/farmSystem';
import { CROPS_CONFIG } from '../config/farmData';
import { calculateCropGrowth } from '../utils/cropGrowth';

/**
 * P0 SPIKE — Farm view 3D low-poly (Airsylum-style) bằng react-three-fiber.
 *
 * Phạm vi spike: render ô đất dạng isometric 3D, bấm (raycast) để cày/gieo/thu hoạch,
 * đồng hồ FPS để đo trên máy thật. KHÔNG thay logic game — mọi callback tái dùng
 * handler 2D hiện có. FieldTab 2D giữ nguyên làm fallback.
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

const SPACING = 1.25;
const TILE_SIZE = 1.05;

// Màu theo trạng thái ô — palette tươi kiểu Airsylum
function plotBaseColor(plot: FieldPlot): string {
  const dry = plot.moisture < 30;
  if (plot.state === 'empty') return dry ? '#EFE3C2' : '#E3D3AC';
  if (plot.state === 'plowed') return dry ? '#7A5A3E' : '#5E4229';
  if (plot.state === 'ready') return '#4E5A2E';
  // growing
  return dry ? '#6E5138' : '#543B24';
}

function cropVisual(plot: FieldPlot, progress: number): { scale: number; color: string } | null {
  if (!plot.cropId || plot.state === 'empty' || plot.state === 'plowed') return null;
  if (plot.hasPest) return { scale: 0.25 + progress * 0.5, color: '#B03A2E' };
  if (plot.state === 'ready') return { scale: 1.0, color: '#E8B93C' };
  return { scale: 0.25 + progress * 0.65, color: '#58A447' };
}

function makeFakeMouseEvent(clientX: number, clientY: number): React.MouseEvent {
  const rect = {
    left: clientX,
    top: clientY,
    width: 2,
    height: 2,
    right: clientX + 2,
    bottom: clientY + 2,
    x: clientX,
    y: clientY,
    toJSON: () => ({}),
  };
  return { target: { getBoundingClientRect: () => rect } } as unknown as React.MouseEvent;
}

function FarmScene(props: Props & { onFps: (fps: number) => void }) {
  const {
    plots, selectedCropId, currentDay, timeOfDay, currentSeason,
    isHardworking, newPlayerBoost,
    onPlowPlot, onPlantCrop, onHarvestPlot, onCurePestPlot, onFps,
  } = props;

  const plotMesh = useRef<THREE.InstancedMesh>(null!);
  const cropMesh = useRef<THREE.InstancedMesh>(null!);
  const [hovered, setHovered] = useState<number | null>(null);

  const cols = Math.max(1, Math.ceil(Math.sqrt(plots.length)));
  const rows = Math.max(1, Math.ceil(plots.length / cols));

  const gridPos = (i: number): [number, number] => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return [(col - (cols - 1) / 2) * SPACING, (row - (rows - 1) / 2) * SPACING];
  };

  // Tính tiến độ sinh trưởng cho từng ô (tái dùng đúng hàm của game)
  const growthOf = (plot: FieldPlot): number => {
    if (!plot.cropId || plot.plantedDay === null) return 0;
    const crop = CROPS_CONFIG[plot.cropId];
    if (!crop) return 0;
    try {
      const g = calculateCropGrowth(
        plot, plot.cropId, currentDay, timeOfDay || 0, currentSeason, isHardworking, newPlayerBoost
      );
      return Math.min(1, Math.max(0, (g.progressPercent || 0) / 100));
    } catch {
      return 0;
    }
  };

  const plotData = useMemo(
    () => plots.map((p) => ({ plot: p, progress: growthOf(p) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plots, currentDay, timeOfDay, currentSeason, isHardworking, newPlayerBoost]
  );

  // Cập nhật instance matrices + màu — chạy khi plots/state đổi, KHÔNG mỗi frame
  useLayoutEffect(() => {
    const pm = plotMesh.current;
    const cm = cropMesh.current;
    if (!pm || !cm) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const pos = new THREE.Vector3();
    const col = new THREE.Color();

    plotData.forEach(({ plot, progress }, i) => {
      const [x, z] = gridPos(i);
      // Ô đất
      pos.set(x, 0, z);
      s.set(TILE_SIZE, 0.35, TILE_SIZE);
      q.identity();
      m.compose(pos, q, s);
      pm.setMatrixAt(i, m);
      const base = plotBaseColor(plot);
      // Ô được hover: sáng lên
      pm.setColorAt(i, col.set(base).multiplyScalar(hovered === i ? 1.25 : 1));

      // Cây trồng
      const cv = cropVisual(plot, progress);
      if (cv) {
        pos.set(x, 0.175 + 0.35 * cv.scale, z);
        s.set(cv.scale, cv.scale, cv.scale);
        m.compose(pos, q, s);
        cm.setColorAt(i, col.set(cv.color));
      } else {
        // Ẩn: scale 0
        pos.set(x, -10, z);
        s.set(0.0001, 0.0001, 0.0001);
        m.compose(pos, q, s);
      }
      cm.setMatrixAt(i, m);
    });
    pm.instanceMatrix.needsUpdate = true;
    cm.instanceMatrix.needsUpdate = true;
    if (pm.instanceColor) pm.instanceColor.needsUpdate = true;
    if (cm.instanceColor) cm.instanceColor.needsUpdate = true;
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

  return (
    <>
      {/* Ánh sáng kiểu Airsylum: 1 directional + 1 hemisphere, flat shading */}
      <hemisphereLight args={['#cfe8ff', '#7a9a5b', 0.95]} />
      <directionalLight position={[6, 10, 4]} intensity={1.15} />

      {/* Đảo cỏ + chân đế đảo bay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.19, 0]}>
        <circleGeometry args={[cols * SPACING * 0.95, 40]} />
        <meshStandardMaterial color="#6FB34E" flatShading />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[cols * SPACING * 0.95, cols * SPACING * 0.55, 1.8, 24]} />
        <meshStandardMaterial color="#D9D2BE" flatShading />
      </mesh>

      {/* Mây voxel trôi */}
      <VoxelClouds />

      {/* Các ô đất — 1 draw call */}
      <instancedMesh
        ref={plotMesh}
        args={[undefined, undefined, Math.max(1, plots.length)]}
        onClick={handlePlotClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) setHovered(e.instanceId);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={0.9} />
      </instancedMesh>

      {/* Cây trồng — 1 draw call */}
      <instancedMesh
        ref={cropMesh}
        args={[undefined, undefined, Math.max(1, plots.length)]}
        raycast={() => null}
      >
        <coneGeometry args={[0.32, 0.85, 6]} />
        <meshStandardMaterial flatShading roughness={0.8} />
      </instancedMesh>

      <FpsProbe onFps={onFps} />
    </>
  );
}

/** Mây khối vuông kiểu voxel, bob nhẹ */
function VoxelClouds() {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.18;
  });
  const puffs: Array<[number, number, number, number]> = [
    [0, 0, 0, 1], [1.1, 0.15, 0.2, 0.75], [-1.05, 0.1, -0.15, 0.7], [0.35, 0.55, -0.3, 0.6],
  ];
  return (
    <group ref={g}>
      {[
        { p: [-7, 5.2, -4], s: 1.1 },
        { p: [6.5, 6.2, -6], s: 1.5 },
        { p: [1.5, 5.6, 6.5], s: 0.9 },
      ].map((c, ci) => (
        <group key={ci} position={c.p as [number, number, number]} scale={c.s}>
          {puffs.map(([x, y, z, s], pi) => (
            <mesh key={pi} position={[x, y, z]}>
              <boxGeometry args={[s, s * 0.72, s]} />
              <meshStandardMaterial color="#FFFFFF" flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Đếm FPS, báo ra ngoài tối đa 1 lần/giây */
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

/** Wrapper: Canvas lazy-load + fallback 2D khi không có WebGL */
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
      {/* Overlay: FPS + chú thích spike */}
      <div className="absolute left-2 top-2 z-10 flex items-center gap-2">
        <span className="rounded-md bg-black/70 px-2 py-1 font-mono text-[11px] font-bold text-emerald-300">
          {fps} FPS
        </span>
        <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-bold text-amber-200">
          3D thử nghiệm · {props.plots.length} ô
        </span>
      </div>
      <div className="overflow-hidden rounded-md border-[3px] border-[#3a2b3f]">
        <Canvas
          flat
          orthographic
          dpr={[1, 1.5]}
          camera={{ position: [9, 9, 9], zoom: 38, near: 0.1, far: 100 }}
          style={{ height: 400, width: '100%', touchAction: 'pan-y' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#9FD4F0');
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
