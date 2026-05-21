import { createModel, resetFurniture, getObjectById, persistLayout } from './model.js';
import { renderPlan } from './renderPlan.js';
import { renderTree } from './renderTree.js';
import { setupInteractions } from './interactions.js';

const svg = document.getElementById('planSvg');
const treeContainer = document.getElementById('treeContainer');
const statusText = document.getElementById('statusText');
const toggleDimensionsBtn = document.getElementById('toggleDimensionsBtn');
const toggleItemDimensionsBtn = document.getElementById('toggleItemDimensionsBtn');

const model = createModel();

function normalizeAngle(deg) {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
}

function getSelectedMovableItem() {
  if (!model.selectedId) return null;
  const obj = getObjectById(model, model.selectedId);
  return obj?.movable ? obj : null;
}

function applyRotation(updater) {
  const obj = getSelectedMovableItem();
  if (!obj || model.mode !== 'edit') {
    statusText.textContent = 'Выберите movable-объект в режиме редактирования';
    return;
  }
  obj.rotation = normalizeAngle(updater(obj.rotation || 0));
  persistLayout(model.state.items);
  rerender();
}

function snapSelectedToNearestWall() {
  const obj = getSelectedMovableItem();
  if (!obj || model.mode !== 'edit') {
    statusText.textContent = 'Выберите movable-объект в режиме редактирования';
    return;
  }
  if (!obj.snapToWall) {
    statusText.textContent = 'Для этого объекта привязка к стене отключена';
    return;
  }

  const cx = obj.x + obj.width / 2;
  const cy = obj.y + obj.height / 2;
  const room = model.state.rooms.find((r) => r.id === obj.roomId);
  if (!room) return;

  const candidates = [
    { side: 'left', dist: Math.abs(cx - room.x), x: room.x, y: obj.y },
    { side: 'right', dist: Math.abs(room.x + room.width - cx), x: room.x + room.width - obj.width, y: obj.y },
    { side: 'top', dist: Math.abs(cy - room.y), x: obj.x, y: room.y },
    { side: 'bottom', dist: Math.abs(room.y + room.height - cy), x: obj.x, y: room.y + room.height - obj.height }
  ];

  candidates.sort((a, b) => a.dist - b.dist);
  const nearest = candidates[0];
  obj.x = nearest.x;
  obj.y = nearest.y;

  if (nearest.side === 'left' || nearest.side === 'right') {
    obj.rotation = normalizeAngle(Math.round((obj.rotation || 0) / 90) * 90);
  } else {
    obj.rotation = normalizeAngle(90 + Math.round(((obj.rotation || 0) - 90) / 90) * 90);
  }

  persistLayout(model.state.items);
  rerender();
  statusText.textContent = `Объект прижат к стене (${nearest.side})`;
}

function formatFurnitureExport(items) {
  const payload = items.map((item) => ({
    ...item,
    x: Number(item.x.toFixed(3)),
    y: Number(item.y.toFixed(3)),
    rotation: Number(item.rotation.toFixed(2))
  }));
  return `items: ${JSON.stringify(payload, null, 2)}`;
}

async function exportFurnitureLayout() {
  const text = formatFurnitureExport(model.state.items);
  await navigator.clipboard.writeText(text);
  statusText.textContent = 'Экспорт мебели скопирован в буфер';
}

function syncDimensionButtons() {
  toggleDimensionsBtn.textContent = `Размеры: ${model.showStructureDimensions ? 'вкл' : 'выкл'}`;
  toggleItemDimensionsBtn.textContent = `Размеры мебели: ${model.showItemDimensions ? 'вкл' : 'выкл'}`;
}

function rerender() {
  renderPlan(svg, model);
  renderTree(treeContainer, model, (id) => {
    model.selectedId = id;
    rerender();
  });
  syncDimensionButtons();
}

const controls = setupInteractions({
  svg,
  model,
  rerender,
  setStatus: (text) => {
    statusText.textContent = text;
  }
});

document.getElementById('viewModeBtn').addEventListener('click', () => {
  controls.setMode('view');
  document.getElementById('viewModeBtn').classList.add('active');
  document.getElementById('editModeBtn').classList.remove('active');
});

document.getElementById('editModeBtn').addEventListener('click', () => {
  controls.setMode('edit');
  document.getElementById('editModeBtn').classList.add('active');
  document.getElementById('viewModeBtn').classList.remove('active');
});

document.getElementById('zoomInBtn').addEventListener('click', controls.zoomIn);
document.getElementById('zoomOutBtn').addEventListener('click', controls.zoomOut);
document.getElementById('resetViewBtn').addEventListener('click', controls.resetView);
document.getElementById('resetFurnitureBtn').addEventListener('click', () => {
  resetFurniture(model);
  rerender();
});

document.getElementById('exportFurnitureBtn').addEventListener('click', async () => {
  try {
    await exportFurnitureLayout();
  } catch {
    statusText.textContent = 'Не удалось скопировать экспорт мебели';
  }
});


document.getElementById('rotate90Btn').addEventListener('click', () => {
  applyRotation((current) => current + 90);
});

document.getElementById('rotateAngleBtn').addEventListener('click', () => {
  const raw = prompt('Угол поворота (в градусах):', '25');
  if (raw === null) return;
  const delta = Number(raw.replace(',', '.'));
  if (Number.isNaN(delta)) {
    statusText.textContent = 'Некорректный угол';
    return;
  }
  applyRotation((current) => current + delta);
});

document.getElementById('alignHBtn').addEventListener('click', () => {
  applyRotation(() => 0);
});

document.getElementById('alignVBtn').addEventListener('click', () => {
  applyRotation(() => 90);
});

document.getElementById('snapWallBtn').addEventListener('click', () => {
  snapSelectedToNearestWall();
});

toggleDimensionsBtn.addEventListener('click', () => {
  model.showStructureDimensions = !model.showStructureDimensions;
  rerender();
});

toggleItemDimensionsBtn.addEventListener('click', () => {
  model.showItemDimensions = !model.showItemDimensions;
  rerender();
});

rerender();
