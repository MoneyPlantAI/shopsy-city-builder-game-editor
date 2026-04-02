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
import { PlayerPrefs } from "../utils/PlayerPrefs";
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
		const homeButton = this.add.sprite(97, 91, "btn-home");
		homeButton.scaleX = 1.5049143620855445;
		homeButton.scaleY = 1.5049143620855445;
		mapUiContainer.add(homeButton);

		// startLevelButton
		const startLevelButton = this.add.sprite(710, 526, "btn-start-level");
		startLevelButton.scaleX = 2.0119550776095387;
		startLevelButton.scaleY = 2.0119550776095387;
		mapUiContainer.add(startLevelButton);

		// locationMarker
		const locationMarker = this.add.image(696, 405, "location-marker");
		locationMarker.scaleX = 1.9499397018284805;
		locationMarker.scaleY = 1.9499397018284805;
		mapUiContainer.add(locationMarker);

		// TutorialBG
		const tutorialBG = this.add.image(697, 683, "TutorialBG");
		tutorialBG.visible = false;
		mapUiContainer.add(tutorialBG);

		// TutorialText
		const tutorialText = this.add.text(700, 698, "", {});
		tutorialText.setOrigin(0.5, 0.5);
		tutorialText.visible = false;
		tutorialText.text = "Tap here for the \nfirst level";
		tutorialText.setStyle({ "align": "center", "fontFamily": "CarterOne-Regular", "fontSize": "35px", "stroke": "#000000ff", "strokeThickness": 3 });
		mapUiContainer.add(tutorialText);

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
		playPopupContainer.visible = false;

		// popupBg
		const popupBg = this.add.image(360, 540, "popup-play");
		popupBg.scaleX = 0.6;
		popupBg.scaleY = 0.6;
		playPopupContainer.add(popupBg);

		// popupPlayButton
		const popupPlayButton = this.add.sprite(360, 665, "Green-btn");
		popupPlayButton.scaleX = 0.4;
		popupPlayButton.scaleY = 0.4;
		playPopupContainer.add(popupPlayButton);

		// popupCloseButton
		const popupCloseButton = this.add.sprite(565, 371, "back-button");
		popupCloseButton.scaleX = 0.38794673562614557;
		popupCloseButton.scaleY = 0.38794673562614557;
		playPopupContainer.add(popupCloseButton);

		// popupTitle
		const popupTitle = this.add.text(360, 374, "", {});
		popupTitle.setOrigin(0.5, 0.5);
		popupTitle.text = "Building 1";
		popupTitle.setStyle({ "align": "center", "color": "#f7e62a", "fontFamily": "CarterOne-Regular", "fontSize": "40px", "stroke": "#0a5bc0", "strokeThickness": 5 });
		playPopupContainer.add(popupTitle);

		// back_icon
		const back_icon = this.add.image(564, 370, "back-icon");
		back_icon.scaleX = 0.3718945050517436;
		back_icon.scaleY = 0.3718945050517436;
		playPopupContainer.add(back_icon);

		// bar_points
		const bar_points = this.add.image(487, 522, "bar-points");
		playPopupContainer.add(bar_points);

		// popupPoints
		const popupPoints = this.add.text(519, 525, "", {});
		popupPoints.setOrigin(1, 0.5);
		popupPoints.text = "0";
		popupPoints.setStyle({ "align": "right", "color": "#FFFFFF", "fontFamily": "CarterOne-Regular", "fontSize": "30px" });
		playPopupContainer.add(popupPoints);

		// gem
		const gem = this.add.image(411, 520, "gem");
		gem.scaleX = 0.7192741177190282;
		gem.scaleY = 0.7192741177190282;
		playPopupContainer.add(gem);

		// bar_blocks
		const bar_blocks = this.add.image(244, 519, "bar-blocks");
		playPopupContainer.add(bar_blocks);

		// popupBlocks
		const popupBlocks = this.add.text(289, 521, "", {});
		popupBlocks.setOrigin(1, 0.5);
		popupBlocks.text = "0";
		popupBlocks.setStyle({ "align": "right", "color": "#FFFFFF", "fontFamily": "CarterOne-Regular", "fontSize": "30px" });
		playPopupContainer.add(popupBlocks);

		// text_1
		const text_1 = this.add.text(363, 659, "", {});
		text_1.setOrigin(0.5, 0.5);
		text_1.text = "Play";
		text_1.setStyle({ "fontFamily": "CarterOne-Regular", "fontSize": "40px" });
		playPopupContainer.add(text_1);

		// game_start_panel_container
		const game_start_panel_container = this.add.container(540, 960);
		game_start_panel_container.name = "game_start_panel_container";
		game_start_panel_container.visible = false;

		// blur_bg_1
		const blur_bg_1 = this.add.image(8, 0, "blur-bg");
		blur_bg_1.scaleX = 1.1;
		blur_bg_1.scaleY = 1.1;
		game_start_panel_container.add(blur_bg_1);

		// naz_new_screen
		const naz_new_screen = this.add.image(12, 42, "start-panel");
		game_start_panel_container.add(naz_new_screen);

		// naz_text3
		const naz_text3 = this.add.image(-172, -168, "naz-text3");
		naz_text3.name = "naz_text3";
		game_start_panel_container.add(naz_text3);

		// naz_text1
		const naz_text1 = this.add.image(32, 361, "naz-text1");
		naz_text1.visible = false;
		game_start_panel_container.add(naz_text1);

		// naz_text2
		const naz_text2 = this.add.image(14, 204, "naz-text2");
		game_start_panel_container.add(naz_text2);

		// top_text
		const top_text = this.add.text(12, -537, "", {});
		top_text.setOrigin(0.5, 0.64);
		top_text.text = "Stack & Earn Super Coins";
		top_text.setStyle({ "color": "#ecff3bff", "fontFamily": "CarterOne-Regular", "fontSize": "42px", "stroke": "#0a5bc0", "strokeThickness": 10 });
		game_start_panel_container.add(top_text);

		// start_btn
		const start_btn = this.add.image(12, 857, "start-btn");
		start_btn.name = "start_btn";
		game_start_panel_container.add(start_btn);

		// character_BG
		const character_BG = this.add.image(-410, -798, "character-bg");
		character_BG.name = "character_BG";
		game_start_panel_container.add(character_BG);

		// character_Icon
		const character_Icon = this.add.image(-410, -798, "character-icon");
		character_Icon.name = "character_Icon";
		game_start_panel_container.add(character_Icon);

		// profile_text
		const profile_text = this.add.text(-409, -683, "", {});
		profile_text.name = "profile_text";
		profile_text.setOrigin(0.5, 0.5);
		profile_text.text = "Guest";
		profile_text.setStyle({ "align": "center", "fixedWidth": 210, "fontFamily": "font-1", "fontSize": "35px", "stroke": "#332f2fff", "strokeThickness": 10 });
		game_start_panel_container.add(profile_text);

		// title_1
		const title_1 = this.add.image(12, -788, "game-title");
		title_1.name = "title_1";
		game_start_panel_container.add(title_1);

		this.bgMap = bgMap;
		this.mapWorldContainer = mapWorldContainer;
		this.homeButton = homeButton;
		this.startLevelButton = startLevelButton;
		this.locationMarker = locationMarker;
		this.tutorialBG = tutorialBG;
		this.tutorialText = tutorialText;
		this.mapUiContainer = mapUiContainer;
		this.popupDark = popupDark;
		this.popupBg = popupBg;
		this.popupPlayButton = popupPlayButton;
		this.popupCloseButton = popupCloseButton;
		this.popupTitle = popupTitle;
		this.popupPoints = popupPoints;
		this.popupBlocks = popupBlocks;
		this.playPopupContainer = playPopupContainer;
		this.start_btn = start_btn;
		this.character_BG = character_BG;
		this.profile_text = profile_text;
		this.game_start_panel_container = game_start_panel_container;

		this.events.emit("scene-awake");
	}

	private bgMap!: Phaser.GameObjects.Image;
	private mapWorldContainer!: Phaser.GameObjects.Container;
	private homeButton!: Phaser.GameObjects.Sprite;
	private startLevelButton!: Phaser.GameObjects.Sprite;
	private locationMarker!: Phaser.GameObjects.Image;
	private tutorialBG!: Phaser.GameObjects.Image;
	private tutorialText!: Phaser.GameObjects.Text;
	private mapUiContainer!: Phaser.GameObjects.Container;
	private popupDark!: Phaser.GameObjects.Rectangle;
	private popupBg!: Phaser.GameObjects.Image;
	private popupPlayButton!: Phaser.GameObjects.Sprite;
	private popupCloseButton!: Phaser.GameObjects.Sprite;
	private popupTitle!: Phaser.GameObjects.Text;
	private popupPoints!: Phaser.GameObjects.Text;
	private popupBlocks!: Phaser.GameObjects.Text;
	private playPopupContainer!: Phaser.GameObjects.Container;
	private start_btn!: Phaser.GameObjects.Image;
	private character_BG!: Phaser.GameObjects.Image;
	private profile_text!: Phaser.GameObjects.Text;
	private game_start_panel_container!: Phaser.GameObjects.Container;

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

    // ── Tracks which level index the player selected from the map ──────────────
    // -1 means "current level" (the new unlock button); any other value means
    // a previously completed building was tapped.
    private selectedLevelIndex: number = -1;

    create(): void {
        this.editorCreate();
        this.mapWorldContainer.setDepth(0);
        this.mapUiContainer.setDepth(1000);
        this.popupDark.setDepth(2000);
        this.playPopupContainer.setDepth(2100);
            // Ensure start panel UI stays above all
            if (this.game_start_panel_container) {
                this.game_start_panel_container.setDepth(2200);
            }
            // Hide startLevelButton and locationMarker if all levels are complete (currentLevel == 8)
            if (gameState.currentLevel === 8) {
                this.startLevelButton.setVisible(false);
                this.locationMarker.setVisible(false);
            }

        if (this.start_btn) {
            this.start_btn.setInteractive({ useHandCursor: true });
            this.start_btn.on('pointerdown', () => this.changePanel(GAME_PANEL.GAMEPLAY_PANEL));
        }

        this.homeBtnNode = configureButton(this.homeButton, "home");
        this.startBtnNode = configureButton(this.startLevelButton, "start-level");
        this.popupPlayBtnNode = configureButton(this.popupPlayButton, "play");
        this.popupCloseBtnNode = configureButton(this.popupCloseButton, "close");

        this.renderLevelMap();
        this.setupPanels();
        this.setupInteractions();
        this.updateTutorialVisibility();
        this.changeGameState(GAME_STATE.PRE_GAME);
    }

    private setupPanels(): void {
        this.allPanels = [this.mapUiContainer, this.playPopupContainer, this.game_start_panel_container];
        this.popupDark.setVisible(false).disableInteractive();
        this.playPopupContainer.setVisible(false);
    }

    private setupInteractions(): void {
        this.tapInteractionHelper(this.homeBtnNode, () => this.changeGameState(GAME_STATE.ABANDONED));

        // ── Current-level (new unlock) button ─────────────────────────────────
        this.tapInteractionHelper(this.startBtnNode, () => {
            this.hideTutorial();
            this.openPopupForLevel(gameState.currentLevel);
        });

        // ── Popup close: hide popup and reset states so re-open always works ──
        this.tapInteractionHelper(this.popupCloseBtnNode, () => this.closePopupAndReset());

        // ── Popup play button ─────────────────────────────────────────────────
        // We set this up DIRECTLY on popupPlayButton (not via tapInteractionHelper
        // which uses a tween onComplete callback — by the time the tween fires,
        // the closure may have stale state). Instead we snapshot selectedLevelIndex
        // at the exact moment the finger goes down, before any async step.
        this.popupPlayButton.setInteractive({ useHandCursor: true });
        this.popupPlayButton.on("pointerdown", () => {
            playSound(this, "click");

            // ── Snapshot the level NOW, before any tween or reset can clear it ──
            const levelToPlay = this.selectedLevelIndex >= 0
                ? this.selectedLevelIndex
                : gameState.currentLevel;

            console.log("[LevelSelect] Play pressed — launching level index:", levelToPlay);

            this.tweens.add({
                targets: this.popupPlayButton,
                scaleX: 0.5,
                scaleY: 0.5,
                yoyo: true,
                ease: "Linear",
                duration: 100,
                onComplete: () => {
                    // Hide popup visuals
                    this.popupDark.setVisible(false).disableInteractive();
                    this.playPopupContainer.setVisible(false);
                    // Launch Level scene with the snapshotted index
                    this.scene.start("Level", { overrideLevelIndex: levelToPlay });
                }
            });
        });
    }

    private tapInteractionHelper(button: Phaser.GameObjects.GameObject, callback: () => void): void {
        button.setInteractive({ useHandCursor: true });
        button.on("pointerdown", () => {
            playSound(this, "click");
            this.tweens.add({
                targets: button,
                scaleX: 0.5,
                scaleY: 0.5,
                yoyo: true,
                ease: "Linear",
                duration: 100,
                onComplete: callback
            });
        });
    }

    // ── Opens the play-popup for any level index ──────────────────────────────
    // Called both by the current-level button AND completed building taps.
    private openPopupForLevel(levelIndex: number): void {
        this.selectedLevelIndex = levelIndex;

        const level = LEVELS[levelIndex] ?? LEVELS[LEVELS.length - 1];
        this.popupTitle.setText(`Building ${levelIndex + 1}`);
        this.popupBlocks.setText(String(level.blockAmount));
        this.popupPoints.setText(String(level.pointRequired));

        this.popupDark.setVisible(true).setInteractive();
        this.popupDark.alpha = 0;
        this.playPopupContainer.setVisible(true);
        this.mapUiContainer.setVisible(true);   // keep map UI (home/start btn) visible behind popup

        this.tweens.add({
            targets: this.popupDark,
            alpha: 0.5,
            duration: 200
        });

        // Update internal state trackers so guards don't block re-opens
        this.currentPanel = GAME_PANEL.LEVEL_SELECT;
        this.currentGameState = GAME_STATE.START;
    }

    // ── Closes the popup and resets state so any button can re-open it ────────
    private closePopupAndReset(): void {
        this.popupDark.setVisible(false).disableInteractive();
        this.playPopupContainer.setVisible(false);
        this.selectedLevelIndex = -1;

        // Reset both guards so the next tap always works
        this.currentPanel = GAME_PANEL.GAMEPLAY_PANEL;
        this.currentGameState = GAME_STATE.NONE;

        this.mapUiContainer.setVisible(true);
    }

    // ── Launches the Level scene, passing the selected level via scene data ───
    // If selectedLevelIndex is -1 (no building tapped), we fall back to
    // gameState.currentLevel which is the normal progression path.
    private startGameplay(): void {
        this.popupDark.setVisible(false).disableInteractive();
        this.playPopupContainer.setVisible(false);

        const levelToPlay = this.selectedLevelIndex >= 0
            ? this.selectedLevelIndex
            : gameState.currentLevel;

        // Pass the chosen level to the Level scene via Phaser scene data
        this.scene.start("Level", { overrideLevelIndex: levelToPlay });
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
            case GAME_PANEL.LEVEL_SELECT:
                panelsToShow = [this.playPopupContainer];
                this.popupDark.setVisible(true).setInteractive();
                break;
            case GAME_PANEL.START_PANEL:
                panelsToShow = [this.game_start_panel_container];
                break;
            case GAME_PANEL.GAMEPLAY_PANEL:
            default:
                panelsToShow = [this.mapUiContainer];
                this.popupDark.setVisible(false).disableInteractive();
                break;
        }

        this.allPanels.forEach((panelItem) => {
            panelItem.setVisible(panelsToShow.includes(panelItem));
            this.children.bringToTop(panelItem);
        });
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
            case GAME_STATE.ABANDONED:
                this.exitOrHome();
                break;
            default:
                break;
        }
    }

    private preGame(): void {
        this.changePanel(GAME_PANEL.NONE);
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
                const building = this.add.image(
                    data.x,
                    data.y + LEVEL_BUILDING_OFFSET_Y,
                    data.building
                ).setOrigin(0.5, 1);

                building.scaleX = 1.8;
                building.scaleY = 1.8;

                // ── Completed building tap: open popup for THAT level ──────────
                building.setInteractive({ useHandCursor: true });
                building.on('pointerdown', () => {
                    playSound(this, "click");
                    this.openPopupForLevel(index);
                });

                this.mapWorldContainer.add(building);
                this.completedBuildings.push(building);
            }
        });

        // Position the "next unlock" button at the current (locked) level slot
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

    private updateTutorialVisibility(): void {
        const shouldShowTutorial = gameState.currentLevel === 0 && !PlayerPrefs.hasSeenTutorial;

        this.tutorialBG.setVisible(shouldShowTutorial);
        this.tutorialText.setVisible(shouldShowTutorial);

        if (gameState.currentLevel > 0 && !PlayerPrefs.hasSeenTutorial) {
            PlayerPrefs.hasSeenTutorial = true;
        }
    }

    private hideTutorial(): void {
        this.tutorialBG.setVisible(false);
        this.tutorialText.setVisible(false);
        PlayerPrefs.hasSeenTutorial = true;
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here