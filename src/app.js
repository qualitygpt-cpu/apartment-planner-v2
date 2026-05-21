import { createModel, resetFurniture } from './model.js';
import { renderPlan } from './renderPlan.js';
import { renderTree } from './renderTree.js';
import { setupInteractions } from './interactions.js';

const svg = document.getElementById('planSvg');
const treeContainer = document.getElementById('treeContainer');
const statusText = document.getElementById('statusText');
const toggleDimensionsBtn = document.getElementById('toggleDimensionsBtn');
const toggleItemDimensionsBtn = document.getElementById('toggleItemDimensionsBtn');

const model = createModel();

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

toggleDimensionsBtn.addEventListener('click', () => {
  model.showStructureDimensions = !model.showStructureDimensions;
  rerender();
});

toggleItemDimensionsBtn.addEventListener('click', () => {
  model.showItemDimensions = !model.showItemDimensions;
  rerender();
});

rerender();
