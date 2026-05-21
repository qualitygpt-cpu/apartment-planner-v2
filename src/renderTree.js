export function renderTree(container, model, onSelect) {
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
}

function block(title, items, selectedId) {
  const section = document.createElement('section');
  const h = document.createElement('h4');
  h.textContent = title;
  section.appendChild(h);

  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name || item.label;
    li.dataset.id = item.id;
    if (selectedId === item.id) li.className = 'selected-tree';
    ul.appendChild(li);
  });
  section.appendChild(ul);
  return section;
}
