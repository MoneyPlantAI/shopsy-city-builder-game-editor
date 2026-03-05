import { shopsyBridge } from "../shopsystan/shopsyBridge";
import { GAME_NAME, GAME_ID } from "../utils/config";
import { ensureShareFontsLoaded, serializeShareCard, renderShareCardToBase64 } from "./ShareCardRenderer";
import { SHARE_MESSAGE } from "../utils/config";
import { ShopsyAnalytics } from "../shopsystan/shopsyAnalytics";
import { ShopsyMessageAction } from "../shopsystan/shopsyBridge";

export class ShareManager {
    private scene: any;
    private initialized = false;

    private isSharing: boolean = false;
    private isFontLoaded: boolean = false;

    constructor(scene: any) {
        this.scene = scene;
    }

    public init() {
        if (this.initialized) return;
        this.initialized = true;

        this.setupBridgeListeners();
    }

    private setupBridgeListeners() {
        shopsyBridge.on(ShopsyMessageAction.SHARE_SUCCESS, (data: any) => this.onShareSuccess(data));
        shopsyBridge.on(ShopsyMessageAction.SHARE_FAILED, (data: any) => this.onShareFailure(data));
    }


    private onShareSuccess(data: any) {
        ShopsyAnalytics.sendScoreSharedEvent(true, this.scene.score);
        console.error("[SHARE] Share success", data);
        this.shareCleanup();
    }

    private onShareFailure(data: any) {
        ShopsyAnalytics.sendScoreSharedEvent(false, this.scene.score);
        console.error("[SHARE] Share failed", data);
        this.shareCleanup();
    }

    private shareCleanup() {
        this.isSharing = false;
        this.scene.goToPreviousPanel();
    }



    async ExecuteShareFlow(): Promise<void> {

        if (this.isSharing) return;
        this.isSharing = true;

        if (!this.isFontLoaded) {
            await ensureShareFontsLoaded();
            this.isFontLoaded = true;
        }


        try {
            console.log("[SHARE] Starting share flow");
            const elements = serializeShareCard(this.scene.share_panel_container);
            const base64 = await renderShareCardToBase64(
                { score: this.scene.score, title: `${GAME_NAME} Score` },
                this.scene.textures,
                elements,
                this.scene.scale.gameSize.width,
                this.scene.scale.gameSize.height
            );

            const shareText = SHARE_MESSAGE.replace('PLACEHOLDER_SCORE', this.scene.score.toString());

            shopsyBridge.shareContent(shareText, {
                image: base64,
                title: `${GAME_NAME} Score`,
                gameId: GAME_ID,
                score: this.scene.score,
                timeMs: this.scene.timePlayedMs
            });
        } catch (error) {
            console.error('[SHARE] Failed to render share card', error);
            this.shareCleanup();
        }
    }
}
