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

function addDimensionLine(group, scale, x1m, y1m, x2m, y2m, label, className = 'dimension') {
  const x1 = x1m * scale;
  const y1 = y1m * scale;
  const x2 = x2m * scale;
  const y2 = y2m * scale;

  group.appendChild(el('line', { x1, y1, x2, y2, class: className }));

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const text = el('text', { x: midX, y: midY - 4, class: 'dimension-label', 'text-anchor': 'middle' });
  text.textContent = label;
  group.appendChild(text);
}

function metersLabel(value) {
  return `${value.toFixed(2)} м`;
}

function drawPlanDimensions(group, state, scale) {
  const rooms = state.rooms;
  const openings = [...state.doorOpenings, ...state.windows];

  rooms.forEach((room) => {
    addDimensionLine(group, scale, room.x, room.y - 0.15, room.x + room.width, room.y - 0.15, metersLabel(room.width));
    addDimensionLine(group, scale, room.x - 0.15, room.y, room.x - 0.15, room.y + room.height, metersLabel(room.height));

    const roomOpenings = openings.filter((o) => {
      if (o.type === 'window') return o.roomId === room.id;
      return o.roomA === room.id || o.roomB === room.id;
    });

    roomOpenings.forEach((o) => {
      const isHorizontal = o.width >= o.height;
      if (isHorizontal) {
        const edgeDist = o.x - room.x;
        if (edgeDist >= 0 && edgeDist <= room.width) {
          addDimensionLine(group, scale, room.x, o.y - 0.08, o.x, o.y - 0.08, metersLabel(edgeDist), 'dimension-sub');
        }
        addDimensionLine(group, scale, o.x, o.y - 0.02, o.x + o.width, o.y - 0.02, metersLabel(o.width), 'dimension-opening');
      } else {
        const edgeDist = o.y - room.y;
        if (edgeDist >= 0 && edgeDist <= room.height) {
          addDimensionLine(group, scale, o.x - 0.08, room.y, o.x - 0.08, o.y, metersLabel(edgeDist), 'dimension-sub');
        }
        addDimensionLine(group, scale, o.x + o.width + 0.02, o.y, o.x + o.width + 0.02, o.y + o.height, metersLabel(o.height), 'dimension-opening');
      }
    });
  });
}

function drawItemDimensions(group, items, scale) {
  items.forEach((item) => {
    addDimensionLine(group, scale, item.x, item.y - 0.08, item.x + item.width, item.y - 0.08, metersLabel(item.width), 'dimension-item');
    addDimensionLine(group, scale, item.x - 0.08, item.y, item.x - 0.08, item.y + item.height, metersLabel(item.height), 'dimension-item');
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

  [...state.items]
    .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    .forEach((item) => {
      const g = el('g', { 'data-id': item.id, class: 'movable-wrap' });
      const centerX = (item.x + item.width / 2) * scale;
      const centerY = (item.y + item.height / 2) * scale;
      g.setAttribute('transform', `rotate(${item.rotation} ${centerX} ${centerY})`);
      const style = TEXTURES[item.textureId] || (item.category === 'appliance' ? TEXTURES.defaultAppliance : TEXTURES.defaultFurniture);
      const rect = addRect(g, item, scale, `${item.category} item`, selectedId);
      rect.setAttribute('fill', style.fill);
      rect.setAttribute('stroke', style.stroke);

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
