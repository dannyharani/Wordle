<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const keyrows = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm']
	];

	$: won = data.hints.at(-1) === 'xxxxx';
	$: i = won ? -1 : data.hints.length;
	$: currentGuess = data.guesses[i] || '';
	$: submittable = currentGuess.length === 5;

	let classnames: Record<string, 'exact', 'close', 'wrong'>;

	$: {
		classnames = {};

		data.hints.forEach((hint, i) => {
			const guess = data.guesses[i];

			for (let i = 0; i < 5; i++) {
				const letter = guess[i];

				if (hint[i] === 'x') {
					classnames[letter] = 'exact';
				} else if (!classnames[letter]) {
					classnames[letter] = hint[i] === 'c' ? 'close' : 'wrong';
				}
			}
		});
	}

	/**
	 * Bypasses server somehow? Check how this works.
	 * @param event
	 */
	function update(event: MouseEvent) {
		const key = (event.target as HTMLButtonElement).getAttribute('data-key');

		if (key === 'backspace') {
			currentGuess = currentGuess.slice(0, -1);
			if (form?.invalidGuess) form.invalidGuess = false;
		} else if (currentGuess.length < 5) {
			currentGuess += key;
		}
	}

	/**
	 * Hanlde keydown event on form.
	 * This is so desktop users can use the keyboard to submit guesses.
	 * @param event
	 */
	function keydown(event: KeyboardEvent) {
		if (event.metaKey) return;

		if (event.key === 'Enter' && !submittable) return;

		document
			.querySelector(`[data-key="${event.key}" i]`)
			?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	}
</script>

<svelte:window on:keydown={keydown} />

<form
	class="h-full flex flex-col align-middle content-evenly py-20"
	method="POST"
	action="?/enter"
	use:enhance={() => {
		return ({ update }) => {
			update({ reset: false });
		};
	}}
>
	<div class="grid gap-2" class:playing={!won} class:bad-guess={form?.invalidGuess}>
		{#each Array.from(Array(6).keys()) as row (row)}
			{@const current = row === i}
			<h2 class="visually-hidden hidden">Row {row + 1}</h2>
			<div class="row" class:current>
				{#each Array.from(Array(5).keys()) as col (col)}
					{@const guess = current ? currentGuess : data.guesses[row]}
					{@const hint = data.hints[row]?.[col]}
					{@const value = guess?.[col] ?? ''}
					{@const selected = current && col === guess.length}
					{@const exact = hint === 'x'}
					{@const close = hint === 'c'}
					{@const wrong = hint === '_'}
					{@const remaining = exact || close || wrong}
					<div
						class="letter {remaining ? '' : 'variant-filled'} {exact
							? 'variant-filled-success'
							: ''} {close ? 'variant-outline-success' : ''} {wrong ? 'variant-ghost' : ''}"
						class:exact
						class:close
						class:wrong
						class:selected
					>
						{value}
						<span class="visually-hidden hidden">
							{#if exact}
								(correct)
							{:else if close}
								(present)
							{:else if wrong}
								(absent)
							{:else}
								empty
							{/if}
						</span>
						<input name="guess" disabled={!current} type="hidden" {value} />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="controls">
		{#if won || data.hints.length >= 6}
			{#if !won && data.answer}
				<p>the answer was <strong>{data.answer}</strong></p>
			{/if}
			<button data-key="enter" class="restart selected" formaction="?/restart">
				{won ? 'you won :)' : 'game over :('} play again?
			</button>
		{:else}
			<div class="keyboard">
				<button data-key="enter" class:selected={submittable} disabled={!submittable}>enter</button>
				<button
					on:click|preventDefault={update}
					data-key="backspace"
					formaction="?/update"
					name="key"
					value="backspace"
				>
					back
				</button>

				{#each keyrows as row}
					<div class="row">
						{#each row as key}
							<button
								on:click|preventDefault={update}
								data-key={key}
								class={classnames[key]}
								disabled={submittable}
								formaction="?/update"
								name="key"
								value={key}
							>
								{key}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</form>

<style>
	/* form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex: 1;
	} */

	.how-to-play {
		color: var(--color-text);
	}

	.how-to-play::before {
		content: 'i';
		display: inline-block;
		font-size: 0.8em;
		font-weight: 900;
		width: 1em;
		height: 1em;
		padding: 0.2em;
		line-height: 1;
		border: 1.5px solid var(--color-text);
		border-radius: 50%;
		text-align: center;
		margin: 0 0.5em 0 0;
		position: relative;
		top: -0.05em;
	}

	.grid {
		--width: min(100vw, 40vh, 380px);
		max-width: var(--width);
		align-self: center;
		justify-self: center;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.grid .row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 0.2rem;
		margin: 0 0 0.2rem 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.grid.bad-guess .row.current {
			animation: wiggle 0.5s;
		}
	}

	.grid.playing .row.current {
		filter: drop-shadow(3px 3px 10px var(--color-bg-0));
	}

	.letter {
		aspect-ratio: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
		text-transform: lowercase;
		border: none;
		font-size: calc(0.08 * var(--width));
		border-radius: 2px;
		margin: 0;
	}

	.selected {
		outline: 2px solid var(--color-theme-1);
	}

	.controls {
		text-align: center;
		justify-content: center;
		height: min(18vh, 10rem);
	}

	.keyboard {
		--gap: 0.2rem;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		height: 100%;
	}

	.keyboard .row {
		display: flex;
		justify-content: center;
		gap: 0.2rem;
		flex: 1;
	}

	.keyboard button,
	.keyboard button:disabled {
		--size: min(8vw, 4vh, 40px);
		background-color: white;
		color: black;
		width: var(--size);
		border: none;
		border-radius: 2px;
		font-size: calc(var(--size) * 0.5);
		margin: 0;
	}

	.keyboard button.exact {
		background: var(--color-theme-2);
		color: white;
	}

	.keyboard button.wrong {
		opacity: 0.5;
	}

	.keyboard button.close {
		border: 2px solid var(--color-theme-2);
	}

	.keyboard button:focus {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	.keyboard button[data-key='enter'],
	.keyboard button[data-key='backspace'] {
		position: absolute;
		bottom: 0;
		width: calc(1.5 * var(--size));
		height: calc(1 / 3 * (100% - 2 * var(--gap)));
		text-transform: uppercase;
		font-size: calc(0.3 * var(--size));
		padding-top: calc(0.15 * var(--size));
	}

	.keyboard button[data-key='enter'] {
		right: calc(50% + 3.5 * var(--size) + 0.8rem);
	}

	.keyboard button[data-key='backspace'] {
		left: calc(50% + 3.5 * var(--size) + 0.8rem);
	}

	.keyboard button[data-key='enter']:disabled {
		opacity: 0.5;
	}

	.restart {
		width: 100%;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 2px;
		border: none;
	}

	.restart:focus,
	.restart:hover {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
