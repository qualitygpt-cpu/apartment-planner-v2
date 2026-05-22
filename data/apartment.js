export const APARTMENT_DATA = {
  meta: {
    name: 'П-44, 2к, до перепланировки',
    unit: 'meter',
    scalePxPerMeter: 90,
    wallThickness: {
      bearing: 0.17,
      partition: 0.05
    },
    note: 'Ручная приближенная геометрия по исходному плану. Все размеры в метрах.'
  },

  rooms: [
    {
      id: 'room-living',
      planNo: '1',
      name: 'Большая комната',
      type: 'room',
      x: 0.4,
      y: 0.4,
      width: 3.42,
      height: 5.81,
      area: 19.8,
      fill: '#f7f9fc',
      label: '1. Большая комната',
      children: []
    },
    {
      id: 'room-balcony',
      planNo: '1а',
      name: 'Балкон',
      type: 'balcony',
      x: 0.4,
      y: 6.38,
      width: 3.42,
      height: 0.35,
      area: 1.2,
      fill: '#eef7ff',
      label: '1а. Балкон',
      children: []
    },
    {
      id: 'room-small',
      planNo: '2',
      name: 'Малая комната',
      type: 'room',
      x: 3.99,
      y: 2.06,
      width: 2.82,
      height: 4.15,
      area: 11.7,
      fill: '#f8fafc',
      label: '2. Малая комната',
      children: []
    },
    {
      id: 'room-kitchen',
      planNo: '3',
      name: 'Кухня',
      type: 'kitchen',
      x: 6.98,
      y: 3.23,
      width: 2.82,
      height: 2.98,
      area: 8.4,
      fill: '#f5f8fa',
      label: '3. Кухня',
      children: []
    },
    {
      id: 'room-bath',
      planNo: '4',
      name: 'Ванная',
      type: 'bathroom',
      x: 8.09,
      y: 0.4,
      width: 1.66,
      height: 1.75,
      area: 2.9,
      fill: '#f3f6ff',
      label: '4. Ванная',
      children: []
    },
    {
      id: 'room-toilet',
      planNo: '5',
      name: 'Уборная',
      type: 'toilet',
      x: 8.09,
      y: 2.2,
      width: 1.66,
      height: 0.6,
      area: 1.0,
      fill: '#f3f6ff',
      label: '5. Уборная',
      children: []
    },
    {
      id: 'room-corridor-6',
      planNo: '6',
      name: 'Коридор 6',
      type: 'corridor',
      x: 3.99,
      y: 0.4,
      width: 2.82,
      height: 1.56,
      area: 4.4,
      fill: '#f7f7f7',
      label: '6. Коридор',
      children: []
    },
    {
      id: 'room-corridor-7',
      planNo: '7',
      name: 'Коридор 7',
      type: 'corridor',
      x: 6.98,
      y: 0.4,
      width: 1.08,
      height: 2.78,
      area: 3.0,
      fill: '#f7f7f7',
      label: '7. Коридор',
      children: []
    }
  ],

  walls: [
    // Наружные несущие стены
    {
      id: 'w-outer-top',
      type: 'wall',
      wallKind: 'bearing',
      x: 0.23,
      y: 0.23,
      width: 9.74,
      height: 0.17,
      thickness: 0.17,
      fixed: true
    },
    {
      id: 'w-outer-left',
      type: 'wall',
      wallKind: 'bearing',
      x: 0.23,
      y: 0.23,
      width: 0.17,
      height: 6.15,
      thickness: 0.17,
      fixed: true
    },
    {
      id: 'w-outer-right',
      type: 'wall',
      wallKind: 'bearing',
      x: 9.8,
      y: 0.23,
      width: 0.17,
      height: 6.15,
      thickness: 0.17,
      fixed: true
    },
    {
      id: 'w-outer-bottom',
      type: 'wall',
      wallKind: 'bearing',
      x: 0.23,
      y: 6.21,
      width: 9.74,
      height: 0.17,
      thickness: 0.17,
      fixed: true
    },

    // Балкон
    {
      id: 'w-balcony-front',
      type: 'wall',
      wallKind: 'partition',
      x: 0.4,
      y: 6.73,
      width: 3.42,
      height: 0.05,
      thickness: 0.05,
      fixed: true
    },
    {
      id: 'w-balcony-left',
      type: 'wall',
      wallKind: 'partition',
      x: 0.4,
      y: 6.38,
      width: 0.05,
      height: 0.35,
      thickness: 0.05,
      fixed: true
    },
    {
      id: 'w-balcony-right',
      type: 'wall',
      wallKind: 'partition',
      x: 3.77,
      y: 6.38,
      width: 0.05,
      height: 0.35,
      thickness: 0.05,
      fixed: true
    },

    // Основные внутренние несущие стены
    {
      id: 'w-living-right-bearing',
      type: 'wall',
      wallKind: 'bearing',
      x: 3.82,
      y: 0.23,
      width: 0.17,
      height: 6.15,
      thickness: 0.17,
      fixed: true
    },
    {
      id: 'w-service-left-bearing',
      type: 'wall',
      wallKind: 'bearing',
      x: 6.81,
      y: 0.23,
      width: 0.17,
      height: 6.15,
      thickness: 0.17,
      fixed: true
    },

    // Перегородки
    {
      id: 'w-corridor6-small',
      type: 'wall',
      wallKind: 'partition',
      x: 3.99,
      y: 2.01,
      width: 2.82,
      height: 0.05,
      thickness: 0.05,
      fixed: true
    },
    {
      id: 'w-corridor7-kitchen',
      type: 'wall',
      wallKind: 'partition',
      x: 6.98,
      y: 3.18,
      width: 2.82,
      height: 0.05,
      thickness: 0.05,
      fixed: true
    },
    {
      id: 'w-corridor7-bath-toilet',
      type: 'wall',
      wallKind: 'partition',
      x: 8.04,
      y: 0.4,
      width: 0.05,
      height: 2.78,
      thickness: 0.05,
      fixed: true
    },
    {
      id: 'w-bath-toilet',
      type: 'wall',
      wallKind: 'partition',
      x: 8.09,
      y: 2.15,
      width: 1.66,
      height: 0.05,
      thickness: 0.05,
      fixed: true
    },
    {
      id: 'w-toilet-kitchen',
      type: 'wall',
      wallKind: 'partition',
      x: 8.09,
      y: 2.8,
      width: 1.66,
      height: 0.05,
      thickness: 0.05,
      fixed: true
    }
  ],

  doorOpenings: [
    {
      id: 'd-entry-corridor6',
      type: 'doorOpening',
      x: 4.55,
      y: 0.23,
      width: 0.9,
      height: 0.17,
      roomA: 'outside',
      roomB: 'room-corridor-6',
      label: 'Входная дверь'
    },
    {
      id: 'd-living-corridor6',
      type: 'doorOpening',
      x: 3.82,
      y: 0.95,
      width: 0.17,
      height: 0.9,
      roomA: 'room-living',
      roomB: 'room-corridor-6',
      label: 'Дверь в большую комнату'
    },
    {
      id: 'd-small-corridor6',
      type: 'doorOpening',
      x: 4.75,
      y: 2.01,
      width: 0.9,
      height: 0.05,
      roomA: 'room-small',
      roomB: 'room-corridor-6',
      label: 'Дверь в малую комнату'
    },
    {
      id: 'd-corridor6-corridor7',
      type: 'doorOpening',
      x: 6.81,
      y: 0.95,
      width: 0.17,
      height: 0.9,
      roomA: 'room-corridor-6',
      roomB: 'room-corridor-7',
      label: 'Проход между коридорами'
    },
    {
      id: 'd-kitchen-corridor7',
      type: 'doorOpening',
      x: 7.15,
      y: 3.18,
      width: 0.85,
      height: 0.05,
      roomA: 'room-kitchen',
      roomB: 'room-corridor-7',
      label: 'Дверь в кухню'
    },
    {
      id: 'd-bath-corridor7',
      type: 'doorOpening',
      x: 8.04,
      y: 0.9,
      width: 0.05,
      height: 0.75,
      roomA: 'room-bath',
      roomB: 'room-corridor-7',
      label: 'Дверь в ванную'
    },
    {
      id: 'd-toilet-corridor7',
      type: 'doorOpening',
      x: 8.04,
      y: 2.25,
      width: 0.05,
      height: 0.5,
      roomA: 'room-toilet',
      roomB: 'room-corridor-7',
      label: 'Дверь в уборную'
    }
  ],

  windows: [
    {
      id: 'win-living-balcony',
      type: 'window',
      x: 0.85,
      y: 6.21,
      width: 1.35,
      height: 0.17,
      roomId: 'room-living',
      label: 'Окно большой комнаты на балкон'
    },
    {
      id: 'win-living-balcony-door',
      type: 'window',
      x: 2.35,
      y: 6.21,
      width: 0.8,
      height: 0.17,
      roomId: 'room-living',
      label: 'Балконная дверь'
    },
    {
      id: 'win-small',
      type: 'window',
      x: 4.55,
      y: 6.21,
      width: 1.35,
      height: 0.17,
      roomId: 'room-small',
      label: 'Окно малой комнаты'
    },
    {
      id: 'win-kitchen',
      type: 'window',
      x: 7.55,
      y: 6.21,
      width: 1.35,
      height: 0.17,
      roomId: 'room-kitchen',
      label: 'Окно кухни'
    }
  ],

  engineering: [
    {
      id: 'eng-riser-kitchen',
      type: 'riser',
      roomId: 'room-kitchen',
      x: 9.25,
      y: 4.35,
      width: 0.25,
      height: 0.25,
      fixed: true,
      label: 'Стояк кухни'
    },
    {
      id: 'eng-riser-bath',
      type: 'riser',
      roomId: 'room-bath',
      x: 8.15,
      y: 1.75,
      width: 0.2,
      height: 0.2,
      fixed: true,
      label: 'Стояк санузла'
    },
    {
      id: 'eng-pipe-bath',
      type: 'pipe',
      roomId: 'room-bath',
      x: 8.35,
      y: 1.85,
      width: 1.1,
      height: 0.08,
      fixed: true,
      label: 'Трубы ванной'
    },
    {
      id: 'eng-radiator-living',
      type: 'radiator',
      roomId: 'room-living',
      x: 1.0,
      y: 5.85,
      width: 1.2,
      height: 0.15,
      fixed: true,
      label: 'Радиатор большой комнаты'
    },
    {
      id: 'eng-radiator-small',
      type: 'radiator',
      roomId: 'room-small',
      x: 4.65,
      y: 5.85,
      width: 1.0,
      height: 0.15,
      fixed: true,
      label: 'Радиатор малой комнаты'
    },
    {
      id: 'eng-radiator-kitchen',
      type: 'radiator',
      roomId: 'room-kitchen',
      x: 7.65,
      y: 5.85,
      width: 1.0,
      height: 0.15,
      fixed: true,
      label: 'Радиатор кухни'
    }
  ],

  items: [
    {
      id: 'f-sofa',
      roomId: 'room-living',
      category: 'furniture',
      type: 'sofa',
      name: 'Диван',
      x: 0.85,
      y: 3.45,
      width: 2.46,
      height: 1.69,
      rotation: 0,
      movable: true,
      snapToWall: true,
      heightZ: 0.85,
      layer: 'furniture',
      zIndex: 40,
      textureId: 'fabricSoft',
      canOverlap: false,
      overlapRules: {
        allowUnder: [],
        forbidWithTall: ['wardrobe']
      }
    },
    {
      id: 'f-table',
      roomId: 'room-living',
      category: 'furniture',
      type: 'table',
      name: 'Стол',
      x: 1.25,
      y: 2.1,
      width: 1.2,
      height: 0.8,
      rotation: 0,
      movable: true,
      snapToWall: true,
      heightZ: 0.75,
      layer: 'furniture',
      zIndex: 45,
      textureId: 'woodOak',
      canOverlap: false,
      overlapRules: {
        allowUnder: ['chair'],
        forbidWithTall: []
      }
    },
    {
      id: 'f-chair',
      roomId: 'room-living',
      category: 'furniture',
      type: 'chair',
      name: 'Стул',
      x: 1.6,
      y: 2.85,
      width: 0.45,
      height: 0.45,
      rotation: 0,
      movable: true,
      snapToWall: false,
      heightZ: 0.9,
      layer: 'underTable',
      zIndex: 44,
      textureId: 'woodBeech',
      canOverlap: true,
      overlapRules: {
        canBeUnder: ['table']
      }
    },
    {
      id: 'f-bed',
      roomId: 'room-small',
      category: 'furniture',
      type: 'bed',
      name: 'Кровать',
      x: 4.35,
      y: 3.25,
      width: 1.9,
      height: 1.4,
      rotation: 0,
      movable: true,
      snapToWall: true,
      heightZ: 0.6,
      layer: 'furniture',
      zIndex: 40,
      textureId: 'fabricSleep',
      canOverlap: false,
      overlapRules: {
        allowUnder: []
      }
    },
    {
      id: 'a-fridge',
      roomId: 'room-kitchen',
      category: 'appliance',
      type: 'fridge',
      name: 'Холодильник',
      x: 9.05,
      y: 3.45,
      width: 0.65,
      height: 0.65,
      rotation: 0,
      movable: true,
      snapToWall: true,
      heightZ: 1.9,
      layer: 'appliance',
      zIndex: 50,
      textureId: 'metalLight',
      canOverlap: false,
      overlapRules: {
        forbidWithTall: ['cabinet']
      }
    },
    {
      id: 'a-stove',
      roomId: 'room-kitchen',
      category: 'appliance',
      type: 'stove',
      name: 'Плита',
      x: 8.95,
      y: 5.15,
      width: 0.6,
      height: 0.6,
      rotation: 0,
      movable: true,
      snapToWall: false,
      heightZ: 0.9,
      layer: 'appliance',
      zIndex: 50,
      textureId: 'metalDark',
      canOverlap: false,
      overlapRules: {
        allowUnder: []
      }
    }
  ]
};
