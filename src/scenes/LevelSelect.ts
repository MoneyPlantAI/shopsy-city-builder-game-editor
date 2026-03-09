// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { gameState } from "../core/state";
import { configureButton } from "../core/ui-factory";
import { LEVELS, LEVEL_BUILDING_OFFSET_Y } from "../data/levels";
import { GAME_PANEL } from "../game-core/GamePanel";
import { GAME_STATE } from "../game-core/GameState";
import { shopsyBridge } from "../shopsystan/shopsyBridge";
/* END-USER-IMPORTS */

export default class LevelSelect extends Phaser.Scene {

	constructor() {
		super("LevelSelect");

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// mapWorldContainer
		const mapWorldContainer = this.add.container(0, 0);

		// bgMap
		const bgMap = this.add.image(540, 960, "bg-map");
		bgMap.scaleX = 1.8;
		bgMap.scaleY = 1.8;
		mapWorldContainer.add(bgMap);

		// mapUiContainer
		const mapUiContainer = this.add.container(0, 0);

		// homeButton
		const homeButton = this.add.sprite(70, 70, "btn-home");
		mapUiContainer.add(homeButton);

		// startLevelButton
		const startLevelButton = this.add.sprite(711, 524, "btn-start-level");
		startLevelButton.scaleX = 2.0119550776095387;
		startLevelButton.scaleY = 2.0119550776095387;
		mapUiContainer.add(startLevelButton);

		// locationMarker
		const locationMarker = this.add.image(696, 405, "location-marker");
		locationMarker.scaleX = 1.9499397018284805;
		locationMarker.scaleY = 1.9499397018284805;
		mapUiContainer.add(locationMarker);

		// popupDark
		const popupDark = this.add.rectangle(0, 0, 720, 1080);
		popupDark.scaleX = 1.505657351827596;
		popupDark.scaleY = 1.7835825412908684;
		popupDark.setOrigin(0, 0);
		popupDark.visible = false;
		popupDark.isFilled = true;
		popupDark.fillColor = 0;
		popupDark.fillAlpha = 0.5;

		// playPopupContainer
		const playPopupContainer = this.add.container(-48, 116);
		playPopupContainer.scaleX = 1.6663067937480376;
		playPopupContainer.scaleY = 1.6663067937480376;

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

    private allPanels: Phaser.GameObjects.Container[] = [];
    private previousGameState: string = GAME_STATE.NONE;
    private currentGameState: string = GAME_STATE.NONE;
    private previousPanel: string = GAME_PANEL.NONE;
    private currentPanel: string = GAME_PANEL.NONE;
    private completedBuildings: Phaser.GameObjects.Image[] = [];
    private homeBtnNode!: Phaser.GameObjects.Sprite;
    private startBtnNode!: Phaser.GameObjects.Sprite;
    private popupPlayBtnNode!: Phaser.GameObjects.Sprite;
    private popupCloseBtnNode!: Phaser.GameObjects.Sprite;

    create(): void {
        this.editorCreate();
        this.mapWorldContainer.setDepth(0);
        this.mapUiContainer.setDepth(1000);
        this.popupDark.setDepth(2000);
        this.playPopupContainer.setDepth(2100);

        this.homeBtnNode = configureButton(this.homeButton, "home");
        this.startBtnNode = configureButton(this.startLevelButton, "start-level");
        this.popupPlayBtnNode = configureButton(this.popupPlayButton, "play");
        this.popupCloseBtnNode = configureButton(this.popupCloseButton, "close");

        this.renderLevelMap();
        this.setupPanels();
        this.setupInteractions();
        this.changeGameState(GAME_STATE.PRE_GAME);
    }

    private setupPanels(): void {
        this.allPanels = [this.mapUiContainer, this.playPopupContainer];
        this.popupDark.setVisible(false).disableInteractive();
        this.playPopupContainer.setVisible(false);
    }

    private setupInteractions(): void {
        this.tapInteractionHelper(this.homeBtnNode, () => this.changeGameState(GAME_STATE.ABANDONED));
        this.tapInteractionHelper(this.startBtnNode, () => this.changeGameState(GAME_STATE.START));
        this.tapInteractionHelper(this.popupCloseBtnNode, () => this.changeGameState(GAME_STATE.PRE_GAME));
        this.tapInteractionHelper(this.popupPlayBtnNode, () => this.changeGameState(GAME_STATE.PLAYING));
    }

    private tapInteractionHelper(button: Phaser.GameObjects.GameObject, callback: () => void): void {
        button.setInteractive({ useHandCursor: true });
        button.on("pointerdown", () => {
            playSound(this, "click");
            this.tweens.add({
                targets: button,
                scaleX: 0.9,
                scaleY: 0.9,
                yoyo: true,
                ease: "Linear",
                duration: 100,
                onComplete: callback
            });
        });
    }

    private changePanel(panel: string): void {
        if (this.currentPanel === panel) {
            return;
        }
        this.previousPanel = this.currentPanel;
        this.currentPanel = panel;

        let panelsToShow: Phaser.GameObjects.Container[] = [];
        this.popupDark.setVisible(false).disableInteractive();

        switch (this.currentPanel) {
            case GAME_PANEL.START_PANEL:
                panelsToShow = [this.mapUiContainer];
                this.popupDark.setVisible(true).setInteractive();
                break;
            case GAME_PANEL.GAMEPLAY_PANEL:
            default:
                panelsToShow = [this.mapUiContainer];
                break;
        }

        this.allPanels.forEach((panelItem) => {
            panelItem.setVisible(panelsToShow.includes(panelItem));
            this.children.bringToTop(panelItem);
        });
        this.playPopupContainer.setVisible(this.currentPanel === GAME_PANEL.START_PANEL);
    }

    private changeGameState(state: string): void {
        if (this.currentGameState === state) {
            return;
        }
        this.previousGameState = this.currentGameState;
        this.currentGameState = state;

        switch (this.currentGameState) {
            case GAME_STATE.PRE_GAME:
                this.preGame();
                break;
            case GAME_STATE.START:
                this.startLevelPrompt();
                break;
            case GAME_STATE.PLAYING:
                this.startGameplay();
                break;
            case GAME_STATE.ABANDONED:
                this.exitOrHome();
                break;
            default:
                break;
        }
    }

    private preGame(): void {
        this.changePanel(GAME_PANEL.GAMEPLAY_PANEL);
    }

    private startLevelPrompt(): void {
        this.showPlayPopup();
        this.changePanel(GAME_PANEL.START_PANEL);
    }

    private startGameplay(): void {
        this.hidePlayPopup();
        this.scene.start("Level");
    }

    private exitOrHome(): void {
        if (shopsyBridge.isNative) {
            shopsyBridge.exitGame();
        } else {
            this.scene.restart();
        }
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
        this.locationMarker.setPosition(current.x, current.y - 120);

        this.tweens.killTweensOf(this.locationMarker);
        this.tweens.add({
            targets: this.locationMarker,
            y: this.locationMarker.y - 80,
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
