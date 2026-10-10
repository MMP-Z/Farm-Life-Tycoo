import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Các thành phần trang trí 3D dùng chung cho mọi khu (phong cách Airsylum). */

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _c = new THREE.Color();

export function setInstance(
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

export function hideInstance(mesh: THREE.InstancedMesh, i: number) {
  _p.set(0, -60, 0);
  _s.set(0.0001, 0.0001, 0.0001);
  _q.identity();
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(i, _m);
}

export function touchInstances(mesh: THREE.InstancedMesh | null) {
  if (!mesh) return;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

export function Lights() {
  return (
    <>
      <hemisphereLight args={['#cfe8ff', '#7a9a5b', 0.9]} />
      <directionalLight position={[6, 10, 4]} intensity={1.25} color="#FFF3D6" />
      <fog attach="fog" args={['#CDEBF7', 20, 46]} />
    </>
  );
}

/** Đảo bay 3 tầng: cỏ / đất / đá + chóp nhọn */
export function Island({ radius }: { radius: number }) {
  const r = radius;
  return (
    <group>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[r, r * 0.94, 0.56, 28]} />
        <meshStandardMaterial color="#62B44B" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[r * 0.94, r * 0.68, 1.1, 28]} />
        <meshStandardMaterial color="#8A5A33" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -2.35, 0]}>
        <cylinderGeometry args={[r * 0.68, r * 0.22, 1.7, 28]} />
        <meshStandardMaterial color="#B9B2A2" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -3.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[r * 0.22, 0.9, 28]} />
        <meshStandardMaterial color="#A8A196" flatShading roughness={1} />
      </mesh>
    </group>
  );
}

/** Mặt biển */
export function Sea() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.4, 0]} raycast={() => null}>
      <circleGeometry args={[70, 40]} />
      <meshStandardMaterial color="#2E9BD6" flatShading roughness={0.6} transparent opacity={0.96} />
    </mesh>
  );
}

/** Mây khối vuông kiểu voxel — 1 draw call */
export function VoxelClouds() {
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
    puffs.forEach(([x, y, z, s], i) => setInstance(mesh, i, x, y, z, s, s * 0.7, s, '#FFFFFF'));
    touchInstances(mesh);
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

/** Đếm FPS, báo ra ngoài tối đa 1 lần/giây */
export function FpsProbe({ onFps }: { onFps: (fps: number) => void }) {
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

export function webglAvailable(): boolean {
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

/** Khung bọc Canvas 3D: nền trời gradient + overlay FPS. Caller tự render <Canvas> bên trong. */
export function CanvasShell({
  children, fps, label, hint,
}: {
  children: React.ReactNode;
  fps: number;
  label: string;
  hint?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-2 top-2 z-10 flex items-center gap-2">
        <span className="rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-300 backdrop-blur-sm">
          {fps} FPS
        </span>
        <span className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-sm">
          {label}
        </span>
      </div>
      <div
        className="overflow-hidden rounded-xl border-[3px] border-[#3a2b3f]"
        style={{ background: 'linear-gradient(180deg, #4AA8E8 0%, #8FD0F5 55%, #CDEBF7 100%)' }}
      >
        {children}
      </div>
      {hint && (
        <p className="mt-1.5 text-center text-[11px] font-medium text-slate-500">{hint}</p>
      )}
    </div>
  );
}

/** Props Canvas chuẩn cho mọi khu 3D */
export const stdCanvasProps = {
  flat: true,
  orthographic: true,
  dpr: [1, 1.5] as [number, number],
  camera: { position: [9, 8, 9] as [number, number, number], zoom: 36, near: 0.1, far: 120 },
  style: { height: 420, width: '100%', touchAction: 'pan-y' as const },
  gl: { antialias: true, alpha: true },
};
