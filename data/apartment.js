export const APARTMENT_DATA = {
  meta: {
    name: 'П-44, 2к, до перепланировки',
    unit: 'meter',
    scalePxPerMeter: 90,
    wallThickness: {
      bearing: 0.17,
      partition: 0.05
    }
  },
  rooms: [
    { id: 'room-living', name: 'Большая комната', type: 'room', x: 0.4, y: 0.4, width: 4.8, height: 3.8, fill: '#f7f9fc', label: 'Большая комната', children: [] },
    { id: 'room-small', name: 'Малая комната', type: 'room', x: 5.2, y: 0.4, width: 3.3, height: 3.2, fill: '#f8fafc', label: 'Малая комната', children: [] },
    { id: 'room-kitchen', name: 'Кухня', type: 'room', x: 5.2, y: 3.6, width: 3.3, height: 2.4, fill: '#f5f8fa', label: 'Кухня', children: [] },
    { id: 'room-corridor', name: 'Коридор', type: 'room', x: 0.4, y: 4.2, width: 4.8, height: 1.8, fill: '#f7f7f7', label: 'Коридор', children: [] },
    { id: 'room-bath', name: 'Ванная', type: 'room', x: 0.4, y: 6.0, width: 2.2, height: 1.8, fill: '#f3f6ff', label: 'Ванная', children: [] },
    { id: 'room-toilet', name: 'Туалет', type: 'room', x: 2.6, y: 6.0, width: 1.3, height: 1.8, fill: '#f3f6ff', label: 'Туалет', children: [] }
  ],
  walls: [
    { id: 'w-top', type: 'wall', wallKind: 'bearing', x: 0.23, y: 0.23, width: 8.44, height: 0.17, thickness: 0.17, fixed: true },
    { id: 'w-left', type: 'wall', wallKind: 'bearing', x: 0.23, y: 0.23, width: 0.17, height: 7.74, thickness: 0.17, fixed: true },
    { id: 'w-right', type: 'wall', wallKind: 'bearing', x: 8.5, y: 0.23, width: 0.17, height: 7.74, thickness: 0.17, fixed: true },
    { id: 'w-bottom', type: 'wall', wallKind: 'bearing', x: 0.23, y: 7.8, width: 8.44, height: 0.17, thickness: 0.17, fixed: true },
    { id: 'w-middle-v', type: 'wall', wallKind: 'bearing', x: 5.115, y: 0.4, width: 0.17, height: 5.6, thickness: 0.17, fixed: true },
    { id: 'w-corridor-h', type: 'wall', wallKind: 'partition', x: 0.4, y: 4.175, width: 4.8, height: 0.05, thickness: 0.05, fixed: true },
    { id: 'w-bath-h', type: 'wall', wallKind: 'partition', x: 0.4, y: 5.975, width: 3.5, height: 0.05, thickness: 0.05, fixed: true },
    { id: 'w-bath-v', type: 'wall', wallKind: 'partition', x: 2.575, y: 6.0, width: 0.05, height: 1.8, thickness: 0.05, fixed: true }
  ],
  doorOpenings: [
    { id: 'd-living-corridor', type: 'doorOpening', x: 2.2, y: 4.175, width: 0.9, height: 0.05, roomA: 'room-living', roomB: 'room-corridor', label: 'Дверь в гостиную' },
    { id: 'd-small-corridor', type: 'doorOpening', x: 5.115, y: 2.2, width: 0.17, height: 0.9, roomA: 'room-small', roomB: 'room-corridor', label: 'Дверь в малую' },
    { id: 'd-kitchen-corridor', type: 'doorOpening', x: 5.115, y: 4.7, width: 0.17, height: 0.9, roomA: 'room-kitchen', roomB: 'room-corridor', label: 'Дверь в кухню' },
    { id: 'd-bath-corridor', type: 'doorOpening', x: 1.1, y: 5.975, width: 0.7, height: 0.05, roomA: 'room-bath', roomB: 'room-corridor', label: 'Дверь в ванную' },
    { id: 'd-toilet-corridor', type: 'doorOpening', x: 3.0, y: 5.975, width: 0.7, height: 0.05, roomA: 'room-toilet', roomB: 'room-corridor', label: 'Дверь в туалет' }
  ],
  windows: [
    { id: 'win-living', type: 'window', x: 1.8, y: 0.23, width: 1.8, height: 0.17, roomId: 'room-living', label: 'Окно гостиной' },
    { id: 'win-small', type: 'window', x: 6.0, y: 0.23, width: 1.4, height: 0.17, roomId: 'room-small', label: 'Окно малой' },
    { id: 'win-kitchen', type: 'window', x: 6.2, y: 7.8, width: 1.2, height: 0.17, roomId: 'room-kitchen', label: 'Окно кухни' }
  ],
  engineering: [
    { id: 'eng-riser-kitchen', type: 'riser', roomId: 'room-kitchen', x: 8.0, y: 5.4, width: 0.3, height: 0.3, fixed: true, label: 'Стояк кухни' },
    { id: 'eng-pipe-bath', type: 'pipe', roomId: 'room-bath', x: 0.6, y: 7.2, width: 1.6, height: 0.08, fixed: true, label: 'Труба ванны' },
    { id: 'eng-radiator-living', type: 'radiator', roomId: 'room-living', x: 2.1, y: 0.5, width: 1.2, height: 0.2, fixed: true, label: 'Радиатор гостиной' }
  ],
  items: [
    { id: 'f-sofa', roomId: 'room-living', category: 'furniture', type: 'sofa', name: 'Диван', x: 1.0, y: 2.6, width: 2.1, height: 0.9, rotation: 0, movable: true, heightZ: 0.85, layer: 'furniture', zIndex: 40, textureId: 'fabricSoft', canOverlap: false, overlapRules: { allowUnder: [], forbidWithTall: ['wardrobe'] } },
    { id: 'f-table', roomId: 'room-living', category: 'furniture', type: 'table', name: 'Стол', x: 3.0, y: 1.7, width: 1.2, height: 0.8, rotation: 0, movable: true, heightZ: 0.75, layer: 'furniture', zIndex: 45, textureId: 'woodOak', canOverlap: false, overlapRules: { allowUnder: ['chair'], forbidWithTall: [] } },
    { id: 'f-chair', roomId: 'room-living', category: 'furniture', type: 'chair', name: 'Стул', x: 3.3, y: 2.45, width: 0.45, height: 0.45, rotation: 0, movable: true, heightZ: 0.9, layer: 'underTable', zIndex: 44, textureId: 'woodBeech', canOverlap: true, overlapRules: { canBeUnder: ['table'] } },
    { id: 'f-bed', roomId: 'room-small', category: 'furniture', type: 'bed', name: 'Кровать', x: 5.55, y: 1.25, width: 1.9, height: 1.4, rotation: 0, movable: true, heightZ: 0.6, layer: 'furniture', zIndex: 40, textureId: 'fabricSleep', canOverlap: false, overlapRules: { allowUnder: [] } },
    { id: 'a-fridge', roomId: 'room-kitchen', category: 'appliance', type: 'fridge', name: 'Холодильник', x: 7.75, y: 3.85, width: 0.7, height: 0.7, rotation: 0, movable: true, heightZ: 1.9, layer: 'appliance', zIndex: 50, textureId: 'metalLight', canOverlap: false, overlapRules: { forbidWithTall: ['cabinet'] } },
    { id: 'a-stove', roomId: 'room-kitchen', category: 'appliance', type: 'stove', name: 'Плита', x: 6.0, y: 4.9, width: 0.6, height: 0.6, rotation: 0, movable: true, heightZ: 0.9, layer: 'appliance', zIndex: 50, textureId: 'metalDark', canOverlap: false, overlapRules: { allowUnder: [] } }
  ]
};
