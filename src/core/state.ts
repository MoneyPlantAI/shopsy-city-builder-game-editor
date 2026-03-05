import { getData, saveData } from "./storage";

export interface DroppedBlockSprite extends Phaser.GameObjects.Sprite {
    dropped?: boolean;
}

export const storageKey = "rf.city-builder";

export const gameState = {
    currentLevel: 0,
    blocks: [] as DroppedBlockSprite[],
    totalStackedBlocks: 0
};

export interface GameplayConfig {
    maxToleranceX: number;
    targetYIncrement: number;
    dropDurationHit: number;
    dropDurationMiss: number;
    scrollDuration: number;
    oscillatingBreakpoints: Array<[number, number]>;
}

export const gameplayConfig: GameplayConfig = {
    maxToleranceX: 80,
    targetYIncrement: 94,
    dropDurationHit: 600,
    dropDurationMiss: 900,
    scrollDuration: 300,
    oscillatingBreakpoints: [
        [10, 0.2],
        [20, 0.4],
        [30, 0.8],
        [36, 1.2]
    ]
};

export function initializeGameState(): void {
    const saved = getData(storageKey);
    if (!saved) {
        gameState.currentLevel = 0;
        return;
    }

    const parsed = Number(saved);
    gameState.currentLevel = Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}

export function setCurrentLevel(level: number): void {
    gameState.currentLevel = Math.max(0, Math.floor(level));
    saveData(storageKey, gameState.currentLevel);
}

export function resetBlockRunState(): void {
    gameState.blocks = [];
    gameState.totalStackedBlocks = 0;
}

export function applyGameplayConfig(config: Partial<GameplayConfig> | null | undefined): void {
    if (!config) {
        return;
    }

    gameplayConfig.maxToleranceX = config.maxToleranceX ?? gameplayConfig.maxToleranceX;
    gameplayConfig.targetYIncrement = config.targetYIncrement ?? gameplayConfig.targetYIncrement;
    gameplayConfig.dropDurationHit = config.dropDurationHit ?? gameplayConfig.dropDurationHit;
    gameplayConfig.dropDurationMiss = config.dropDurationMiss ?? gameplayConfig.dropDurationMiss;
    gameplayConfig.scrollDuration = config.scrollDuration ?? gameplayConfig.scrollDuration;

    if (Array.isArray(config.oscillatingBreakpoints) && config.oscillatingBreakpoints.length > 0) {
        gameplayConfig.oscillatingBreakpoints = config.oscillatingBreakpoints;
    }
}
