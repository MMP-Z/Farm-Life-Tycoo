import React from 'react';
import { OrderItem } from '../../../types/farmSystem';
import { Label } from '../Label';

/* ---------- Siêu thị 3D: bảng đơn hàng ---------- */

export interface SupermarketZoneProps {
  orders: OrderItem[];
  currentDay: number;
  inventory: { itemId: string; quantity: number }[];
  onSelectOrder: (o: OrderItem | null) => void;
}

export function SupermarketZone({ orders, currentDay, inventory, onSelectOrder }: SupermarketZoneProps) {
  const select = (o: OrderItem) => (e: any) => {
    e.stopPropagation();
    onSelectOrder(o);
  };

  return (
    <group>
      <Label text="Siêu Thị" position={[0, 4.6, -3.5]} scale={1.1} />

      {/* Tòa siêu thị */}
      <group position={[0, 0, -4]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[4.5, 2.4, 3]} />
          <meshStandardMaterial color="#E8E0D0" flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[5, 0.3, 3.5]} />
          <meshStandardMaterial color="#2E6FA5" flatShading roughness={0.8} />
        </mesh>
        {/* Cửa kính */}
        <mesh position={[-1, 0.9, 1.55]}>
          <boxGeometry args={[1.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#B8D8E8" flatShading roughness={0.4} />
        </mesh>
        <mesh position={[1, 0.9, 1.55]}>
          <boxGeometry args={[1.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#B8D8E8" flatShading roughness={0.4} />
        </mesh>
      </group>

      {/* Bảng đơn hàng */}
      <group position={[0, 0, 0.5]}>
        {/* Chân bảng */}
        <mesh position={[-1.2, 0.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
          <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
        </mesh>
        <mesh position={[1.2, 0.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
          <meshStandardMaterial color="#7A5230" flatShading roughness={1} />
        </mesh>
        {/* Mặt bảng */}
        <mesh position={[0, 2.0, 0]}>
          <boxGeometry args={[3.2, 2.0, 0.12]} />
          <meshStandardMaterial color="#5A3A22" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 2.0, 0.08]}>
          <boxGeometry args={[2.9, 1.7, 0.05]} />
          <meshStandardMaterial color="#F5F0E0" flatShading roughness={1} />
        </mesh>

        {orders.length === 0 && (
          <Label text="Chưa có đơn hàng" position={[0, 2.0, 0.15]} scale={0.6} bg="rgba(255,255,255,0.9)" fg="#888" />
        )}

        {/* Thẻ đơn hàng */}
        {orders.slice(0, 4).map((order, i) => {
          const daysLeft = Math.max(0, order.deadlineDay - currentDay);
          const canFulfill = order.requirements.every((req) => {
            const inStock = inventory.find((inv) => inv.itemId === req.itemId)?.quantity || 0;
            return inStock >= req.amount;
          });
          const x = (i % 2 - 0.5) * 1.45;
          const y = 2.35 - Math.floor(i / 2) * 0.85;
          return (
            <group
              key={order.id}
              position={[x, y, 0.15]}
              onClick={select(order)}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'auto')}
            >
              <mesh>
                <boxGeometry args={[1.3, 0.7, 0.06]} />
                <meshStandardMaterial color={canFulfill ? '#E8F5E8' : '#F5E8E8'} flatShading roughness={0.9} />
              </mesh>
              <Label
                text={`${order.customerName}`}
                position={[0, 0.18, 0.05]}
                scale={0.38}
                bg="rgba(255,255,255,0)"
                fg="#2E4A35"
              />
              <Label
                text={`+${order.rewardMoney} · ${daysLeft} ngày`}
                position={[0, -0.15, 0.05]}
                scale={0.36}
                bg="rgba(255,255,255,0)"
                fg={canFulfill ? '#2E7A35' : '#A44'}
              />
            </group>
          );
        })}
      </group>
      <Label text="Bảng đơn hàng" position={[0, 3.4, 0.5]} scale={0.7} />
    </group>
  );
}
