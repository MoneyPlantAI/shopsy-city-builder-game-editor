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
