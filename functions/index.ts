import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface InitialGuesses {
    word: string;
    usedCount: number;
    winCount: number;

}

interface WordleUserStats {
    initialGuesses: [InitialGuesses];
    successfulGuessesInRow: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    dailyStreak: number;
}

exports.createUserDoc = functions.auth.user().onCreate((user) => {
    const db = admin.firestore();
    const initializeData: WordleUserStats = {
        initialGuesses: [{
            word: '',
            usedCount: 0,
            winCount: 0
        }],
        successfulGuessesInRow: 0,
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        dailyStreak: 0
    }
    return db.collection('wordleUserStats').doc(user.uid).set(initializeData);
});