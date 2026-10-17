// Module singleton input cho player.
export const playerInput = { joyX: 0, joyZ: 0, keys: new Set<string>() };
export const playerState = { x: 0, z: 2 };

export interface MoveVec { x: number; z: number }

// Gộp joystick và phím WASD/mũi tên, chuẩn hóa độ dài tối đa 1.
export function getMoveVector(): MoveVec {
  let x = playerInput.joyX;
  let z = playerInput.joyZ;

  const keys = playerInput.keys;
  if (keys.has('a') || keys.has('arrowleft')) x -= 1;
  if (keys.has('d') || keys.has('arrowright')) x += 1;
  if (keys.has('w') || keys.has('arrowup')) z -= 1;
  if (keys.has('s') || keys.has('arrowdown')) z += 1;

  const len = Math.hypot(x, z);
  if (len > 1) {
    x /= len;
    z /= len;
  }
  return { x, z };
}
