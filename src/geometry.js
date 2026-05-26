export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function rotateByStep(currentDeg, stepDeg = 15) {
  const normalized = (currentDeg + stepDeg) % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function worldToScreen(point, scale) {
  return { x: point.x * scale, y: point.y * scale };
}

export function rectToSvg(rect, scale) {
  return {
    x: rect.x * scale,
    y: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale
  };
}

export function applyRotationWithDimensions(item, nextRotation) {
  const n = (nextRotation || 0) % 360;
  item.rotation = n < 0 ? n + 360 : n;
}
