import { shopsyBridge } from "../shopsystan/shopsyBridge";
import { GAME_ID } from "../utils/config";
import { PlayerPrefs } from "../utils/PlayerPrefs";

export class ShopsyAnalytics {

    static sendGameLoadedEvent(loadDurationMs: any) {
        console.log("Load duration (ms):", loadDurationMs);
        shopsyBridge.analyticsEvent("Game_Entered", {
            "load_time": Math.round(loadDurationMs / 1000),
            "game_id": GAME_ID
        });
    }

    static sendGameStartedEvent() {
        shopsyBridge.analyticsEvent("Game_Started", {
            "game_id": GAME_ID,
            "daily_attempt_number": PlayerPrefs.gamesPlayedToday,
            "total_attempt_number": PlayerPrefs.gamesPlayedTotal
        });
    }

    static sendGameFinishedEvent(score: number, coinsWon: number, gameResult: string, timePlayedMs: number) {
        shopsyBridge.analyticsEvent("Game_Finished", {
            "game_id": GAME_ID,
            "score": score,
            "coins_earned": coinsWon,
            "result": gameResult,
            "play_time": Math.floor(timePlayedMs / 1000)
        });
    }

    static sendCoinsEarnedEvent(coinsEarned: number) {
        shopsyBridge.analyticsEvent("Coins_Earned", {
            "game_id": GAME_ID,
            "coins_earned": coinsEarned
        });
    }

    static sendGameAbandonedEvent(score: number, timePlayedMs: number) {
        shopsyBridge.analyticsEvent("Game_Abandoned", {
            "game_id": GAME_ID,
            "score": score,
            "coins_earned": 0,
            "play_time": Math.floor(timePlayedMs / 1000)
        });
    }

    static sendScoreSharedEvent(success: boolean, score: number) {
        shopsyBridge.analyticsEvent("Score_Shared", {
            "success": success,
            "game_id": GAME_ID,
            "score": score,
        });
    }
}