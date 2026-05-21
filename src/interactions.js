import { clamp, rotateByStep } from './geometry.js';
import { getObjectById, persistLayout } from './model.js';

export function setupInteractions({ svg, model, rerender, setStatus }) {
  const minScale = 0.6;
  const maxScale = 2.2;
  const initial = { ...model.viewBox };
  let drag = null;

  function zoom(factor, cx = model.viewBox.x + model.viewBox.width / 2, cy = model.viewBox.y + model.viewBox.height / 2) {
    const nextWidth = clamp(model.viewBox.width / factor, initial.width / maxScale, initial.width / minScale);
    const ratio = nextWidth / model.viewBox.width;
    const nextHeight = model.viewBox.height * ratio;
    model.viewBox.x = cx - (cx - model.viewBox.x) * ratio;
    model.viewBox.y = cy - (cy - model.viewBox.y) * ratio;
    model.viewBox.width = nextWidth;
    model.viewBox.height = nextHeight;
    rerender();
  }

  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 1.1 : 0.9, model.viewBox.x + e.offsetX, model.viewBox.y + e.offsetY);
  }, { passive: false });

  svg.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('[data-id]');
    const id = target?.dataset.id || null;
    if (id) model.selectedId = id;

    const obj = id ? getObjectById(model, id) : null;
    const movable = obj && obj.movable && model.mode === 'edit';
    drag = {
      mode: movable ? 'move-item' : 'pan',
      id,
      startX: e.clientX,
      startY: e.clientY,
      originX: model.viewBox.x,
      originY: model.viewBox.y,
      itemX: obj?.x,
      itemY: obj?.y
    };
    svg.setPointerCapture(e.pointerId);
    rerender();
  });

  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.mode === 'pan') {
      model.viewBox.x = drag.originX - dx;
      model.viewBox.y = drag.originY - dy;
      rerender();
      return;
    }

    const obj = getObjectById(model, drag.id);
    if (!obj) return;
    const metersPerPx = (model.viewBox.width / svg.clientWidth) / model.state.meta.scalePxPerMeter;
    obj.x = drag.itemX + dx * metersPerPx;
    obj.y = drag.itemY + dy * metersPerPx;
    rerender();
  });

  svg.addEventListener('pointerup', () => {
    if (drag?.mode === 'move-item') persistLayout(model.state.items);
    drag = null;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'r' || !model.selectedId || model.mode !== 'edit') return;
    const obj = getObjectById(model, model.selectedId);
    if (!obj?.movable) return;
    obj.rotation = rotateByStep(obj.rotation, 15);
    persistLayout(model.state.items);
    rerender();
  });

  return {
    zoomIn: () => zoom(1.15),
    zoomOut: () => zoom(0.85),
    resetView: () => {
      model.viewBox = { ...initial };
      rerender();
    },
    setMode: (mode) => {
      model.mode = mode;
      setStatus(mode === 'edit' ? 'Редактирование' : 'Просмотр');
      rerender();
    }
  };
}
