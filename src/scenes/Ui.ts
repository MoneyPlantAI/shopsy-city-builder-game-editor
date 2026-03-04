// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { gameState, setCurrentLevel } from "../core/state";
import { configureButton, ButtonSprite } from "../core/ui-factory";
import { LEVELS } from "../data/levels";
/* END-USER-IMPORTS */

export default class Ui extends Phaser.Scene {

    constructor() {
        super("Ui");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {
        const hudContainer = this.add.container(0, 0);

        const barBlocks = this.add.image(20, 60, "bar-blocks").setOrigin(0, 0.5);
        const barPoints = this.add.image(20, 150, "bar-points").setOrigin(0, 0.5);
        const txtBlocks = this.add.text(218, 62, "0", { align: "right", fontFamily: "bebas", fontSize: "35px" }).setOrigin(1, 0.5);
        const txtPoints = this.add.text(218, 152, "0/0", { align: "right", fontFamily: "bebas", fontSize: "35px" }).setOrigin(1, 0.5);
        const txtPointsAdded = this.add.text(250, 152, "", { align: "left", color: "#23b84b", fontFamily: "bebas", fontSize: "35px" }).setOrigin(0, 0.5);
        const pauseButton = this.add.sprite(650, 70, "btn-pause");
        hudContainer.add([barBlocks, barPoints, txtBlocks, txtPoints, txtPointsAdded, pauseButton]);

        const popupDark = this.add.rectangle(0, 0, 720, 1080, 0x000000, 0.5).setOrigin(0, 0);
        popupDark.visible = false;

        const pausePopupContainer = this.add.container(0, 0);
        const pausePopupBg = this.add.image(360, 540, "popup");
        const pauseTitle = this.add.text(360, 383, "PAUSED", { align: "center", color: "#FFFFFF", fontFamily: "bebas", fontSize: "40px" }).setOrigin(0.5);
        const pauseRestartButton = this.add.sprite(360, 585, "btn-restart");
        const pauseMapButton = this.add.sprite(360, 680, "btn-map");
        const pauseCloseButton = this.add.sprite(515, 385, "btn-close");
        pausePopupContainer.add([pausePopupBg, pauseTitle, pauseRestartButton, pauseMapButton, pauseCloseButton]);
        pausePopupContainer.visible = false;

        const endPopupContainer = this.add.container(0, 0);
        const endPopupBg = this.add.image(360, 540, "popup-end");
        const endTitle = this.add.text(360, 430, "STAGE FAILED!", { align: "center", color: "#FFFFFF", fontFamily: "bebas", fontSize: "40px" }).setOrigin(0.5);
        const endBlocks = this.add.text(340, 502, "0/0", { align: "right", color: "#FFFFFF", fontFamily: "bebas", fontSize: "30px" }).setOrigin(1, 0.5);
        const endPoints = this.add.text(480, 502, "0/0", { align: "right", color: "#FFFFFF", fontFamily: "bebas", fontSize: "30px" }).setOrigin(1, 0.5);
        const endRestartButton = this.add.sprite(360, 585, "btn-restart");
        const endMapButton = this.add.sprite(360, 680, "btn-map");
        const endNextButton = this.add.sprite(360, 650, "btn-next");
        endPopupContainer.add([endPopupBg, endTitle, endBlocks, endPoints, endRestartButton, endMapButton, endNextButton]);
        endPopupContainer.visible = false;

        this.hudContainer = hudContainer;
        this.txtBlocks = txtBlocks;
        this.txtPoints = txtPoints;
        this.txtPointsAdded = txtPointsAdded;
        this.pauseButton = pauseButton;
        this.popupDark = popupDark;
        this.pausePopupContainer = pausePopupContainer;
        this.pauseRestartButton = pauseRestartButton;
        this.pauseMapButton = pauseMapButton;
        this.pauseCloseButton = pauseCloseButton;
        this.endPopupContainer = endPopupContainer;
        this.endTitle = endTitle;
        this.endBlocks = endBlocks;
        this.endPoints = endPoints;
        this.endRestartButton = endRestartButton;
        this.endMapButton = endMapButton;
        this.endNextButton = endNextButton;

        this.events.emit("scene-awake");
    }

    private hudContainer!: Phaser.GameObjects.Container;
    private txtBlocks!: Phaser.GameObjects.Text;
    private txtPoints!: Phaser.GameObjects.Text;
    private txtPointsAdded!: Phaser.GameObjects.Text;
    private pauseButton!: Phaser.GameObjects.Sprite;
    private popupDark!: Phaser.GameObjects.Rectangle;
    private pausePopupContainer!: Phaser.GameObjects.Container;
    private pauseRestartButton!: Phaser.GameObjects.Sprite;
    private pauseMapButton!: Phaser.GameObjects.Sprite;
    private pauseCloseButton!: Phaser.GameObjects.Sprite;
    private endPopupContainer!: Phaser.GameObjects.Container;
    private endTitle!: Phaser.GameObjects.Text;
    private endBlocks!: Phaser.GameObjects.Text;
    private endPoints!: Phaser.GameObjects.Text;
    private endRestartButton!: Phaser.GameObjects.Sprite;
    private endMapButton!: Phaser.GameObjects.Sprite;
    private endNextButton!: Phaser.GameObjects.Sprite;

    /* START-USER-CODE */

    private currentPoints = 0;

    create(): void {
        this.editorCreate();

        this.hudContainer.setDepth(1000);
        this.popupDark.setDepth(2000);
        this.pausePopupContainer.setDepth(2100);
        this.endPopupContainer.setDepth(2100);

        configureButton(this.pauseButton, "pause");
        configureButton(this.pauseRestartButton, "restart");
        configureButton(this.pauseMapButton, "map");
        configureButton(this.pauseCloseButton, "close");
        configureButton(this.endRestartButton, "restart");
        configureButton(this.endMapButton, "map");
        configureButton(this.endNextButton, "next");

        this.hidePausePopup();
        this.hideEndPopup();

        this.txtBlocks.setText(String(LEVELS[gameState.currentLevel].blockAmount));
        this.txtPoints.setText(`0/${LEVELS[gameState.currentLevel].pointRequired}`);

        const gameScene = this.scene.get("Game");
        gameScene.events.off("update-score");
        gameScene.events.off("update-block-amount");
        gameScene.events.off("gameover");
        gameScene.events.off("completed");

        gameScene.events.on("update-score", (data: { curPoints: number; added: number }) => {
            this.currentPoints = data.curPoints;
            this.txtPoints.setText(`${data.curPoints}/${LEVELS[gameState.currentLevel].pointRequired}`);
            if (data.curPoints > LEVELS[gameState.currentLevel].pointRequired) {
                this.txtPoints.setColor("#54ff82");
            }
            this.txtPointsAdded.setText(`+${data.added}`);
            this.time.delayedCall(1000, () => this.txtPointsAdded.setText(""));
        });

        gameScene.events.on("update-block-amount", (value: number) => {
            this.txtBlocks.setText(String(value));
        });

        gameScene.events.on("gameover", () => this.showEndPopup(false));
        gameScene.events.on("completed", () => this.showEndPopup(true));

        this.input.on("gameobjectdown", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
            const button = obj as ButtonSprite;
            if (!button.isButton) {
                return;
            }

            playSound(this, "click");
            this.tweens.add({
                targets: button,
                scaleX: 0.9,
                scaleY: 0.9,
                yoyo: true,
                ease: "Linear",
                duration: 100,
                onComplete: () => {
                    if (button.name === "next") {
                        this.scene.start("Level");
                        this.scene.stop("Ui");
                        this.scene.stop("Game");
                    } else if (button.name === "restart") {
                        this.scene.stop("Ui");
                        this.scene.start("Game");
                    } else if (button.name === "map") {
                        this.scene.start("Level");
                        this.scene.stop("Ui");
                        this.scene.stop("Game");
                    } else if (button.name === "pause") {
                        this.scene.pause("Game");
                        this.showPausePopup();
                    } else if (button.name === "close") {
                        this.hidePausePopup();
                        this.scene.resume("Game");
                    }
                }
            });
        });
    }

    private showPausePopup(): void {
        this.hideEndPopup();
        this.popupDark.setVisible(true).setInteractive();
        this.pausePopupContainer.setVisible(true);
        this.popupDark.alpha = 0;
        this.tweens.add({ targets: this.popupDark, alpha: 0.5, duration: 200 });
    }

    private hidePausePopup(): void {
        this.pausePopupContainer.setVisible(false);
        this.popupDark.setVisible(false).disableInteractive();
    }

    private showEndPopup(completed: boolean): void {
        playSound(this, completed ? "completed" : "gameover");
        this.hidePausePopup();

        this.popupDark.setVisible(true).setInteractive();
        this.popupDark.alpha = 0;
        this.tweens.add({ targets: this.popupDark, alpha: 0.5, duration: 200 });

        this.endTitle.setText(completed ? "COMPLETED!" : "STAGE FAILED!");
        this.endBlocks.setText(`${gameState.totalStackedBlocks}/${LEVELS[gameState.currentLevel].blockAmount}`);
        this.endPoints.setText(`${this.currentPoints}/${LEVELS[gameState.currentLevel].pointRequired}`);

        this.endRestartButton.setVisible(!completed);
        this.endMapButton.setVisible(!completed);
        this.endNextButton.setVisible(completed);

        if (completed && gameState.currentLevel < LEVELS.length - 1) {
            setCurrentLevel(gameState.currentLevel + 1);
        }

        this.endPopupContainer.setVisible(true);
    }

    private hideEndPopup(): void {
        this.endPopupContainer.setVisible(false);
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
