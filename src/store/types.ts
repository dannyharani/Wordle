export interface InitialGuesses {
    word: string;
    usedCount: number;
    winCount: number;
    totalGuesses: number;
}

export interface WordleUserStats {
    initialGuesses: [InitialGuesses];
    longestWinStreak: number;
    currentWinStreak: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    dailyStreak: number;
    totalGuesses: number;
}