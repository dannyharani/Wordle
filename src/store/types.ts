export interface InitialGuesses {
    word: string;
    timesUsed: number;
    timesWon: number;
    totalGuessesForWin: number;
}

export interface WordleUserStats {
    longestWinStreak: number;
    currentWinStreak: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    dailyStreak: number;
    totalGuesses: number;
}