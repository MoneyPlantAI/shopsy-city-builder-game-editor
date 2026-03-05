
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { applyGameplayConfig } from "../core/state";
import UserProfileManager from "../shopsystan/UserProfileManager";
import { initShopsyBridge, shopsyBridge, ShopsyMessageAction } from "../shopsystan/shopsyBridge";
import { GAME_ID } from "../utils/config";
import { PlayerPrefs } from "../utils/PlayerPrefs";
/* END-USER-IMPORTS */

export default class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// Loading_BG-min
		this.add.image(540, 960, "loading-bg-min");

		// LoadingBar_BG-min
		this.add.image(540, 1832, "loading-bar-bg-min");

		// loadingBarFg
		const loadingBarFg = this.add.image(64, 1832, "loading-bar-fg-min");
		loadingBarFg.setOrigin(0, 0.5);

		// Loading_Text-min
		this.add.image(208, 1743, "loading-text-min");

		// text_1
		const text_1 = this.add.text(844, 1699, "", {});
		text_1.name = "text_1";
		text_1.text = "100%";
		text_1.setStyle({ "color": "#28ff62ff", "fontFamily": "bebas", "fontSize": "60px", "stroke": "#2a0509", "strokeThickness": 12 });

		// error_container
		const error_container = this.add.container(0, 0);
		error_container.visible = false;

		// shadowbox
		const shadowbox = this.add.rectangle(540, 960, 2048, 2048);
		shadowbox.isFilled = true;
		shadowbox.fillColor = 3348504;
		shadowbox.fillAlpha = 0.5;
		error_container.add(shadowbox);

		// error_box_preload
		const error_box_preload = this.add.image(540, 960, "error-box-preload");
		error_container.add(error_box_preload);

		// preload_error_btn
		const preload_error_btn = this.add.image(540, 1474, "error-button-preload");
		error_container.add(preload_error_btn);

		// error_box_preload_2
		const error_box_preload_2 = this.add.image(170, 811, "error-char-preload");
		error_container.add(error_box_preload_2);

		// text
		const text = this.add.text(382, 877, "", {});
		text.name = "text";
		text.text = "Oops! Unable to login,\nPlease try later";
		text.setStyle({ "align": "center", "color": "#ffffffff", "fontFamily": "bebas", "fontSize": "50px", "stroke": "#2a0509", "strokeThickness": 12 });
		error_container.add(text);

		// text_2
		const text_2 = this.add.text(540, 1476, "", {});
		text_2.name = "text_2";
		text_2.setOrigin(0.5, 0.5);
		text_2.text = "Close";
		text_2.setStyle({ "align": "center", "color": "#ffffffff", "fontFamily": "bebas", "fontSize": "60px", "stroke": "#2a0509", "strokeThickness": 12 });
		error_container.add(text_2);

		this.loadingBarFg = loadingBarFg;
		this.preload_error_btn = preload_error_btn;
		this.error_container = error_container;

		this.events.emit("scene-awake");
	}

	private loadingBarFg!: Phaser.GameObjects.Image;
	private preload_error_btn!: Phaser.GameObjects.Image;
	private error_container!: Phaser.GameObjects.Container;

	/* START-USER-CODE */

	private loadDurationMs = 0;
	private bridgeListenersReady = false;
	private gameConfigLoaded = false;

	private loadingText!: Phaser.GameObjects.Text;
	private fullWidth!: number;

	preload() {

		this.editorCreate();

		// Load Start time 
		this.registry.set("loadStartTime", performance.now());

		this.fullWidth = this.loadingBarFg.width;
		this.loadingText = this.children.getByName("text_1") as Phaser.GameObjects.Text;

		this.load.on("progress", (value: number) => {
			this.loadingText.setText(`${Math.round(value * 100)}%`);
			this.loadingBarFg.setCrop(0, 0, this.fullWidth * value, this.loadingBarFg.height);
		});

		this.load.on("complete", () => {
			const start = this.registry.get("loadStartTime");
			const durationMs = performance.now() - start;

			this.registry.set("loadDurationMs", durationMs);
		});

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	create() {
		void this.initializeAndLaunch();
	}

	private async initializeAndLaunch(): Promise<void> {
		this.setupBridgeListeners();
		await this.initializeBridge();

		if (process.env.NODE_ENV === "development") {

			const start = new URLSearchParams(location.search).get("start");

			if (start) {

				console.log(`Development: jump to ${start}`);
				this.scene.start(start);

				return;
			}
		}

		if (!import.meta.env.DEV) {
			const profile = await this.waitForServerProfile();
			if (!profile) {
				this.showProfileError();
				return;
			}
			UserProfileManager.setProfileData(profile, "server");
		}

		if (!this.gameConfigLoaded) {
			shopsyBridge.requestGameConfig(GAME_ID);
		}

		this.scene.start("LevelSelect");
	}

	private async initializeBridge(): Promise<void> {
		const bridgeInitialized = this.registry.get("bridgeInitialized");
		if (!bridgeInitialized) {
			initShopsyBridge();
			await shopsyBridge.waitUntilReady();
			this.registry.set("bridgeInitialized", true);
		}

		PlayerPrefs.init();
		PlayerPrefs.migrateLegacyPrefs();
		try {
			await PlayerPrefs.hydrate();
		} catch (error) {
			console.warn("[Preload] PlayerPrefs hydration fallback:", error);
		}
	}

	private setupBridgeListeners(): void {
		if (this.bridgeListenersReady) {
			return;
		}
		this.bridgeListenersReady = true;

		shopsyBridge.on(ShopsyMessageAction.UPDATE_PROFILE, (data) => {
			const source: "cache" | "server" = data?.source || "cache";
			const profileData = data?.profile || data;
			if (!profileData) {
				return;
			}
			UserProfileManager.setProfileData(profileData, source);
		});

		shopsyBridge.on(ShopsyMessageAction.UPDATE_GAME_CONFIG, (config: any) => {
			this.gameConfigLoaded = true;
			this.onShopsyGameConfigLoaded(config?.gameConfig ?? config);
		});
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

	private async waitForServerProfile(): Promise<any | null> {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let unsubscribe: (() => void) | null = null;

		const cleanup = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
			if (unsubscribe) {
				unsubscribe();
				unsubscribe = null;
			}
		};

		this.events.once("shutdown", cleanup);
		this.events.once("destroy", cleanup);

		return new Promise((resolve) => {
			timeoutId = setTimeout(() => {
				cleanup();
				resolve(null);
			}, 30000);

			unsubscribe = shopsyBridge.on(ShopsyMessageAction.UPDATE_PROFILE, (data) => {
				const source = data?.source || "server";
				const profileData = data?.profile || data;
				if (source !== "server") {
					return;
				}
				if (!profileData) {
					cleanup();
					resolve(null);
					return;
				}
				cleanup();
				resolve(profileData);
			});

			shopsyBridge.requestProfile();
		});
	}

	private showProfileError(): void {
		console.error('[Preload] Profile unavailable or invalid. Blocking Game launch.');
		this.error_container.setVisible(true);
		this.preload_error_btn.setInteractive({ useHandCursor: true, pixelPerfect: true });
		this.preload_error_btn.on('pointerdown', () => {
			shopsyBridge.exitGame();
		});

	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
