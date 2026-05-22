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
  state.engineering.forEach((eng) => addRect(root, eng, scale, `engineering ${eng.type}`, selectedId));

  [...state.items].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).forEach((item) => {
    const g = el('g', { 'data-id': item.id, class: 'movable-wrap' });
    const centerX = (item.x + item.width / 2) * scale;
    const centerY = (item.y + item.height / 2) * scale;
    g.setAttribute('transform', `rotate(${item.rotation} ${centerX} ${centerY})`);
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
