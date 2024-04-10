export interface InitialGuesses {
    word: {
        timesUsed: number;
        timesWon: number;
        totalGuessesTilWin: number;
    }
}

export interface WordleUserStats {
    longestWinStreak: number;
    currentWinStreak: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    dailyStreak: number;
    totalGuesses: number;
}