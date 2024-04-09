import { fail } from '@sveltejs/kit';
import { Game } from './game';
import type { PageServerLoad, Actions } from '@sveltejs/kit';
import { firebaseAuth, firebaseFirestore } from '$lib/firebase/firebase.app';
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';

export const load = (({ cookies }) => {
	const game = new Game(cookies.get('wordle'));

	const user = firebaseAuth.currentUser;

	return {
		guesses: game.guesses,
		hints: game.hints,
		answer: game.hints.length >= 6 ? game.hint : null,
		user: user
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
			game.guesses[i] += key;
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

		const user = data.get('uid') as string;

        if (user) {
            // if (game.hints.length === 1) {
            //     // find and update initial words. If word exists, increment usedCount. If not, add new word.
            //     // updateDoc(doc(firebaseFirestore, 'wordleUserStats', user), {
                    
            //     // };
            // }

            if (game.hints[game.hints.length - 1] === 'xxxxx') {
                // use initial word to update winCount
              updateDoc(doc(firebaseFirestore, 'wordleUserStats', user), {
                uid: user, // Include the UID
                currentWinStreak: increment(1),
                totalGamesPlayed: increment(1),
                totalGamesWon: increment(1),
                totalGuesses: increment(game.hints.length)
              });
            } else if (game.hints.length === 6) {
              updateDoc(doc(firebaseFirestore, 'wordleUserStats', user), {
                uid: user, // Include the UID
                currentWinStreak: 0,
                totalGamesPlayed: increment(1),
              });
            }
        }
		cookies.set('wordle', game.toString(), { path: '/' });
	},

	restart: async ({ cookies }) => {
		cookies.delete('wordle', { path: '/' });
	}
} satisfies Actions;
