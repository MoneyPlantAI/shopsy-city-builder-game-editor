// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { applyGameplayConfig, gameState, setCurrentLevel, resetBlockRunState, DroppedBlockSprite, gameplayConfig } from "../core/state";
import { configureButton } from "../core/ui-factory";
import { LEVELS } from "../data/levels";
import { GAME_PANEL } from "../game-core/GamePanel";
import { GAME_STATE } from "../game-core/GameState";
import { ErrorPopupManager, ErrorType } from "../managers/ErrorManager";
import UserProfileManager from "../shopsystan/UserProfileManager";
import { ShopsyAnalytics } from "../shopsystan/shopsyAnalytics";
import { initShopsyBridge, shopsyBridge, ShopsyMessageAction } from "../shopsystan/shopsyBridge";
import { ShareManager } from "../share/ShareManager";
import { GAME_ID, GAME_NAME } from "../utils/config";
import { PlayerPrefs } from "../utils/PlayerPrefs";
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

    constructor() {
        super("Level");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {
        const gameWorldContainer = this.add.container(0, 0);
        const bgGame1 = this.add.image(360, 540, "bg-game1");
        const bgGame2 = this.add.image(360, -540, "bg-game2");
        const bgGame3a = this.add.image(360, -1620, "bg-game3");
        const bgGame3b = this.add.image(360, -2700, "bg-game3");
        const blockBottom = this.add.image(360, 866, "block-bottom");
        gameWorldContainer.add([bgGame1, bgGame2, bgGame3a, bgGame3b, blockBottom]);

        const gameplayContainer = this.add.container(0, 0);
        const blockTop = this.add.sprite(160, 120, "block");
        const claw = this.add.sprite(160, 0, "claw1");
        gameplayContainer.add([blockTop, claw]);

        const fxContainer = this.add.container(0, 0);
        const collideFx = this.add.sprite(-300, -300, "anim-collide");
        collideFx.visible = false;
        fxContainer.add(collideFx);

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

        this.gameWorldContainer = gameWorldContainer;
        this.gameplayContainer = gameplayContainer;
        this.fxContainer = fxContainer;
        this.bgGame1 = bgGame1;
        this.bgGame2 = bgGame2;
        this.bgGame3a = bgGame3a;
        this.bgGame3b = bgGame3b;
        this.blockBottom = blockBottom;
        this.blockTop = blockTop;
        this.claw = claw;
        this.collideFx = collideFx;
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

    private gameWorldContainer!: Phaser.GameObjects.Container;
    private gameplayContainer!: Phaser.GameObjects.Container;
    private fxContainer!: Phaser.GameObjects.Container;
    private bgGame1!: Phaser.GameObjects.Image;
    private bgGame2!: Phaser.GameObjects.Image;
    private bgGame3a!: Phaser.GameObjects.Image;
    private bgGame3b!: Phaser.GameObjects.Image;
    private blockBottom!: Phaser.GameObjects.Image;
    private blockTop!: Phaser.GameObjects.Sprite;
    private claw!: Phaser.GameObjects.Sprite;
    private collideFx!: Phaser.GameObjects.Sprite;
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

    private allPanels: Phaser.GameObjects.Container[] = [];
    private previousGameState: string = GAME_STATE.NONE;
    private currentGameState: string = GAME_STATE.NONE;
    private previousPanel: string = GAME_PANEL.NONE;
    private currentPanel: string = GAME_PANEL.NONE;

    private moveTo: "left" | "right" = "left";
    private val = 0;
    private oscillating = 0;
    private isGameplayPaused = false;
    private isMaxGameBonusEarned = false;
    private gameStartTime = 0;
    public timePlayedMs = 0;
    public score = 0;
    private currentPoints = 0;
    private maxBlock = 0;
    private requiredPoints = 0;

    private pauseBtnNode!: Phaser.GameObjects.Sprite;
    private pauseRestartBtnNode!: Phaser.GameObjects.Sprite;
    private pauseMapBtnNode!: Phaser.GameObjects.Sprite;
    private pauseCloseBtnNode!: Phaser.GameObjects.Sprite;
    private endRestartBtnNode!: Phaser.GameObjects.Sprite;
    private endMapBtnNode!: Phaser.GameObjects.Sprite;
    private endNextBtnNode!: Phaser.GameObjects.Sprite;
    private errorPanelContainer?: Phaser.GameObjects.Container;
    public share_panel_container?: Phaser.GameObjects.Container;
    private errorPopupManager?: ErrorPopupManager;
    private shareManager?: ShareManager;

    private bridgeUnsubscribers: Array<() => void> = [];

    update(): void {
        if (this.isGameplayPaused || this.currentGameState !== GAME_STATE.PLAYING) {
            return;
        }

        if (this.moveTo === "left") {
            if (this.val > -20) {
                this.val -= 1;
            } else {
                this.moveTo = "right";
            }
        } else if (this.val < 20) {
            this.val += 1;
        } else {
            this.moveTo = "left";
        }

        gameState.blocks.forEach((block) => {
            if (!block.dropped) {
                return;
            }
            block.x += this.moveTo === "left" ? -this.oscillating : this.oscillating;
        });
    }

    create(): void {
        this.editorCreate();

        this.gameWorldContainer.setDepth(0);
        this.gameplayContainer.setDepth(1000);
        this.fxContainer.setDepth(1100);
        this.hudContainer.setDepth(2000);
        this.popupDark.setDepth(2100);
        this.pausePopupContainer.setDepth(2200);
        this.endPopupContainer.setDepth(2200);

        this.pauseBtnNode = configureButton(this.pauseButton, "pause");
        this.pauseRestartBtnNode = configureButton(this.pauseRestartButton, "restart");
        this.pauseMapBtnNode = configureButton(this.pauseMapButton, "map");
        this.pauseCloseBtnNode = configureButton(this.pauseCloseButton, "close");
        this.endRestartBtnNode = configureButton(this.endRestartButton, "restart");
        this.endMapBtnNode = configureButton(this.endMapButton, "map");
        this.endNextBtnNode = configureButton(this.endNextButton, "next");

        this.setupManagers();
        this.setupPanels();
        this.loadSounds();
        this.setupBridgeListeners();
        this.setupInteractions();
        this.setupShopsy();

        this.setupGameplayCore();

        this.changeGameState(GAME_STATE.PRE_GAME);
        this.changeGameState(GAME_STATE.START);

        this.events.once("shutdown", () => this.cleanupBridgeListeners());
        this.events.once("destroy", () => this.cleanupBridgeListeners());
    }

    private setupGameplayCore(): void {
        resetBlockRunState();

        this.oscillating = 0;
        this.claw.setDepth(1);

        this.maxBlock = LEVELS[gameState.currentLevel].blockAmount;
        this.requiredPoints = LEVELS[gameState.currentLevel].pointRequired;
        this.txtBlocks.setText(String(this.maxBlock));
        this.txtPoints.setText(`0/${this.requiredPoints}`);

        if (!this.anims.exists("collide")) {
            this.anims.create({
                key: "collide",
                frames: this.anims.generateFrameNumbers("anim-collide"),
                frameRate: 10
            });
        }

        this.tweens.add({
            targets: this.blockTop,
            x: this.blockTop.x + 400,
            duration: 1500,
            ease: "Sine.easeInOut",
            yoyo: true,
            onUpdate: () => {
                this.claw.x = this.blockTop.x;
            },
            repeat: -1
        });

        this.setupDropHandling();
    }

    private setupManagers(): void {
        const errorContainer = this.children.getByName("error_panel_container");
        if (errorContainer && errorContainer instanceof Phaser.GameObjects.Container) {
            this.errorPanelContainer = errorContainer;
            this.errorPopupManager = new ErrorPopupManager(this);
            this.errorPopupManager.init();
        }

        const shareContainer = this.children.getByName("share_panel_container");
        if (shareContainer && shareContainer instanceof Phaser.GameObjects.Container) {
            this.share_panel_container = shareContainer;
            this.shareManager = new ShareManager(this as any);
            this.shareManager.init();
        }
    }

    private loadSounds(): void {
        // Lifecycle placeholder for template parity.
        // City Builder currently relies on core playSound(...) utility for SFX.
    }

    private setupDropHandling(): void {
        let targetDropY = 726;
        const targetYIncrement = gameplayConfig.targetYIncrement;
        const maxToleranceX = gameplayConfig.maxToleranceX;
        let lastBlock = false;

        let spineGood: any;
        let spinePerfect: any;

        const spineFactory = this.add as Phaser.GameObjects.GameObjectFactory & {
            spine: (x: number, y: number, dataKey: string, atlasKey: string) => any;
        };

        const ensureSpine = (type: "good" | "perfect"): any => {
            if (type === "good") {
                if (!spineGood) {
                    spineGood = spineFactory.spine(-400, -400, "good", "good-atlas");
                    spineGood.setVisible(false);
                    this.fxContainer.add(spineGood);
                }
                return spineGood;
            }

            if (!spinePerfect) {
                spinePerfect = spineFactory.spine(-400, -400, "perfect", "perfect-atlas");
                spinePerfect.setVisible(false);
                this.fxContainer.add(spinePerfect);
            }
            return spinePerfect;
        };

        this.input.off("pointerdown");
        this.input.on("pointerdown", () => {
            if (this.currentGameState !== GAME_STATE.PLAYING || this.isGameplayPaused || !this.blockTop.visible) {
                return;
            }
            this.blockTop.setVisible(false);
            this.claw.setTexture("claw2");
            dropTheBlock();
        });

        const dropTheBlock = (): void => {
            const key = gameState.blocks.length >= this.maxBlock - 1 ? "block-top" : "block";
            lastBlock = key === "block-top";

            const block = this.add.sprite(this.blockTop.x, this.blockTop.y, key) as DroppedBlockSprite;
            this.gameplayContainer.add(block);

            if (!isColliding()) {
                targetDropY = this.blockTop.y + 1080 + 200;
                this.tweens.add({
                    targets: block,
                    y: targetDropY,
                    duration: gameplayConfig.dropDurationMiss,
                    ease: "Sine.easeIn",
                    onComplete: () => this.changeGameState(GAME_STATE.GAME_OVER_LOSE)
                });
                return;
            }

            gameState.blocks.push(block);
            this.tweens.add({
                targets: block,
                y: targetDropY,
                duration: gameplayConfig.dropDurationHit,
                ease: "Sine.easeIn",
                onComplete: () => {
                    playSound(this, "hit");
                    this.cameras.main.shake(150, 0.004);
                    gameState.totalStackedBlocks++;

                    const distance = getXDistance();
                    if (distance !== null && distance <= maxToleranceX) {
                        showCollideAnimation(block.x, block.y + 60);
                        if (lastBlock) {
                            playSound(this, "positive");
                            this.time.delayedCall(2000, () => buildingFinish());
                        } else {
                            targetDropY -= targetYIncrement;
                            scrollUp();
                        }

                        block.dropped = true;
                        getDropScore();

                        gameplayConfig.oscillatingBreakpoints.forEach(([count, amount]) => {
                            if (gameState.blocks.length === count) {
                                this.oscillating = amount;
                            }
                        });
                    } else {
                        blockToppling();
                    }

                    this.onBlockAmountUpdated(this.maxBlock - gameState.blocks.length);
                }
            });
        };

        const isColliding = (): boolean => {
            if (gameState.blocks.length < 2) {
                return true;
            }
            const distance = getXDistance();
            return distance !== null && distance < this.blockTop.displayWidth - 5;
        };

        const scrollUp = (): void => {
            let minusY = targetYIncrement;
            const latest = gameState.blocks[gameState.blocks.length - 1];
            if (latest && latest.y - this.blockTop.y > 500) {
                minusY = 0;
            }

            this.tweens.add({
                targets: this.claw,
                y: this.claw.y - minusY,
                duration: gameplayConfig.scrollDuration,
                ease: "Sine.easeInOut"
            });

            this.tweens.add({
                targets: this.cameras.main,
                scrollY: this.cameras.main.scrollY - minusY,
                duration: gameplayConfig.scrollDuration,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    this.blockTop.y -= minusY;
                    this.blockTop.setVisible(true);
                    if (LEVELS[gameState.currentLevel].blockAmount - gameState.totalStackedBlocks === 1) {
                        this.blockTop.setTexture("block-top");
                    }
                    this.claw.setTexture("claw1");
                }
            });
        };

        const getXDistance = (): number | null => {
            if (gameState.blocks.length === 0) {
                return null;
            }
            if (gameState.blocks.length >= 2) {
                const prev = gameState.blocks[gameState.blocks.length - 2];
                const cur = gameState.blocks[gameState.blocks.length - 1];
                return Phaser.Math.Distance.Between(prev.x, 0, cur.x, 0);
            }
            const cur = gameState.blocks[gameState.blocks.length - 1];
            return Phaser.Math.Distance.Between(360, 0, cur.x, 0);
        };

        const getDropScore = (): void => {
            const distance = getXDistance();
            if (distance === null || distance > maxToleranceX) {
                return;
            }

            const calculatedScore = Math.ceil((1 - distance / maxToleranceX) * 50);
            this.onScoreUpdated(calculatedScore);

            if (distance <= 3) {
                showQualityTxt("perfect");
            } else if (distance <= 10) {
                showQualityTxt("good");
            }
        };

        const blockToppling = (): void => {
            playSound(this, "fall");
            const previousX = gameState.blocks.length >= 2
                ? gameState.blocks[gameState.blocks.length - 2].x
                : 360;
            const current = gameState.blocks[gameState.blocks.length - 1];

            this.tweens.add({
                targets: current,
                y: this.cameras.main.scrollY + 1080 + 200,
                duration: 1200,
                ease: "Sine.easeIn",
                onComplete: () => this.changeGameState(GAME_STATE.GAME_OVER_LOSE)
            });

            const rotateLeft = current.x < previousX;
            this.tweens.add({
                targets: current,
                rotation: rotateLeft ? -3 : 3,
                x: current.x + (rotateLeft ? -180 : 180),
                duration: 1200,
                ease: "Sine.easeOut"
            });
        };

        const showCollideAnimation = (x: number, y: number): void => {
            this.collideFx.setVisible(true);
            this.collideFx.setPosition(x, y);
            this.collideFx.play("collide");
        };

        const showQualityTxt = (type: "good" | "perfect"): void => {
            playSound(this, type);
            const spine = ensureSpine(type);
            spine.setVisible(true);
            spine.x = 360;
            spine.y = this.cameras.main.scrollY + 540;
            if (spine.animationState?.setAnimation) {
                spine.animationState.setAnimation(0, "animation", false);
            }
        };

        const buildingFinish = (): void => {
            if (this.currentPoints >= this.requiredPoints) {
                if (gameState.currentLevel < LEVELS.length - 1) {
                    setCurrentLevel(gameState.currentLevel + 1);
                }
                this.changeGameState(GAME_STATE.GAME_OVER_WIN);
            } else {
                this.changeGameState(GAME_STATE.GAME_OVER_LOSE);
            }
        };
    }

    private setupPanels(): void {
        this.allPanels = [this.hudContainer, this.pausePopupContainer, this.endPopupContainer];
        this.popupDark.setVisible(false).disableInteractive();
        this.pausePopupContainer.setVisible(false);
        this.endPopupContainer.setVisible(false);
    }

    private setupInteractions(): void {
        this.tapInteractionHelper(this.pauseBtnNode, () => this.changeGameState(GAME_STATE.PAUSED));
        this.tapInteractionHelper(this.pauseCloseBtnNode, () => this.changeGameState(GAME_STATE.RESUMED));
        this.tapInteractionHelper(this.pauseRestartBtnNode, () => this.changeGameState(GAME_STATE.RESTART));
        this.tapInteractionHelper(this.pauseMapBtnNode, () => this.changeGameState(GAME_STATE.ABANDONED));
        this.tapInteractionHelper(this.endRestartBtnNode, () => this.changeGameState(GAME_STATE.RESTART));
        this.tapInteractionHelper(this.endMapBtnNode, () => this.changeGameState(GAME_STATE.ABANDONED));
        this.tapInteractionHelper(this.endNextBtnNode, () => this.goToLevelSelect());
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

    private setupBridgeListeners(): void {
        this.bridgeUnsubscribers.push(
            shopsyBridge.on(ShopsyMessageAction.GAME_STARTED_ACK, (data) => {
                this.isMaxGameBonusEarned = data?.isMaxGameBonusEarned ?? false;
            })
        );
        this.bridgeUnsubscribers.push(
            shopsyBridge.on(ShopsyMessageAction.GAME_COMPLETED_ACK, (data) => {
                console.log("[City Builder] Game completed ack", data);
            })
        );
    }

    private setupShopsy(): void {
        const bridgeInitialized = this.registry.get("bridgeInitialized");
        if (!bridgeInitialized) {
            console.warn(`[${GAME_NAME}] Bridge not pre-initialized, initializing now...`);
            initShopsyBridge();
            this.registry.set("bridgeInitialized", true);
            shopsyBridge.requestProfile();
            shopsyBridge.requestGameConfig(GAME_ID);
        }

        shopsyBridge.gameLoaded();
        shopsyBridge.startGame();

        const loadDurationMs = this.registry.get("loadDurationMs");
        if (loadDurationMs != null) {
            ShopsyAnalytics.sendGameLoadedEvent(loadDurationMs);
        }

        if (PlayerPrefs.isNewDay) {
            PlayerPrefs.gamesPlayedToday = 0;
            PlayerPrefs.lastLoginDate = new Date().toISOString();
        }

        this.bridgeUnsubscribers.push(
            shopsyBridge.on(ShopsyMessageAction.UPDATE_PROFILE, (data) => {
                const source: "cache" | "server" = data?.source || "cache";
                const profileData = data?.profile || data;
                if (source !== "server" || !profileData) {
                    return;
                }
                UserProfileManager.setProfileData(profileData, source);
                this.onShopsyProfileLoaded();
            })
        );

        this.bridgeUnsubscribers.push(
            shopsyBridge.on(ShopsyMessageAction.UPDATE_GAME_CONFIG, (config: any) => {
                this.onShopsyGameConfigLoaded(config?.gameConfig ?? config);
            })
        );

        const pauseAudio = () => this.sound.pauseAll();
        const resumeAudio = () => this.sound.resumeAll();
        document.addEventListener("visibilitychange", () => {
            document.hidden ? pauseAudio() : resumeAudio();
        });
        this.game.events.on(Phaser.Core.Events.BLUR, pauseAudio);
        this.game.events.on(Phaser.Core.Events.FOCUS, resumeAudio);
    }

    private onShopsyProfileLoaded(): void {
        // City Builder currently has no profile text label in gameplay HUD.
        // Reserved for template parity and future profile UI.
    }

    private onShopsyGameConfigLoaded(gameConfig: any): void {
        applyGameplayConfig({
            maxToleranceX: gameConfig?.maxToleranceX,
            targetYIncrement: gameConfig?.targetYIncrement,
            dropDurationHit: gameConfig?.dropDurationHit,
            dropDurationMiss: gameConfig?.dropDurationMiss,
            scrollDuration: gameConfig?.scrollDuration,
            oscillatingBreakpoints: gameConfig?.oscillatingBreakpoints
        });
    }

    private cleanupBridgeListeners(): void {
        this.bridgeUnsubscribers.forEach((unsubscribe) => unsubscribe());
        this.bridgeUnsubscribers = [];
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
            case GAME_PANEL.PAUSE_PANEL:
                panelsToShow = [this.hudContainer, this.pausePopupContainer];
                this.popupDark.setVisible(true).setInteractive();
                break;
            case GAME_PANEL.GAME_OVER_WIN_PANEL:
            case GAME_PANEL.GAME_OVER_LOSE_PANEL:
                panelsToShow = [this.hudContainer, this.endPopupContainer];
                this.popupDark.setVisible(true).setInteractive();
                break;
            case GAME_PANEL.ERROR_PANEL:
                panelsToShow = [this.hudContainer];
                if (this.errorPanelContainer) {
                    panelsToShow.push(this.errorPanelContainer);
                }
                this.popupDark.setVisible(true).setInteractive();
                break;
            case GAME_PANEL.SHARE_PANEL:
                panelsToShow = [this.hudContainer];
                if (this.share_panel_container) {
                    panelsToShow.push(this.share_panel_container);
                }
                this.popupDark.setVisible(true).setInteractive();
                break;
            case GAME_PANEL.GAMEPLAY_PANEL:
            default:
                panelsToShow = [this.hudContainer];
                break;
        }

        this.allPanels.forEach((panelItem) => {
            panelItem.setVisible(panelsToShow.includes(panelItem));
            this.children.bringToTop(panelItem);
        });

        if (this.popupDark.visible) {
            this.popupDark.alpha = 0;
            this.tweens.add({ targets: this.popupDark, alpha: 0.5, duration: 200 });
            this.children.bringToTop(this.popupDark);
            panelsToShow.forEach((panelItem) => this.children.bringToTop(panelItem));
        }
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
                this.startGame();
                break;
            case GAME_STATE.PAUSED:
                this.pauseGame();
                break;
            case GAME_STATE.RESUMED:
                this.resumeGame();
                break;
            case GAME_STATE.GAME_OVER_WIN:
                this.onGameWon();
                break;
            case GAME_STATE.GAME_OVER_LOSE:
                this.onGameLost();
                break;
            case GAME_STATE.RESTART:
                this.restartGame();
                break;
            case GAME_STATE.SHARING:
                this.shareGame();
                break;
            case GAME_STATE.ERROR:
                this.showError();
                break;
            case GAME_STATE.ABANDONED:
                this.abandonGame();
                break;
            case GAME_STATE.PLAYING:
            default:
                break;
        }
    }

    private preGame(): void {
        this.currentPoints = 0;
        this.score = 0;
        this.txtPoints.setColor("#FFFFFF");
        this.txtPointsAdded.setText("");
        this.changePanel(GAME_PANEL.GAMEPLAY_PANEL);
    }

    private startGame(): void {
        this.gameStartTime = this.time.now;
        this.timePlayedMs = 0;
        this.currentPoints = 0;
        this.score = 0;
        this.isMaxGameBonusEarned = false;
        this.isGameplayPaused = false;

        shopsyBridge.roundStarted();
        PlayerPrefs.gamesPlayedToday++;
        PlayerPrefs.gamesPlayedTotal++;
        ShopsyAnalytics.sendGameStartedEvent();

        this.changeGameState(GAME_STATE.PLAYING);
        this.changePanel(GAME_PANEL.GAMEPLAY_PANEL);
    }

    private pauseGame(): void {
        if (this.previousGameState === GAME_STATE.PLAYING) {
            this.isGameplayPaused = true;
            this.tweens.pauseAll();
        }
        this.changePanel(GAME_PANEL.PAUSE_PANEL);
    }

    private resumeGame(): void {
        this.isGameplayPaused = false;
        this.tweens.resumeAll();
        this.changeGameState(GAME_STATE.PLAYING);
        this.changePanel(GAME_PANEL.GAMEPLAY_PANEL);
    }

    private onScoreUpdated(addedScore: number): void {
        this.currentPoints += addedScore;
        this.score = this.currentPoints;
        this.txtPoints.setText(`${this.currentPoints}/${this.requiredPoints}`);
        if (this.currentPoints > this.requiredPoints) {
            this.txtPoints.setColor("#54ff82");
        }
        this.txtPointsAdded.setText(`+${addedScore}`);
        this.time.delayedCall(1000, () => this.txtPointsAdded.setText(""));
    }

    private onBlockAmountUpdated(value: number): void {
        this.txtBlocks.setText(String(value));
    }

    private onGameOver(result: "win" | "lost"): void {
        this.timePlayedMs = this.time.now - this.gameStartTime;
        this.score = this.currentPoints;

        shopsyBridge.gameCompleted({
            gems: this.score,
            playTimeInSec: Math.floor(this.timePlayedMs / 1000)
        });

        const coinsWon = this.isMaxGameBonusEarned
            ? 0
            : UserProfileManager.getProfileData()?.claimableRewards?.perGameRewardCoinsForToday || 0;

        ShopsyAnalytics.sendGameFinishedEvent(this.score, coinsWon, result, this.timePlayedMs);
        ShopsyAnalytics.sendCoinsEarnedEvent(coinsWon);
    }

    private onGameLost(): void {
        playSound(this, "gameover");
        this.onGameOver("lost");
        this.endTitle.setText("STAGE FAILED!");
        this.endBlocks.setText(`${gameState.totalStackedBlocks}/${this.maxBlock}`);
        this.endPoints.setText(`${this.currentPoints}/${this.requiredPoints}`);
        this.endRestartButton.setVisible(true);
        this.endMapButton.setVisible(true);
        this.endNextButton.setVisible(false);
        this.changePanel(GAME_PANEL.GAME_OVER_LOSE_PANEL);
    }

    private onGameWon(): void {
        playSound(this, "completed");
        this.onGameOver("win");
        this.endTitle.setText("COMPLETED!");
        this.endBlocks.setText(`${gameState.totalStackedBlocks}/${this.maxBlock}`);
        this.endPoints.setText(`${this.currentPoints}/${this.requiredPoints}`);
        this.endRestartButton.setVisible(false);
        this.endMapButton.setVisible(false);
        this.endNextButton.setVisible(true);
        this.changePanel(GAME_PANEL.GAME_OVER_WIN_PANEL);
    }

    private restartGame(): void {
        this.scene.restart();
    }

    private abandonGame(): void {
        this.timePlayedMs = this.time.now - this.gameStartTime;
        ShopsyAnalytics.sendGameAbandonedEvent(this.currentPoints, this.timePlayedMs);

        const coinsWon = this.isMaxGameBonusEarned
            ? 0
            : UserProfileManager.getProfileData()?.claimableRewards?.perGameRewardCoinsForToday || 0;
        ShopsyAnalytics.sendCoinsEarnedEvent(coinsWon);

        if (shopsyBridge.isNative) {
            shopsyBridge.exitGame();
            return;
        }

        this.goToLevelSelect();
    }

    private shareGame(): void {
        this.changePanel(GAME_PANEL.SHARE_PANEL);
        if (this.shareManager) {
            void this.shareManager.ExecuteShareFlow();
            return;
        }
        this.goToLevelSelect();
    }

    private showError(): void {
        this.changePanel(GAME_PANEL.ERROR_PANEL);
        this.errorPopupManager?.showError(ErrorType.FATAL);
    }

    private goToLevelSelect(): void {
        this.scene.start("LevelSelect");
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
