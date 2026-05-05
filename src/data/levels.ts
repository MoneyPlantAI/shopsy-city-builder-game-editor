export interface LevelDefinition {
    x: number;
    y: number;
    pointRequired: number;
    blockAmount: number;
    building: string;
}

// Keep values aligned with the original Phaser 3 implementation.
export const LEVELS: LevelDefinition[] = [
    { x: 711, y: 524, pointRequired: 100, blockAmount: 7, building: "building1" },
    { x: 212, y: 806, pointRequired: 280, blockAmount: 15, building: "building2" },
    { x: 271, y: 1284, pointRequired: 400, blockAmount: 20, building: "building3" },
    { x: 490, y: 649, pointRequired: 525, blockAmount: 25, building: "building4" },
    { x: 270, y: 1598, pointRequired: 600, blockAmount: 30, building: "building5" },
    { x: 544, y: 1443, pointRequired: 735, blockAmount: 35, building: "building6" },
    { x: 364, y: 313, pointRequired: 750, blockAmount: 35, building: "building7" },
    { x: 936, y: 172, pointRequired: 787, blockAmount: 35, building: "building8" }
];

export const LEVEL_BUILDING_OFFSET_Y = 100;
