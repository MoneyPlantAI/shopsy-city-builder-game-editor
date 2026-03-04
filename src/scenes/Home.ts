// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { gameState, storageKey } from "../core/state";
import { removeData } from "../core/storage";
import { configureButton, ButtonSprite } from "../core/ui-factory";
/* END-USER-IMPORTS */

export default class Home extends Phaser.Scene {

    constructor() {
        super("Home");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {

        // bgHome
        const bgHome = this.add.image(360, 540, "bg-home");
        bgHome.name = "bgHome";

        // title
        const title = this.add.image(360, 300, "game-title");
        title.name = "title";

        // playButton
        const playButton = this.add.sprite(360, 720, "btn-play");
        playButton.name = "playButton";

        // newGameButton
        const newGameButton = this.add.sprite(360, 830, "btn-newgame");
        newGameButton.name = "newGameButton";

        // devText
        const devText = this.add.text(360, 1047, "", {});
        devText.name = "devText";
        devText.setOrigin(0.5, 0);
        devText.text = "";
        devText.setStyle({ "align": "center", "color": "#000000", "fontFamily": "bebas", "fontSize": "30px" });

        this.title = title;
        this.playButton = playButton;
        this.newGameButton = newGameButton;

        this.events.emit("scene-awake");
    }

    private title!: Phaser.GameObjects.Image;
    private playButton!: Phaser.GameObjects.Sprite;
    private newGameButton!: Phaser.GameObjects.Sprite;

    /* START-USER-CODE */

    create(): void {
        this.editorCreate();

        const play = configureButton(this.playButton, "play");
        const newGame = configureButton(this.newGameButton, "newgame");

        this.tweens.add({
            targets: this.title,
            y: this.title.y + 30,
            duration: 1300,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
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
                    if (button === play) {
                        this.scene.start("Level");
                    } else if (button === newGame) {
                        if (window.confirm("Are you sure?")) {
                            gameState.currentLevel = 0;
                            removeData(storageKey);
                            this.scene.start("Level");
                        }
                    }
                }
            });
        });
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
