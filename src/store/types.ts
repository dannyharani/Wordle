export interface InitialGuesses {
    word: string;
    usedCount: number;
    winCount: number;
}

export interface WordleUserStats {
    initialGuesses: [InitialGuesses];
    longestWinStreak: number;
    successfulGuessesInRow: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    dailyStreak: number;
}