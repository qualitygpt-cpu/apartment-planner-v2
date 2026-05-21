import { APARTMENT_DATA } from '../data/apartment.js';

const STORAGE_KEY = 'apartmentPlanner.movableItems.v1';

export function createModel() {
  const state = structuredClone(APARTMENT_DATA);
  const initialItems = structuredClone(APARTMENT_DATA.items);
  applyStoredLayout(state.items);

  return {
    state,
    initialItems,
    mode: 'view',
    selectedId: null,
    viewBox: { x: 0, y: 0, width: 1200, height: 860 }
  };
}

export function applyStoredLayout(items) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    items.forEach((item) => {
      const patch = parsed[item.id];
      if (patch) {
        item.x = patch.x;
        item.y = patch.y;
        item.rotation = patch.rotation;
      }
    });
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function persistLayout(items) {
  const payload = Object.fromEntries(items.map((item) => [
    item.id,
    { x: item.x, y: item.y, rotation: item.rotation }
  ]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function resetFurniture(model) {
  model.state.items = structuredClone(model.initialItems);
  localStorage.removeItem(STORAGE_KEY);
}

export function getSelectableObjects(model) {
  const s = model.state;
  return [...s.rooms, ...s.walls, ...s.doorOpenings, ...s.windows, ...s.engineering, ...s.items];
}

export function getObjectById(model, id) {
  return getSelectableObjects(model).find((obj) => obj.id === id) || null;
}
