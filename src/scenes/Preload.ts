
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { applyGameplayConfig } from "../core/state";
import UserProfileManager from "../shopsystan/UserProfileManager";
import { ShopsyAnalytics } from "../shopsystan/shopsyAnalytics";
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

		// progressBar
		const progressBar = this.add.rectangle(553.0120849609375, 361, 256, 20);
		progressBar.setOrigin(0, 0);
		progressBar.isFilled = true;
		progressBar.fillColor = 14737632;

		// progressBarBg
		const progressBarBg = this.add.rectangle(553.0120849609375, 361, 256, 20);
		progressBarBg.setOrigin(0, 0);
		progressBarBg.fillColor = 14737632;
		progressBarBg.isStroked = true;

		// loadingText
		const loadingText = this.add.text(552.0120849609375, 329, "", {});
		loadingText.text = "Loading...";
		loadingText.setStyle({ "color": "#e0e0e0", "fontFamily": "arial", "fontSize": "20px" });

		this.progressBar = progressBar;

		this.events.emit("scene-awake");
	}

	private progressBar!: Phaser.GameObjects.Rectangle;

	/* START-USER-CODE */

	private loadDurationMs = 0;
	private bridgeListenersReady = false;
	private gameConfigLoaded = false;

	preload() {

		this.editorCreate();
		this.registry.set("loadStartTime", performance.now());

		this.load.pack("asset-pack", "assets/asset-pack.json");

		const width = this.progressBar.width;

		this.load.on("progress", (value: number) => {

			this.progressBar.width = width * value;
		});

		this.load.on("complete", () => {
			const start = this.registry.get("loadStartTime");
			const durationMs = performance.now() - start;
			this.loadDurationMs = durationMs;
			this.registry.set("loadDurationMs", durationMs);
		});
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
		shopsyBridge.gameLoaded();
		shopsyBridge.startGame();
		if (this.loadDurationMs > 0) {
			ShopsyAnalytics.sendGameLoadedEvent(this.loadDurationMs);
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
		const shouldExit = window.confirm("Unable to login. Close game?");
		if (shouldExit) {
			shopsyBridge.exitGame();
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
