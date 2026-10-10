import React, { useMemo, useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimalItem, AnimalPen } from '../../../types/farmSystem';
import { setInstance, touchInstances } from '../decor';
import { Label } from '../Label';

/** Zone chuồng trại trong thế giới 3D thống nhất. Tọa độ local, bọc bởi <group position>. */

export interface PastureZoneProps {
  pen: AnimalPen;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onFeedPen: () => void;
  onFillWaterTrough: () => void;
  onCollectProduce: () => void;
}

const PX = 3.4;
const PZ = 2.5;

function randPoint(): [number, number] {
  return [(Math.random() * 2 - 1) * (PX - 0.5), (Math.random() * 2 - 1) * (PZ - 0.5)];
}

/* ---------- Mô hình từng loài ---------- */

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

/* ---------- Một con vật ---------- */

function Animal({ animal, selected, onSelect }: {
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

  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(animal.id); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
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

  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    posts.forEach(([x, z], i) => setInstance(mesh, i, x, 0.35, z, 1, 1, 1, '#8A5A33'));
    touchInstances(mesh);
  }, [posts]);

  const rail = (w: number, d: number, x: number, z: number, y: number, key: string) => (
    <mesh key={key} position={[x, y, z]} raycast={() => null}>
      <boxGeometry args={[w, 0.09, d]} />
      <meshStandardMaterial color="#A9744F" flatShading roughness={1} />
    </mesh>
  );

  return (
    <group>
      <mesh position={[0, 0.02, 0]} raycast={() => null}>
        <cylinderGeometry args={[4.7, 4.7, 0.06, 24]} />
        <meshStandardMaterial color="#6FBF52" flatShading roughness={1} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, posts.length)]} raycast={() => null}>
        <boxGeometry args={[0.14, 0.7, 0.14]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      {[0.32, 0.58].map((y) => (
        <React.Fragment key={y}>
          {rail(PX * 2 + 0.14, 0.1, 0, -PZ, y, `n${y}`)}
          {rail(PX * 2 + 0.14, 0.1, 0, PZ, y, `s${y}`)}
          {rail(0.1, PZ * 2 + 0.14, -PX, 0, y, `w${y}`)}
          {rail(0.1, PZ * 2 + 0.14, PX, 0, y, `e${y}`)}
        </React.Fragment>
      ))}
    </group>
  );
}

/* ---------- Máng ăn / nước ---------- */

function Troughs({ onFeedPen, onFillWaterTrough }: { onFeedPen: () => void; onFillWaterTrough: () => void }) {
  const hover = {
    onPointerOver: () => (document.body.style.cursor = 'pointer'),
    onPointerOut: () => (document.body.style.cursor = 'auto'),
  };
  return (
    <group>
      <group position={[-2.7, 0, -1.9]} raycast={() => null}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.2, 0.3, 0.55]} />
          <meshStandardMaterial color="#8A5A33" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.05, 0.12, 0.42]} />
          <meshStandardMaterial color="#E8C547" flatShading roughness={1} />
        </mesh>
      </group>
      <group position={[2.7, 0, -1.9]} raycast={() => null}>
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

/* ---------- Zone ---------- */

export function PastureZone(props: PastureZoneProps) {
  const { pen, selectedId, onSelect, onFeedPen, onFillWaterTrough, onCollectProduce } = props;
  const readyCount = pen.animals.filter((a) => a.daysUntilProduce <= 0 && !a.isSick && a.hunger > 20).length;
  return (
    <group>
      <Fence />
      <Troughs onFeedPen={onFeedPen} onFillWaterTrough={onFillWaterTrough} />
      {pen.animals.map((a) => (
        <Animal key={a.id} animal={a} selected={selectedId === a.id} onSelect={onSelect} />
      ))}
      {/* Giỏ thu sản phẩm 3D */}
      <group position={[0, 0, -3.4]} raycast={() => null}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.42, 0.32, 0.5, 8]} />
          <meshStandardMaterial color="#A9744F" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.3, 7, 6]} />
          <meshStandardMaterial color="#F5F2EA" flatShading roughness={0.9} />
        </mesh>
        <Label text={readyCount > 0 ? `Thu (${readyCount})` : 'Thu sản phẩm'} position={[0, 1.5, 0]} scale={0.7} />
      </group>
    </group>
  );
}

export default PastureZone;
