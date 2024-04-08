import { words, guessable } from './words.server';

export class Game {
    index: number;
    guesses: string[];
    hints: string[];
    hint: string;

    constructor(wordleSerialized: string | undefined = undefined) {
        if(wordleSerialized) {
            const [index, guesses, hints] = wordleSerialized.split('-');

            this.index = +index;
            this.guesses = guesses ? guesses.split(' ') : [];
            this.hints = hints ? hints.split(' ') : [];
        } else {
            this.index = Math.floor(Math.random() * words.length);
            this.guesses = ['', '', '', '', '', ''];
            this.hints = [];
        }

        this.hint = words[this.index];
    }

    enter(letters: string[]) {
        const word = letters.join('');
        const valid = guessable.has(word);

        if(!valid) {
            return false;
        }

        this.guesses[this.hints.length] = word;

        const available = Array.from(this.hint);
        const hint = Array(5).fill('_');

        for (let i = 0; i < 5; i++) {
            if (letters[i] === available[i]) {
                hint[i] = 'x';
                available[i] = ' ';
            }
        }

        for (let i = 0; i < 5; i+=1) {
            if (hint[i] === '_') {
                const index = available.indexOf(letters[i]);
                if (index !== -1) {
                    hint[i] = 'c';
                    available[index] = ' ';
                }
            }
        }

        this.hints.push(hint.join(''));

        return true;
    }

    toString() {
        return `${this.index}-${this.guesses.join(' ')}-${this.hints.join(' ')}`;
    }
}