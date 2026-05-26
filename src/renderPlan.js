import { TEXTURES } from '../assets/textures.js';
import { rectToSvg } from './geometry.js';

const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function addRect(group, obj, scale, cssClass, selectedId) {
  const r = rectToSvg(obj, scale);
  const rect = el('rect', { x: r.x, y: r.y, width: r.width, height: r.height, class: cssClass, 'data-id': obj.id });
  if (selectedId === obj.id) rect.classList.add('selected');
  group.appendChild(rect);
  return rect;
}


function addRiserCircle(group, eng, scale, selectedId) {
  const circle = el('circle', {
    cx: (eng.x + eng.width / 2) * scale,
    cy: (eng.y + eng.height / 2) * scale,
    r: (eng.width / 2) * scale,
    class: `engineering ${eng.type}`,
    'data-id': eng.id
  });
  if (selectedId === eng.id) circle.classList.add('selected');
  group.appendChild(circle);
  return circle;
}

function metersLabel(value) {
  return `${Math.max(0, value).toFixed(2)} м`;
}

function addTick(group, x, y, axis, className) {
  const tick = 4;
  if (axis === 'x') {
    group.appendChild(el('line', { x1: x, y1: y - tick, x2: x, y2: y + tick, class: className }));
  } else {
    group.appendChild(el('line', { x1: x - tick, y1: y, x2: x + tick, y2: y, class: className }));
  }
}

function addLinearDimension(group, scale, spec) {
  const {
    axis,
    x1,
    y1,
    x2,
    y2,
    dimX,
    dimY,
    label,
    className = 'dimension'
  } = spec;

  const sx1 = x1 * scale;
  const sy1 = y1 * scale;
  const sx2 = x2 * scale;
  const sy2 = y2 * scale;
  const sdx = dimX * scale;
  const sdy = dimY * scale;

  if (axis === 'x') {
    group.appendChild(el('line', { x1: sx1, y1: sy1, x2: sx1, y2: sdy, class: 'dimension-ext' }));
    group.appendChild(el('line', { x1: sx2, y1: sy2, x2: sx2, y2: sdy, class: 'dimension-ext' }));
    group.appendChild(el('line', { x1: sx1, y1: sdy, x2: sx2, y2: sdy, class: className }));
    addTick(group, sx1, sdy, axis, className);
    addTick(group, sx2, sdy, axis, className);
    const text = el('text', { x: (sx1 + sx2) / 2, y: sdy - 6, class: 'dimension-label', 'text-anchor': 'middle' });
    text.textContent = label;
    group.appendChild(text);
  } else {
    group.appendChild(el('line', { x1: sx1, y1: sy1, x2: sdx, y2: sy1, class: 'dimension-ext' }));
    group.appendChild(el('line', { x1: sx2, y1: sy2, x2: sdx, y2: sy2, class: 'dimension-ext' }));
    group.appendChild(el('line', { x1: sdx, y1: sy1, x2: sdx, y2: sy2, class: className }));
    addTick(group, sdx, sy1, axis, className);
    addTick(group, sdx, sy2, axis, className);
    const text = el('text', { x: sdx + 6, y: (sy1 + sy2) / 2, class: 'dimension-label', 'text-anchor': 'start' });
    text.textContent = label;
    group.appendChild(text);
  }
}

function drawPlanDimensions(group, state, scale) {
  const openings = [...state.doorOpenings, ...state.windows];
  const step = 0.32;
  const lanesBySide = new Map();

  const minX = Math.min(...state.rooms.map((r) => r.x));
  const minY = Math.min(...state.rooms.map((r) => r.y));
  const maxX = Math.max(...state.rooms.map((r) => r.x + r.width));
  const maxY = Math.max(...state.rooms.map((r) => r.y + r.height));
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const reserveLane = (side, coordinate) => {
    const key = `${side}:${coordinate.toFixed(3)}`;
    const lane = (lanesBySide.get(key) || 0) + 1;
    lanesBySide.set(key, lane);
    return lane;
  };

  const placeOnSide = (side, coordinate, lane) => {
    if (side === 'top') return coordinate - step * lane;
    if (side === 'bottom') return coordinate + step * lane;
    if (side === 'left') return coordinate - step * lane;
    return coordinate + step * lane;
  };

  state.rooms.forEach((room) => {
    const roomCenterX = room.x + room.width / 2;
    const roomCenterY = room.y + room.height / 2;
    const horizontalSide = roomCenterY <= midY ? 'top' : 'bottom';
    const verticalSide = roomCenterX <= midX ? 'left' : 'right';

    const roomHorizontalLane = reserveLane(horizontalSide, horizontalSide === 'top' ? room.y : room.y + room.height);
    addLinearDimension(group, scale, {
      axis: 'x', x1: room.x, y1: room.y, x2: room.x + room.width, y2: room.y,
      dimX: room.x,
      dimY: placeOnSide(horizontalSide, horizontalSide === 'top' ? room.y : room.y + room.height, roomHorizontalLane),
      label: metersLabel(room.width), className: 'dimension'
    });

    const roomVerticalLane = reserveLane(verticalSide, verticalSide === 'left' ? room.x : room.x + room.width);
    addLinearDimension(group, scale, {
      axis: 'y', x1: room.x, y1: room.y, x2: room.x, y2: room.y + room.height,
      dimX: placeOnSide(verticalSide, verticalSide === 'left' ? room.x : room.x + room.width, roomVerticalLane),
      dimY: room.y,
      label: metersLabel(room.height), className: 'dimension'
    });

    const roomOpenings = openings.filter((o) => (o.type === 'window' ? o.roomId === room.id : (o.roomA === room.id || o.roomB === room.id)));

    roomOpenings.forEach((o) => {
      const horizontal = o.width >= o.height;
      if (horizontal) {
        const topDist = Math.abs(o.y - room.y);
        const bottomDist = Math.abs(o.y + o.height - (room.y + room.height));
        const side = topDist <= bottomDist ? 'top' : 'bottom';
        const edge = side === 'top' ? room.y : room.y + room.height;
        const lane = reserveLane(side, edge);
        const laneY = placeOnSide(side, edge, lane);
        addLinearDimension(group, scale, {
          axis: 'x', x1: room.x, y1: side === 'top' ? room.y : room.y + room.height, x2: o.x, y2: side === 'top' ? room.y : room.y + room.height,
          dimX: room.x, dimY: laneY,
          label: metersLabel(o.x - room.x), className: 'dimension-sub'
        });
        addLinearDimension(group, scale, {
          axis: 'x', x1: o.x, y1: o.y, x2: o.x + o.width, y2: o.y,
          dimX: o.x, dimY: laneY + (side === 'top' ? -0.12 : 0.12),
          label: metersLabel(o.width), className: 'dimension-opening'
        });
      } else {
        const leftDist = Math.abs(o.x - room.x);
        const rightDist = Math.abs(o.x + o.width - (room.x + room.width));
        const side = leftDist <= rightDist ? 'left' : 'right';
        const edge = side === 'left' ? room.x : room.x + room.width;
        const lane = reserveLane(side, edge);
        const laneX = placeOnSide(side, edge, lane);
        addLinearDimension(group, scale, {
          axis: 'y', x1: side === 'left' ? room.x : room.x + room.width, y1: room.y, x2: side === 'left' ? room.x : room.x + room.width, y2: o.y,
          dimX: laneX, dimY: room.y,
          label: metersLabel(o.y - room.y), className: 'dimension-sub'
        });
        addLinearDimension(group, scale, {
          axis: 'y', x1: o.x + o.width, y1: o.y, x2: o.x + o.width, y2: o.y + o.height,
          dimX: laneX + (side === 'left' ? -0.12 : 0.12), dimY: o.y,
          label: metersLabel(o.height), className: 'dimension-opening'
        });
      }
    });
  });
}

function drawItemDimensions(group, items, scale) {
  const step = 0.12;
  items.forEach((item, index) => {
    const lane = 1 + (index % 2);
    addLinearDimension(group, scale, {
      axis: 'x', x1: item.x, y1: item.y, x2: item.x + item.width, y2: item.y,
      dimX: item.x, dimY: item.y - step * lane,
      label: metersLabel(item.width), className: 'dimension-item'
    });
    addLinearDimension(group, scale, {
      axis: 'y', x1: item.x, y1: item.y, x2: item.x, y2: item.y + item.height,
      dimX: item.x - step * lane, dimY: item.y,
      label: metersLabel(item.height), className: 'dimension-item'
    });
  });
}


function isHorizontalDoor(door) {
  return door.width >= door.height;
}

function getDoorLeafGeometry(door) {
  const hinge = door.swing?.hinge || 'start';
  if (isHorizontalDoor(door)) {
    if (hinge === 'end') {
      return { hingePoint: { x: door.x + door.width, y: door.y }, closedVector: { x: -door.width, y: 0 }, leafLength: door.width };
    }
    return { hingePoint: { x: door.x, y: door.y }, closedVector: { x: door.width, y: 0 }, leafLength: door.width };
  }
  if (hinge === 'end') {
    return { hingePoint: { x: door.x, y: door.y + door.height }, closedVector: { x: 0, y: -door.height }, leafLength: door.height };
  }
  return { hingePoint: { x: door.x, y: door.y }, closedVector: { x: 0, y: door.height }, leafLength: door.height };
}

function rotateVector(vector, angleDeg) {
  const a = angleDeg * Math.PI / 180;
  const c = Math.cos(a);
  const si = Math.sin(a);
  return { x: vector.x * c - vector.y * si, y: vector.x * si + vector.y * c };
}

function getDoorEndpointAtAngle(door, angleDeg) {
  const { hingePoint, closedVector } = getDoorLeafGeometry(door);
  const rv = rotateVector(closedVector, angleDeg);
  return { x: hingePoint.x + rv.x, y: hingePoint.y + rv.y };
}

function pointInRect(p, rect, eps) {
  return p.x >= rect.x - eps && p.x <= rect.x + rect.width + eps && p.y >= rect.y - eps && p.y <= rect.y + rect.height + eps;
}

function segmentsIntersect(a, b, c, d, eps) {
  const cross = (u, v, w) => (v.x - u.x) * (w.y - u.y) - (v.y - u.y) * (w.x - u.x);
  const onSeg = (u, v, w) => Math.min(u.x, v.x) - eps <= w.x && w.x <= Math.max(u.x, v.x) + eps && Math.min(u.y, v.y) - eps <= w.y && w.y <= Math.max(u.y, v.y) + eps;
  const d1 = cross(a, b, c); const d2 = cross(a, b, d); const d3 = cross(c, d, a); const d4 = cross(c, d, b);
  if (((d1 > eps && d2 < -eps) || (d1 < -eps && d2 > eps)) && ((d3 > eps && d4 < -eps) || (d3 < -eps && d4 > eps))) return true;
  if (Math.abs(d1) <= eps && onSeg(a, b, c)) return true;
  if (Math.abs(d2) <= eps && onSeg(a, b, d)) return true;
  if (Math.abs(d3) <= eps && onSeg(c, d, a)) return true;
  if (Math.abs(d4) <= eps && onSeg(c, d, b)) return true;
  return false;
}

function lineIntersectsRect(p1, p2, rect, epsilon = 1e-6) {
  if (pointInRect(p1, rect, epsilon) || pointInRect(p2, rect, epsilon)) return true;
  const a = { x: rect.x, y: rect.y };
  const b = { x: rect.x + rect.width, y: rect.y };
  const c = { x: rect.x + rect.width, y: rect.y + rect.height };
  const d = { x: rect.x, y: rect.y + rect.height };
  return segmentsIntersect(p1, p2, a, b, epsilon)
    || segmentsIntersect(p1, p2, b, c, epsilon)
    || segmentsIntersect(p1, p2, c, d, epsilon)
    || segmentsIntersect(p1, p2, d, a, epsilon);
}

function rectsTouchOrIntersect(a, b, eps = 1e-6) {
  return a.x <= b.x + b.width + eps && a.x + a.width >= b.x - eps && a.y <= b.y + b.height + eps && a.y + a.height >= b.y - eps;
}

function doorHostWallShouldBeIgnored(door, wall) {
  return rectsTouchOrIntersect(door, wall, 1e-4);
}

function doorIntersectsBlockingWalls(door, angleDeg, walls) {
  const { hingePoint } = getDoorLeafGeometry(door);
  const end = getDoorEndpointAtAngle(door, angleDeg);
  return walls.some((wall) => !doorHostWallShouldBeIgnored(door, wall) && lineIntersectsRect(hingePoint, end, wall, 1e-5));
}

function findMaxSafeDoorAngle(door, walls) {
  const requested = Math.min(150, Math.max(0, door.swing?.maxAngleDeg ?? 150));
  for (let angle = requested; angle >= 0; angle -= 1) {
    const signedAngle = angle * (door.swing?.openSign ?? 1);
    if (!doorIntersectsBlockingWalls(door, signedAngle, walls)) return signedAngle;
  }
  return 0;
}

function drawDoorSwings(group, state, scale) {
  state.doorOpenings.forEach((door) => {
    if (!door.swing?.enabled) return;
    const { hingePoint, closedVector, leafLength } = getDoorLeafGeometry(door);
    const openAngle = findMaxSafeDoorAngle(door, state.walls);
    const openVector = rotateVector(closedVector, openAngle);
    const closedEnd = { x: hingePoint.x + closedVector.x, y: hingePoint.y + closedVector.y };
    const openEnd = { x: hingePoint.x + openVector.x, y: hingePoint.y + openVector.y };

    group.appendChild(el('line', {
      x1: hingePoint.x * scale,
      y1: hingePoint.y * scale,
      x2: openEnd.x * scale,
      y2: openEnd.y * scale,
      class: 'door-leaf-open'
    }));

    group.appendChild(el('path', {
      d: `M ${closedEnd.x * scale} ${closedEnd.y * scale} A ${leafLength * scale} ${leafLength * scale} 0 0 ${door.swing.openSign > 0 ? 1 : 0} ${openEnd.x * scale} ${openEnd.y * scale}`,
      class: 'door-swing-arc'
    }));
  });
}

export function renderPlan(svg, model) {
  const { state, selectedId } = model;
  const scale = state.meta.scalePxPerMeter;
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `${model.viewBox.x} ${model.viewBox.y} ${model.viewBox.width} ${model.viewBox.height}`);

  const root = el('g');
  svg.appendChild(root);

  state.rooms.forEach((room) => {
    const rect = addRect(root, room, scale, 'room', selectedId);
    rect.setAttribute('fill', room.fill);
    const label = el('text', {
      x: (room.x + room.width / 2) * scale,
      y: (room.y + room.height / 2) * scale,
      class: 'room-label',
      'text-anchor': 'middle'
    });
    label.textContent = room.label;
    root.appendChild(label);
  });

  state.walls.forEach((wall) => addRect(root, wall, scale, wall.wallKind === 'bearing' ? 'wall-bearing' : 'wall-partition', selectedId));
  state.doorOpenings.forEach((door) => addRect(root, door, scale, 'opening-door', selectedId));
  state.windows.forEach((win) => addRect(root, win, scale, 'opening-window', selectedId));
  state.engineering.forEach((eng) => {
    if (eng.type === 'riser') {
      addRiserCircle(root, eng, scale, selectedId);
      return;
    }
    addRect(root, eng, scale, `engineering ${eng.type}`, selectedId);
  });

  if (model.showDoorSwings) {
    const doorSwingGroup = el('g', { class: 'door-swing-group' });
    drawDoorSwings(doorSwingGroup, state, scale);
    root.appendChild(doorSwingGroup);
  }

  [...state.items].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).forEach((item) => {
    const g = el('g', { 'data-id': item.id, class: 'movable-wrap' });
    const centerX = (item.x + item.width / 2) * scale;
    const centerY = (item.y + item.height / 2) * scale;
    const sofaOrientationOffset = item.id === 'f-sofa' && item.height > item.width ? 90 : 0;
    g.setAttribute('transform', `rotate(${(item.rotation || 0) + sofaOrientationOffset} ${centerX} ${centerY})`);
    if (item.id === 'f-sofa') {
      const r = rectToSvg(item, scale);
      const image = el('image', {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        href: './assets/sofa-corner.png',
        preserveAspectRatio: 'none'
      });
      g.appendChild(image);
      const border = el('rect', {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        fill: 'none',
        stroke: '#3b2e2a',
        'stroke-width': 1
      });
      if (selectedId === item.id) border.classList.add('selected');
      g.appendChild(border);
    } else {
      const style = TEXTURES[item.textureId] || (item.category === 'appliance' ? TEXTURES.defaultAppliance : TEXTURES.defaultFurniture);
      const rect = addRect(g, item, scale, `${item.category} item`, selectedId);
      rect.setAttribute('fill', style.fill);
      rect.setAttribute('stroke', style.stroke);
    }
    const t = el('text', { x: centerX, y: centerY, class: 'item-label', 'text-anchor': 'middle' });
    t.textContent = item.name;
    g.appendChild(t);
    root.appendChild(g);
  });

  if (model.showStructureDimensions) {
    const dimensionGroup = el('g', { class: 'dimension-group' });
    drawPlanDimensions(dimensionGroup, state, scale);
    root.appendChild(dimensionGroup);
  }

  if (model.showItemDimensions) {
    const itemDimensionGroup = el('g', { class: 'dimension-group item-dimensions' });
    drawItemDimensions(itemDimensionGroup, state.items, scale);
    root.appendChild(itemDimensionGroup);
  }
}
