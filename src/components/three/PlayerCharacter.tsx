import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerInput, playerState, getMoveVector } from './playerInput';

// Danh sách vật cản: giếng + các công trình theo bố cục làng chữ nhật mới.
const BASE_COLLIDERS: [number, number, number][] = [
  [0, 0, 1.4],      // giếng nước giữa quảng trường
  [0, 5, 1.8],      // trung tâm hành chính
  [-14, -2, 2.5],   // khu ruộng (cụm ô đất)
  [14, 10, 3.0],    // chuồng trại (có hàng rào)
  [15, -8, 1.8],    // cửa hàng
  [15, -2, 1.8],    // chợ làng
  [15, 4, 1.8],     // siêu thị
  [-8, 12, 1.8],    // nhà kho
  [-14, 10, 1.8],   // xưởng chế biến
  [-18, 12, 1.8],   // đội vận tải
];

const HOUSE_COLLIDERS: [number, number, number][] = [];
for (let col = -1; col <= 1; col++) {
  for (let row = -1; row <= 1; row++) {
    HOUSE_COLLIDERS.push([col * 2.75, 11 + row * 2.75, 1.2]);
  }
}
const COLLIDERS: [number, number, number][] = [...BASE_COLLIDERS, ...HOUSE_COLLIDERS];

// Nhân vật nông dân low-poly điều khiển bằng bàn phím/joystick.
export function PlayerCharacter() {
  const g = useRef<THREE.Group>(null!);
  const phase = useRef(0);

  useFrame((_, rawDt) => {
    const grp = g.current;
    if (!grp) return;

    const dt = Math.min(rawDt, 0.05);
    const v = getMoveVector();
    const speed = 3;

    // Di chuyển và cập nhật animation bước chân.
    if (Math.hypot(v.x, v.z) > 0.05) {
      grp.position.x += v.x * speed * dt;
      grp.position.z += v.z * speed * dt;
      grp.rotation.y = Math.atan2(v.x, v.z);
      phase.current += dt * 10;
      grp.position.y = Math.abs(Math.sin(phase.current)) * 0.05;
    } else {
      // Khi đứng yên, hạ dần độ nảy về 0.
      grp.position.y = THREE.MathUtils.lerp(grp.position.y, 0, Math.min(1, dt * 8));
    }

    // Va chạm (a): giới hạn trong nền làng chữ nhật 44x32.
    grp.position.x = THREE.MathUtils.clamp(grp.position.x, -21, 21);
    grp.position.z = THREE.MathUtils.clamp(grp.position.z, -15, 15);

    // Va chạm (b): đẩy ra khỏi các vật cản.
    for (const [cx, cz, r] of COLLIDERS) {
      const dx = grp.position.x - cx;
      const dz = grp.position.z - cz;
      const d = Math.hypot(dx, dz);
      if (d < r && d > 0.0001) {
        grp.position.x = cx + (dx / d) * r;
        grp.position.z = cz + (dz / d) * r;
      }
    }

    // Đồng bộ trạng thái dùng chung.
    playerState.x = grp.position.x;
    playerState.z = grp.position.z;
  });

  return (
    <group ref={g} position={[playerState.x, 0, playerState.z]}>
      {/* Đầu */}
      <mesh position={[0, 0.85, 0]} raycast={() => null}>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshStandardMaterial color="#F2C99B" flatShading roughness={1} />
      </mesh>
      {/* Mũ rơm */}
      <mesh position={[0, 1.05, 0]} raycast={() => null}>
        <coneGeometry args={[0.3, 0.18, 8]} />
        <meshStandardMaterial color="#D9A441" flatShading roughness={1} />
      </mesh>
      {/* Thân / áo */}
      <mesh position={[0, 0.5, 0]} raycast={() => null}>
        <boxGeometry args={[0.36, 0.42, 0.24]} />
        <meshStandardMaterial color="#3E8E41" flatShading roughness={1} />
      </mesh>
      {/* Tay trái */}
      <mesh position={[-0.24, 0.5, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#3E8E41" flatShading roughness={1} />
      </mesh>
      {/* Tay phải */}
      <mesh position={[0.24, 0.5, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#3E8E41" flatShading roughness={1} />
      </mesh>
      {/* Quần */}
      <mesh position={[0, 0.22, 0]} raycast={() => null}>
        <boxGeometry args={[0.32, 0.18, 0.22]} />
        <meshStandardMaterial color="#4A6FA5" flatShading roughness={1} />
      </mesh>
      {/* Chân trái */}
      <mesh position={[-0.1, 0.08, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 8]} />
        <meshStandardMaterial color="#5A3D26" flatShading roughness={1} />
      </mesh>
      {/* Chân phải */}
      <mesh position={[0.1, 0.08, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 8]} />
        <meshStandardMaterial color="#5A3D26" flatShading roughness={1} />
      </mesh>
    </group>
  );
}

export default PlayerCharacter;
