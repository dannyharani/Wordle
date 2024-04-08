import { fail } from "@sveltejs/kit";
import { Game } from "./game";
import type { PageServerLoad, Actions } from "@sveltejs/kit";

export const load = (({cookies}) => {
    const game = new Game(cookies.get('wordle'));

    return {
        guesses: game.guesses,
        hints: game.hints,
        hint: game.hints.length >= 6 ? game.hint : null,
    };
}) satisfies PageServerLoad;

export const actions = {
    update: async ({request, cookies}) => {
        const game = new Game(cookies.get('wordle'));

        const data = await request.formData();
        const key = data.get('key');
        const i = game.hints.length;

        if (key === 'backspace') {
            game.guesses[i] = game.guesses[i].slice(0, -1);
        } else {
            game.guesses[i] += key;
        }

        cookies.set('wordle', game.toString(), { path: '/'});
    },

    enter: async ({request, cookies}) => {
        const game = new Game(cookies.get('wordle'));

        const data = await request.formData();
        const guess = data.getAll('guess') as string[];

        if (!game.enter(guess)) {
            return fail(400, {invalidGuess: true});
        }

        cookies.set('wordle', game.toString(), { path: '/'});
    },

    restart: async ({cookies}) => {
        cookies.delete('wordle', { path: '/'})
    },

} satisfies Actions;