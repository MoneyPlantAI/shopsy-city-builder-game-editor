export type ButtonType =
    | "play"
    | "newgame"
    | "start-level"
    | "home"
    | "close"
    | "pause"
    | "restart"
    | "map"
    | "next";

export interface ButtonSprite extends Phaser.GameObjects.Sprite {
    isButton: true;
    name: ButtonType;
}

export function createButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    buttonType: ButtonType
): ButtonSprite {
    const sprite = scene.add.sprite(x, y, `btn-${buttonType}`).setInteractive();
    return configureButton(sprite, buttonType);
}

export function configureButton(
    sprite: Phaser.GameObjects.Sprite,
    buttonType: ButtonType
): ButtonSprite {
    const button = sprite as ButtonSprite;
    button.isButton = true;
    button.name = buttonType;
    if (!button.input) {
        button.setInteractive();
    }
    return button;
}
