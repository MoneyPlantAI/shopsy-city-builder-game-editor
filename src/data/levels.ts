export interface LevelDefinition {
    x: number;
    y: number;
    pointRequired: number;
    blockAmount: number;
    building: string;
}

// Keep values aligned with the original Phaser 3 implementation.
export const LEVELS: LevelDefinition[] = [
    { x: 711, y: 524, pointRequired: 200, blockAmount: 7, building: "building1" },
    { x: 210, y: 724, pointRequired: 560, blockAmount: 15, building: "building2" },
    { x: 361, y: 813, pointRequired: 800, blockAmount: 20, building: "building3" },
    { x: 573, y: 513, pointRequired: 1050, blockAmount: 25, building: "building4" },
    { x: 660, y: 564, pointRequired: 1200, blockAmount: 30, building: "building5" },
    { x: 209, y: 900, pointRequired: 1470, blockAmount: 35, building: "building6" },
    { x: 178, y: 461, pointRequired: 1500, blockAmount: 35, building: "building7" },
    { x: 452, y: 301, pointRequired: 1575, blockAmount: 35, building: "building8" }
];

export const LEVEL_BUILDING_OFFSET_Y = 55;
