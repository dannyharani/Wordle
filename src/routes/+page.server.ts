import { fail } from '@sveltejs/kit';
import { Game } from './game';
import { getFirebaseAdminAuth, getFirestoreAdmin } from '$lib/firebase/firebase.admin';
import admin from 'firebase-admin';
import type { PageServerLoad, Actions } from '@sveltejs/kit';
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';

export const load = (({ cookies }) => {
    const game = new Game(cookies.get('wordle'));

    return {
        guesses: game.guesses,
        hints: game.hints,
        answer: game.hints.length >= 6 ? game.answer : null
    };
}) satisfies PageServerLoad;

type wordObj = { word: string; timesUsed: number; timesWon: number; totalGuessesForWin: number };

export const actions = {
    update: async ({ request, cookies }) => {
        const game = new Game(cookies.get('wordle'));

        const data = await request.formData();
        const key = data.get('key');
        const i = game.hints.length;

        if (key === 'backspace') {
            game.guesses[i] = game.guesses[i].slice(0, -1);
        } else {
            game.guesses[i] += key;
        }

        cookies.set('wordle', game.toString(), { path: '/' });
    },

    enter: async ({ request, cookies }) => {
        const game = new Game(cookies.get('wordle'));

        const data = await request.formData();
        const guess = data.getAll('guess') as string[];
		const initialGuess = data.get('initialGuess') as string;

        if (!game.enter(guess)) {
            return fail(400, { invalidGuess: true });
        }

        const userToken = data.get('uid') as string;

        if (userToken) {
            const firebaseAdmin = getFirebaseAdminAuth();
            const decodedToken = await firebaseAdmin.verifyIdToken(userToken);
            const firebaseFirestore = getFirestoreAdmin();

            if (!decodedToken) {
                return;
            }

            const user = decodedToken.uid;

            if (game.hints.length === 1) {
                const word = guess.join('');

                const db = firebaseFirestore;

                const startWords = await db.collection('startWords').doc(user).get();

                if (startWords.exists) {
                    const wordArray = startWords?.data()?.words;

                    const wordToUpdate = wordArray.find(
                        (wordObj: wordObj) => wordObj.word === word
                    );
                    if (wordToUpdate) {
                        wordToUpdate.timesUsed += 1;
                    } else {
                        wordArray.push({
                            word: word,
                            timesUsed: 1,
                            timesWon: 0,
                            totalGuessesForWin: 0
                        });
                    }
                    await db.collection('startWords').doc(user).update({ words: wordArray });
                } else {
                    const wordArray = [
                        { word: word, timesUsed: 1, timesWon: 0, totalGuessesForWin: 0 }
                    ];
                    await db.collection('startWords').doc(user).set({ words: wordArray });
                }
            } else if (game.hints[game.hints.length - 1] === 'xxxxx') {
                const word = initialGuess;

                const db = firebaseFirestore;

                let startWords = await db.collection('startWords').doc(user).get();

                if (!startWords.exists) {
                    const wordArray = [
                        { word: word, timesUsed: 1, timesWon: 0, totalGuessesForWin: 0 }
                    ];
                    db.collection('startWords').doc(user).set({ words: wordArray });

                    startWords = await db.collection('startWords').doc(user).get();
                }

                const wordArray = startWords?.data()?.words;

                const wordToUpdate = wordArray.find((wordObj: wordObj) => wordObj.word === word);
                wordToUpdate.timesWon += 1;
                wordToUpdate.totalGuessesForWin += game.hints.length;

                await db.collection('startWords').doc(user).update({ words: wordArray });

                await db
                    .collection('wordleUserStats')
                    .doc(user)
                    .update({
                        currentWinStreak: admin.firestore.FieldValue.increment(1),
                        totalGamesPlayed: admin.firestore.FieldValue.increment(1),
                        totalGamesWon: admin.firestore.FieldValue.increment(1),
                        totalGuesses: admin.firestore.FieldValue.increment(game.hints.length)
                    });
            } else if (game.hints.length === 6) {
                const db = firebaseFirestore;

                await db
                    .collection('wordleUserStats')
                    .doc(user)
                    .update(
                        'currentWinStreak',
                        0,
                        'totalGamesPlayed',
                        admin.firestore.FieldValue.increment(1)
                    );
            }
        }
		cookies.set('wordle', game.toString(), { path: '/' });
    },

    restart: async ({ cookies }) => {
        cookies.delete('wordle', { path: '/' });
    }
} satisfies Actions;
