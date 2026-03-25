export default class GameResponseManager {

    private static gameStartedResponse: GameStartedResponse;

    private static gameEndedResponse: GameEndedResponse;

    static setGameStartedResponse(data: GameStartedResponse) {
        this.gameStartedResponse = data;
    }

    static setGameEndedResponse(data: GameEndedResponse) {
        this.gameEndedResponse = data;
    }

    static getCoinsEarnedForGame() {
        return this.gameEndedResponse?.coinsEarnedForGame || 0;
    }
}

export interface GameStartedResponse {
    sessionId: string;
    userId: string;
    gameId: string;
    isMaxGameBonusEarned: boolean;
    maxCoinsBonus: number;
    earnableCoins: number;
    perGameBonus: number;
}

export interface GameEndedResponse {
    userId: string;
    message: string;
    playTimeInSec: number;
    gemsEarned: number;
    totalCoinsEarnedToday: number;
    coinsEarnedTotal: number;
    coinsEarnedForGame: number;
}