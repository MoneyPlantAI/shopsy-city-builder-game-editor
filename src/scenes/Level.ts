// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { gameState } from "../core/state";
import { configureButton, ButtonSprite } from "../core/ui-factory";
import { LEVELS, LEVEL_BUILDING_OFFSET_Y } from "../data/levels";
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// mapWorldContainer
		const mapWorldContainer = this.add.container(0, 0);

		// bgMap
		const bgMap = this.add.image(360, 540, "bg-map");
		mapWorldContainer.add(bgMap);

		// mapUiContainer
		const mapUiContainer = this.add.container(0, 0);

		// homeButton
		const homeButton = this.add.sprite(70, 70, "btn-home");
		mapUiContainer.add(homeButton);

		// startLevelButton
		const startLevelButton = this.add.sprite(361, 813, "btn-start-level");
		mapUiContainer.add(startLevelButton);

		// locationMarker
		const locationMarker = this.add.image(361, 763, "location-marker");
		mapUiContainer.add(locationMarker);

		// popupDark
		const popupDark = this.add.rectangle(0, 0, 720, 1080);
		popupDark.setOrigin(0, 0);
		popupDark.visible = false;
		popupDark.isFilled = true;
		popupDark.fillColor = 0;
		popupDark.fillAlpha = 0.5;

		// playPopupContainer
		const playPopupContainer = this.add.container(0, 0);
		playPopupContainer.visible = false;

		// popupBg
		const popupBg = this.add.image(360, 540, "popup-play");
		playPopupContainer.add(popupBg);

		// popupPlayButton
		const popupPlayButton = this.add.sprite(360, 650, "btn-play");
		playPopupContainer.add(popupPlayButton);

		// popupCloseButton
		const popupCloseButton = this.add.sprite(515, 385, "btn-close");
		playPopupContainer.add(popupCloseButton);

		// popupTitle
		const popupTitle = this.add.text(360, 383, "", {});
		popupTitle.setOrigin(0.5, 0.5);
		popupTitle.text = "Building 1";
		popupTitle.setStyle({ "align": "center", "color": "#FFFFFF", "fontFamily": "bebas", "fontSize": "40px" });
		playPopupContainer.add(popupTitle);

		// popupBlocks
		const popupBlocks = this.add.text(340, 502, "", {});
		popupBlocks.setOrigin(1, 0.5);
		popupBlocks.text = "0";
		popupBlocks.setStyle({ "align": "right", "color": "#FFFFFF", "fontFamily": "bebas", "fontSize": "30px" });
		playPopupContainer.add(popupBlocks);

		// popupPoints
		const popupPoints = this.add.text(480, 502, "", {});
		popupPoints.setOrigin(1, 0.5);
		popupPoints.text = "0";
		popupPoints.setStyle({ "align": "right", "color": "#FFFFFF", "fontFamily": "bebas", "fontSize": "30px" });
		playPopupContainer.add(popupPoints);

		this.bgMap = bgMap;
		this.mapWorldContainer = mapWorldContainer;
		this.homeButton = homeButton;
		this.startLevelButton = startLevelButton;
		this.locationMarker = locationMarker;
		this.mapUiContainer = mapUiContainer;
		this.popupDark = popupDark;
		this.popupBg = popupBg;
		this.popupPlayButton = popupPlayButton;
		this.popupCloseButton = popupCloseButton;
		this.popupTitle = popupTitle;
		this.popupBlocks = popupBlocks;
		this.popupPoints = popupPoints;
		this.playPopupContainer = playPopupContainer;

		this.events.emit("scene-awake");
	}

	private bgMap!: Phaser.GameObjects.Image;
	private mapWorldContainer!: Phaser.GameObjects.Container;
	private homeButton!: Phaser.GameObjects.Sprite;
	private startLevelButton!: Phaser.GameObjects.Sprite;
	private locationMarker!: Phaser.GameObjects.Image;
	private mapUiContainer!: Phaser.GameObjects.Container;
	private popupDark!: Phaser.GameObjects.Rectangle;
	private popupBg!: Phaser.GameObjects.Image;
	private popupPlayButton!: Phaser.GameObjects.Sprite;
	private popupCloseButton!: Phaser.GameObjects.Sprite;
	private popupTitle!: Phaser.GameObjects.Text;
	private popupBlocks!: Phaser.GameObjects.Text;
	private popupPoints!: Phaser.GameObjects.Text;
	private playPopupContainer!: Phaser.GameObjects.Container;

	/* START-USER-CODE */

    private completedBuildings: Phaser.GameObjects.Image[] = [];

    create(): void {
        this.editorCreate();
        this.mapWorldContainer.setDepth(0);
        this.mapUiContainer.setDepth(1000);
        this.popupDark.setDepth(2000);
        this.playPopupContainer.setDepth(2100);

        const home = configureButton(this.homeButton, "home");
        const startLevel = configureButton(this.startLevelButton, "start-level");
        const play = configureButton(this.popupPlayButton, "play");
        const close = configureButton(this.popupCloseButton, "close");

        this.renderLevelMap();

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
                    if (button === startLevel) {
                        this.showPlayPopup();
                    } else if (button === play) {
                        this.scene.start("Game");
                    } else if (button === home) {
                        this.scene.start("Home");
                    } else if (button === close) {
                        this.hidePlayPopup();
                    }
                }
            });
        });
    }

    private renderLevelMap(): void {
        this.completedBuildings.forEach((item) => item.destroy());
        this.completedBuildings = [];

        LEVELS.forEach((data, index) => {
            if (index < gameState.currentLevel) {
                const building = this.add.image(data.x, data.y + LEVEL_BUILDING_OFFSET_Y, data.building).setOrigin(0.5, 1);
                this.mapWorldContainer.add(building);
                this.completedBuildings.push(building);
            }
        });

        const current = LEVELS[gameState.currentLevel] ?? LEVELS[LEVELS.length - 1];
        this.startLevelButton.setPosition(current.x, current.y);
        this.locationMarker.setPosition(current.x, current.y - 50);

        this.tweens.killTweensOf(this.locationMarker);
        this.tweens.add({
            targets: this.locationMarker,
            y: this.locationMarker.y - 20,
            duration: 600,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });
    }

    private showPlayPopup(): void {
        const level = LEVELS[gameState.currentLevel] ?? LEVELS[LEVELS.length - 1];

        this.popupTitle.setText(`Building ${gameState.currentLevel + 1}`);
        this.popupBlocks.setText(String(level.blockAmount));
        this.popupPoints.setText(String(level.pointRequired));

        this.popupDark.setVisible(true).setInteractive();
        this.popupDark.alpha = 0;
        this.playPopupContainer.setVisible(true);

        this.tweens.add({
            targets: this.popupDark,
            alpha: 0.5,
            duration: 200
        });
    }

    private hidePlayPopup(): void {
        this.popupDark.setVisible(false).disableInteractive();
        this.playPopupContainer.setVisible(false);
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
