// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { gameState, setCurrentLevel } from "../core/state";
import { configureButton, ButtonSprite, createButton } from "../core/ui-factory";
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

        // barBlocks
        this.add.image(20, 60, "bar-blocks").setOrigin(0, 0.5);

        // barPoints
        this.add.image(20, 150, "bar-points").setOrigin(0, 0.5);

        // txtBlocks
        const txtBlocks = this.add.text(218, 62, "0", {});
        txtBlocks.name = "txtBlocks";
        txtBlocks.setOrigin(1, 0.5);
        txtBlocks.setStyle({ "align": "right", "fontFamily": "bebas", "fontSize": "35px" });

        // txtPoints
        const txtPoints = this.add.text(218, 152, "0/0", {});
        txtPoints.name = "txtPoints";
        txtPoints.setOrigin(1, 0.5);
        txtPoints.setStyle({ "align": "right", "fontFamily": "bebas", "fontSize": "35px" });

        // txtPointsAdded
        const txtPointsAdded = this.add.text(250, 152, "", {});
        txtPointsAdded.name = "txtPointsAdded";
        txtPointsAdded.setOrigin(0, 0.5);
        txtPointsAdded.setStyle({ "align": "left", "color": "#23b84b", "fontFamily": "bebas", "fontSize": "35px" });

        // pauseButton
        const pauseButton = this.add.sprite(650, 70, "btn-pause");
        pauseButton.name = "pauseButton";

        this.txtBlocks = txtBlocks;
        this.txtPoints = txtPoints;
        this.txtPointsAdded = txtPointsAdded;
        this.pauseButton = pauseButton;

        this.events.emit("scene-awake");
    }

    private txtBlocks!: Phaser.GameObjects.Text;
    private txtPoints!: Phaser.GameObjects.Text;
    private txtPointsAdded!: Phaser.GameObjects.Text;
    private pauseButton!: Phaser.GameObjects.Sprite;

    /* START-USER-CODE */

    create(): void {
        this.editorCreate();

        let currentPoints = 0;
        const popup = this.add.group();

        configureButton(this.pauseButton, "pause");

        this.txtBlocks.setText(String(LEVELS[gameState.currentLevel].blockAmount));
        this.txtPoints.setText(`0/${LEVELS[gameState.currentLevel].pointRequired}`);

        const gameScene = this.scene.get("Game");
        gameScene.events.off("update-score");
        gameScene.events.off("update-block-amount");
        gameScene.events.off("gameover");
        gameScene.events.off("completed");

        gameScene.events.on("update-score", (data: { curPoints: number; added: number }) => {
            currentPoints = data.curPoints;
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

        gameScene.events.on("gameover", () => {
            showEndPopup("STAGE FAILED!", false);
        });

        gameScene.events.on("completed", () => {
            showEndPopup("COMPLETED!", true);
        });

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
                        showPausePopup();
                    } else if (button.name === "close") {
                        popup.clear(true, true);
                        this.scene.resume("Game");
                    }
                }
            });
        });

        const showPausePopup = (): void => {
            const dark = this.add.rectangle(0, 0, 720, 1080, 0x000000).setOrigin(0).setInteractive();
            dark.alpha = 0;
            this.tweens.add({ targets: dark, alpha: 0.5, duration: 200 });
            const bgPopup = this.add.sprite(360, 540, "popup");
            const bRestart = createButton(this, 360, 585, "restart");
            const bMap = createButton(this, 360, 680, "map");
            const bClose = createButton(this, 515, 385, "close");
            const txtTitle = this.add.text(360, 383, "PAUSED", {
                fontFamily: "bebas",
                fontSize: "40px",
                align: "center",
                color: "#FFFFFF"
            }).setOrigin(0.5);
            popup.addMultiple([dark, bgPopup, bRestart, bMap, bClose, txtTitle]);
        };

        const showEndPopup = (title: string, completed: boolean): void => {
            playSound(this, completed ? "completed" : "gameover");
            const dark = this.add.rectangle(0, 0, 720, 1080, 0x000000).setOrigin(0).setInteractive();
            dark.alpha = 0;
            this.tweens.add({ targets: dark, alpha: 0.5, duration: 200 });

            this.add.sprite(360, 540, "popup-end");
            if (completed) {
                createButton(this, 360, 650, "next");
                if (gameState.currentLevel < LEVELS.length - 1) {
                    setCurrentLevel(gameState.currentLevel + 1);
                }
            } else {
                createButton(this, 360, 585, "restart");
                createButton(this, 360, 680, "map");
            }

            this.add.text(360, 383, title, {
                fontFamily: "bebas",
                fontSize: "40px",
                align: "center",
                color: "#FFFFFF"
            }).setOrigin(0.5);

            this.add.text(340, 502, `${gameState.totalStackedBlocks}/${LEVELS[gameState.currentLevel].blockAmount}`, {
                fontFamily: "bebas",
                fontSize: "30px",
                align: "right",
                color: "#FFFFFF"
            }).setOrigin(1, 0.5);

            this.add.text(480, 502, `${currentPoints}/${LEVELS[gameState.currentLevel].pointRequired}`, {
                fontFamily: "bebas",
                fontSize: "30px",
                align: "right",
                color: "#FFFFFF"
            }).setOrigin(1, 0.5);
        };
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
