export function renderTree(container, model, onSelect, onEditDimensions) {
  const byRoom = Object.fromEntries(model.state.rooms.map((r) => [r.id, { room: r, furniture: [], appliances: [], engineering: [], openings: [] }]));
  model.state.items.forEach((i) => (i.category === 'appliance' ? byRoom[i.roomId].appliances : byRoom[i.roomId].furniture).push(i));
  model.state.engineering.forEach((e) => byRoom[e.roomId]?.engineering.push(e));
  model.state.doorOpenings.forEach((d) => {
    if (byRoom[d.roomA]) byRoom[d.roomA].openings.push(d);
  });
  model.state.windows.forEach((w) => byRoom[w.roomId]?.openings.push(w));

  container.innerHTML = '';
  Object.values(byRoom).forEach(({ room, furniture, appliances, engineering, openings }) => {
    const details = document.createElement('details');
    details.open = true;
    const summary = document.createElement('summary');
    summary.textContent = room.name;
    summary.className = model.selectedId === room.id ? 'selected-tree' : '';
    summary.dataset.id = room.id;
    details.appendChild(summary);

    details.appendChild(block('Мебель', furniture, model.selectedId));
    details.appendChild(block('Техника', appliances, model.selectedId));
    details.appendChild(block('Инженерия', engineering, model.selectedId));
    details.appendChild(block('Проемы', openings, model.selectedId));
    container.appendChild(details);
  });

  container.querySelectorAll('[data-id]').forEach((n) => n.addEventListener('click', (e) => {
    e.stopPropagation();
    onSelect(n.dataset.id);
  }));

  container.querySelectorAll('[data-dim-id]').forEach((n) => n.addEventListener('click', (e) => {
    e.stopPropagation();
    onEditDimensions(n.dataset.dimId);
  }));
}

function block(title, items, selectedId) {
  const section = document.createElement('section');
  const h = document.createElement('h4');
  h.textContent = title;
  section.appendChild(h);

  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = item.name || item.label;
    label.dataset.id = item.id;
    li.appendChild(label);
    if (canEditDimensions(item)) {
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'tree-edit-size-btn';
      editBtn.textContent = 'Габариты';
      editBtn.dataset.dimId = item.id;
      li.appendChild(editBtn);
    }
    if (selectedId === item.id) li.className = 'selected-tree';
    ul.appendChild(li);
  });
  section.appendChild(ul);
  return section;
}

function canEditDimensions(item) {
  return !['room', 'wall'].includes(item.type) && typeof item.width === 'number' && typeof item.height === 'number';
}
