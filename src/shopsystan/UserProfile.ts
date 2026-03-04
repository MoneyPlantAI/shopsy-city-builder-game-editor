
export interface UserProfile {

    basic: UserProfileBasic;
    login: UserProfileLogin;
    gameStats: UserProfileGameStats;
    earnings: UserProfileEarnings;
    claimableRewards: UserProfileClaimableRewards;

}

export interface UserProfileBasic {
    userId?: string;
    userName?: string;
    avatarUrl?: string;
    authToken?: string;
}

export interface UserProfileLogin {
    lastLoggedInOn?: string | null;
    loginDay?: number;
    loginStreak?: number;
    dailyLoginAwarded?: boolean;

    isFirstVisit?: boolean;
    ftueRewardGiven?: boolean;
}

export interface UserProfileGameStats {
    gamesPlayedToday?: number;
    gamesPlayedTotal?: number;
    mostPlayedGame?: string;
    mostPlayedGameCount?: number;
    totalPlayTimeSec?: number;
}

export interface UserProfileEarnings {
    gemsEarnedToday?: number;
    gemsEarnedTotal?: number;
    coinsEarnedTotal?: number;
    totalCoinsEarnedToday?: number;
    currentGems?: number;
    // currentCoins?: number;
}

export interface UserProfileClaimableRewards {
    loginRewardCoinsForToday?: number;
    perGameRewardCoinsForToday?: number;
    maxEarnableCoinForToday?: number;

    claimableGameRewardCoins?: number;
    claimableLoginRewardCoins?: number;
    claimableSignupRewardCoins?: number;
    lockedLoginRewardCoins?: number;
    lockedGameRewardCoins?: number;
}