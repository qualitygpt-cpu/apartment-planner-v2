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
  const normalize = (deg) => {
    const n = deg % 360;
    return n < 0 ? n + 360 : n;
  };
  const epsilon = 1e-6;
  const prev = normalize(item.rotation || 0);
  const next = normalize(nextRotation || 0);
  const prevQuarter = Math.round(prev / 90) % 2;
  const nextQuarter = Math.round(next / 90) % 2;
  const prevAligned = Math.abs((prev % 90)) < epsilon;
  const nextAligned = Math.abs((next % 90)) < epsilon;

  if (prevAligned && nextAligned && prevQuarter !== nextQuarter) {
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    const prevWidth = item.width;
    item.width = item.height;
    item.height = prevWidth;
    item.x = centerX - item.width / 2;
    item.y = centerY - item.height / 2;
  }

  item.rotation = nextAligned ? 0 : next;
}
