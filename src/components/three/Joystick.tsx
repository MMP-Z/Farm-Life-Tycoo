import { playerInput } from './playerInput';
import React, { useRef } from 'react';

// Joystick ảo 2D cho game mobile. Chỉ dùng Pointer Events.
export default function Joystick() {
  const knobRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    updateVector(e);
  };

  const updateVector = (e: React.PointerEvent<HTMLDivElement>) => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const max = 40;
    if (dist > max) {
      dx = (dx / dist) * max;
      dy = (dy / dist) * max;
    }
    playerInput.joyX = dx / max;
    playerInput.joyZ = dy / max;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateVector(e);
  };

  const release = () => {
    draggingRef.current = false;
    playerInput.joyX = 0;
    playerInput.joyZ = 0;
    if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
  };

  const styleBase: React.CSSProperties = {
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      style={styleBase}
      className="absolute bottom-6 left-6 z-30 w-[110px] h-[110px] rounded-full bg-white/30 border-2 border-white/60"
    >
      <div
        ref={knobRef}
        className="absolute top-1/2 left-1/2 w-[48px] h-[48px] rounded-full bg-white/80 shadow"
        style={{ transform: 'translate(0px, 0px)', marginLeft: -24, marginTop: -24 }}
      />
    </div>
  );
}
