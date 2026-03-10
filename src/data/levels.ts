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
    { x: 212, y: 806, pointRequired: 560, blockAmount: 15, building: "building2" },
    { x: 271, y: 1284, pointRequired: 800, blockAmount: 20, building: "building3" },
    { x: 490, y: 649, pointRequired: 1050, blockAmount: 25, building: "building4" },
    { x: 270, y: 1598, pointRequired: 1200, blockAmount: 30, building: "building5" },
    { x: 544, y: 1443, pointRequired: 1470, blockAmount: 35, building: "building6" },
    { x: 335, y: 286, pointRequired: 1500, blockAmount: 35, building: "building7" },
    { x: 987, y: 177, pointRequired: 1575, blockAmount: 35, building: "building8" }
];

export const LEVEL_BUILDING_OFFSET_Y = 100;
