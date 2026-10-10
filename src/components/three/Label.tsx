import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Chữ nổi 3D (biển tên) — vẽ text lên canvas rồi dùng làm sprite texture.
 * Hỗ trợ tiếng Việt, tự co giãn theo độ dài chữ.
 */

interface LabelProps {
  text: string;
  position?: [number, number, number];
  scale?: number;
  bg?: string;
  fg?: string;
  fontSize?: number;
}

export function Label({
  text,
  position = [0, 2.2, 0],
  scale = 1,
  bg = 'rgba(46, 74, 53, 0.92)',
  fg = '#FFFFFF',
  fontSize = 44,
}: LabelProps) {
  const texture = useMemo(() => {
    const pad = 28;
    const meas = document.createElement('canvas').getContext('2d')!;
    meas.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    const w = Math.ceil(meas.measureText(text).width) + pad * 2;
    const h = fontSize + pad * 2;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Nền bo tròn
    const r = 22;
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, r);
    ctx.fill();
    // Viền
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(2, 2, w - 4, h - 4, r - 2);
    ctx.stroke();
    // Chữ
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [text, bg, fg, fontSize]);

  const aspect = useMemo(() => {
    const img = texture.image as HTMLCanvasElement;
    return img.width / img.height;
  }, [texture]);

  // Chiều cao chuẩn ~0.55 đơn vị world, rộng theo aspect
  const h = 0.55 * scale;
  const w = h * aspect;

  return (
    <sprite position={position} scale={[w, h, 1]} raycast={() => null}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  );
}

export default Label;
