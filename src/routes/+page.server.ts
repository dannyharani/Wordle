import { fail } from '@sveltejs/kit';
import { Game } from './game';
import { getFirebaseAdminAuth, getFirestoreAdmin, FieldValue } from '$lib/firebase/firebase.admin';
import type { PageServerLoad, Actions } from '@sveltejs/kit';
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';


export const load = (({ cookies }) => {
	const game = new Game(cookies.get('wordle'));

	return {
		guesses: game.guesses,
		hints: game.hints,
		answer: game.hints.length >= 6 ? game.answer : null,
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('wordle'));

		const data = await request.formData();
		const key = data.get('key');
		const i = game.hints.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key
		}

		cookies.set('wordle', game.toString(), { path: '/' });
	},

	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('wordle'));

		const data = await request.formData();
		const guess = data.getAll('guess') as string[];

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
				console.log(startWords);

				if(startWords.exists) {
					const wordArray = startWords.data().words;

					let wordToUpdate = wordArray.find((wordObj) => wordObj.word === word);
					if(wordToUpdate) {
						wordToUpdate.timesUsed += 1;
					} else {
						wordArray.push({word: word, timesUsed: 1, timesWon: 0, totalGuessesForWin: 0});
					}
					await db.collection('startWords').doc(user).update({words: wordArray});
				} else {
					const wordArray = [{word: word, timesUsed: 1, timesWon: 0, totalGuessesForWin: 0}];
					await db.collection('startWords').doc(user).set({words: wordArray});
				}

			} else if (game.hints[game.hints.length - 1] === 'xxxxx') {
				const word = guess.join('');

				const db = firebaseFirestore;

				const startWords = await db.collection('startWords').doc(user).get();
				const wordArray = startWords.data().words;

				let wordToUpdate = wordArray.find((wordObj) => wordObj.word === word);
				wordToUpdate.timesWon += 1;
				wordToUpdate.totalGuessesForWin += game.hints.length;

				await db.collection('startWords').doc(user).update({words: wordArray});

				const userStats = await db.collection('wordleUserStats').doc(user).get();
				const userStatsData = userStats.data();

				await db.collection('wordleUserStats').doc(user).update({
					currentWinStreak: increment(1),
					totalGamesPlayed: increment(1),
					totalGamesWon: increment(1),
					totalGuesses: increment(game.hints.length)
				});
			} else if (game.hints.length === 6) {
				const db = firebaseFirestore;

				const userStats = await db.collection('wordleUserStats').doc(user).get();
				const userStatsData = userStats.data();

				await db.collection('wordleUserStats').doc(user).update(
					'currentWinStreak', 0,
					'totalGamesPlayed', FieldValue.increment(1)
				);
			}
			cookies.set('wordle', game.toString(), { path: '/' });
		}
	},

	restart: async ({ cookies }) => {
		cookies.delete('wordle', { path: '/' });
	}
} satisfies Actions;
