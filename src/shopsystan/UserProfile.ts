
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
}

export interface UserProfileLogin {
    lastLoggedInOn?: string | null;
    loginDay?: number;
    loginStreak?: number;
    dailyLoginAwarded?: boolean;
    isFirstVisit?: boolean;
    ftueCompleted?: boolean;
    isFirstLoginToday?: boolean;
}

export interface UserProfileGameStats {
    games: UserProfileGameStat[];
}

export interface UserProfileGameStat {
    gameName?: string;
    rewards?: UserProfileGameStatReward;
    stats?: UserProfileGameStatStat;
}

export interface UserProfileGameStatReward {
    coinsEarnedToday?: number;
    coinsEarnedTotal?: number;
    isMaxGameBonusEarned?: boolean;
}

export interface UserProfileGameStatStat {
    gamesPlayedToday?: number;
    gamesPlayedTotal?: number;

}

export interface UserProfileEarnings {
    coinsEarnedTotal?: number;
    coinsEarnedToday?: number;
    coinsEarnedMonthly?: number;
    isMaxGameBonusEarnedToday?: boolean;
    monthlyRewardBonusAwarded?: boolean;
    isRewardJourneyCompleted?: boolean;
    newMonthRewardsJourneyStarted?: boolean;

}



export interface UserProfileClaimableRewards {

}