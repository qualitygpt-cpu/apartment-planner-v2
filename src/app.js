import { createModel, resetFurniture, getObjectById, persistLayout } from './model.js';
import { renderPlan } from './renderPlan.js';
import { renderTree } from './renderTree.js';
import { setupInteractions } from './interactions.js';

const svg = document.getElementById('planSvg');
const treeContainer = document.getElementById('treeContainer');
const statusText = document.getElementById('statusText');
const toggleDimensionsBtn = document.getElementById('toggleDimensionsBtn');
const toggleItemDimensionsBtn = document.getElementById('toggleItemDimensionsBtn');
const selectedItemTools = document.getElementById('selectedItemTools');

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
  const rotation = normalizeAngle(obj.rotation || 0);
  const isAxisAligned = Math.abs(rotation % 90) < 1e-6;
  if (!isAxisAligned) {
    statusText.textContent = 'сначала вертикализируйте';
    return;
  }

  const threshold = 0.4;
  const epsilon = 1e-9;
  const objMinX = obj.x;
  const objMaxX = obj.x + obj.width;
  const objMinY = obj.y;
  const objMaxY = obj.y + obj.height;

  const room = model.state.rooms.find((r) => r.id === obj.roomId);
  if (!room) {
    statusText.textContent = 'Не удалось определить помещение';
    return;
  }

  const roomMinX = room.x;
  const roomMaxX = room.x + room.width;
  const roomMinY = room.y;
  const roomMaxY = room.y + room.height;

  const verticalCandidates = [
    { side: 'left', targetX: roomMinX, distance: Math.abs(objMinX - roomMinX) },
    { side: 'right', targetX: roomMaxX - obj.width, distance: Math.abs(roomMaxX - objMaxX) }
  ].filter((candidate) => candidate.distance <= threshold + epsilon);

  const horizontalCandidates = [
    { side: 'top', targetY: roomMinY, distance: Math.abs(objMinY - roomMinY) },
    { side: 'bottom', targetY: roomMaxY - obj.height, distance: Math.abs(roomMaxY - objMaxY) }
  ].filter((candidate) => candidate.distance <= threshold + epsilon);

  if (!verticalCandidates.length && !horizontalCandidates.length) {
    statusText.textContent = 'Объект должен быть не дальше 0.4 м от стены';
    return;
  }

  const snappedSides = [];
  if (verticalCandidates.length) {
    const bestVertical = verticalCandidates.reduce((best, current) => (
      current.distance < best.distance ? current : best
    ));
    obj.x = bestVertical.targetX;
    snappedSides.push(bestVertical.side);
  }

  if (horizontalCandidates.length) {
    const bestHorizontal = horizontalCandidates.reduce((best, current) => (
      current.distance < best.distance ? current : best
    ));
    obj.y = bestHorizontal.targetY;
    snappedSides.push(bestHorizontal.side);
  }

  persistLayout(model.state.items);
  rerender();
  statusText.textContent = `Привязка к стене: ${snappedSides.join('+')}`;
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

function syncSelectedToolsVisibility() {
  const obj = getSelectedMovableItem();
  selectedItemTools.hidden = !obj;
}

function rerender() {
  renderPlan(svg, model);
  renderTree(treeContainer, model, (id) => {
    model.selectedId = id;
    rerender();
  });
  syncDimensionButtons();
  syncSelectedToolsVisibility();
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
