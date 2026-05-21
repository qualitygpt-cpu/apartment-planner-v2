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
}
