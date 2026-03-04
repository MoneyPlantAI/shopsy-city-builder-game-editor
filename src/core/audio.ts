export interface GameAudioOptions {
    sound: boolean;
    music: boolean;
}

export const gameAudioOptions: GameAudioOptions = {
    sound: true,
    music: true
};

export function playSound(scene: Phaser.Scene, key: string): void {
    if (!gameAudioOptions.sound) {
        return;
    }
    scene.sound.play(key);
}
