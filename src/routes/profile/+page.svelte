<script lang="ts">
	import type { User } from 'firebase/auth';
	import { authHandlers, authStore } from '../../store/store';
	import Authenticate from '../../components/Authenticate.svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { firebaseFirestore, firebaseAuth } from '$lib/firebase/firebase.app';
	import { doc, getDoc } from 'firebase/firestore';

	let user: User | null = null;
	let userToken: string | undefined = undefined;
	
	authStore.subscribe(async (value) => {
		user = value.user;
		userToken = await value.user?.getIdToken();
	});

	let userData: any = null;

	onMount(async () => {
		if (!firebaseAuth.currentUser?.uid) return;

		const userDoc = doc(firebaseFirestore, 'wordleUserStats', firebaseAuth.currentUser.uid);

		const userDocSnap = await getDoc(userDoc);
		userData = userDocSnap.data();
	});

	$: gamesWon = userData?.totalGamesWon ? userData.totalGamesWon : 0;
	$: gamesPlayed = userData?.totalGamesPlayed ? userData.totalGamesPlayed : 0;
	$: winRate = isNaN(userData?.totalGamesWon / userData?.totalGamesPlayed)
		? 0
		: Math.trunc((userData?.totalGamesWon / userData?.totalGamesPlayed) * 100);
	$: winStreak = userData?.currentWinStreak ? userData.currentWinStreak : 0;

</script>

<div class="h-full p-10 flex justify-center w-full bg-surface-100-800-token">
	{#if user}
		<div class="gap-8 p-10 rounded-md w-full">
			<div class="flex justify-between">
				<h1 class="h1">Hello, {user.displayName?.split(' ')[0]}</h1>
				<button
					type="button"
					class="btn variant-filled-error"
					on:click={() => {
						document.cookie = '';
						authHandlers.logout();
					}}>Logout</button
				>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				<div
					class="mt-8 variant-soft-primary py-5 px-8 rounded-3xl aspect-square w-[14rem] flex flex-col relative mx-auto"
				>
					<h4 class="h4 mb-4 absolute">Games Won</h4>
					<h1 class="h1 text-center my-auto">{gamesWon}</h1>
				</div>
				<div
					class="mt-8 variant-soft-primary py-5 px-8 rounded-3xl aspect-square w-[14rem] flex flex-col relative mx-auto"
				>
					<h4 class="h4 mb-4 absolute">Games Played</h4>
					<h1 class="h1 text-center my-auto">{gamesPlayed}</h1>
				</div>
				<div class="mt-8 variant-soft-primary py-5 px-8 rounded-3xl aspect-square w-[14rem] mx-auto">
					<h4 class="h4 mb-4">Wins</h4>
					<div class="flex justify-center">
						<ProgressRadial
							stroke={100}
							meter="stroke-primary-500"
							track="stroke-primary-500/30"
							strokeLinecap="round"
							value={winRate}
						>
							{winRate}%
						</ProgressRadial>
					</div>
				</div>
				<div
					class="mt-8 py-5 px-8 rounded-3xl aspect-square w-[14rem] flex flex-col relative mx-auto {winStreak >=
					10
						? 'variant-filled-error'
						: ''} {winStreak >= 3 && winStreak <= 9 ? 'variant-filled-warning' : ''} {winStreak < 3
						? 'variant-soft-primary'
						: ''}"
				>
					<h4 class="h4 mb-4 absolute">Win Streak</h4>
					<h1 class="h1 text-center my-auto">
						{winStreak}
						{#if winStreak >= 10}
                        <i class="fa-solid fa-fire"></i>
						{/if}
					</h1>
				</div>
			</div>
		</div>
	{:else}
		<Authenticate />
		<div></div>
	{/if}
</div>
