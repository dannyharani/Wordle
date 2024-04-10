<script lang="ts">
    import { onAuthStateChanged, type User } from 'firebase/auth';
    import { authHandlers, authStore } from '../../store/store';
    import Authenticate from '../../components/Authenticate.svelte';
    import {
        Paginator,
        ProgressRadial,
        Table,
        tableMapperValues,
        type PaginationSettings,
        type TableSource
    } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import { firebaseFirestore, firebaseAuth } from '$lib/firebase/firebase.app';
    import { doc, getDoc } from 'firebase/firestore';

    let user: User | null = null;
    let userToken: string | undefined = undefined;
    let sortBy: 'timesUsed' | 'timesWon' = 'timesUsed';
    let paginationSettings: PaginationSettings;
	let showTable: boolean = false;

    function sort(a: any, b: any) {
        if (sortBy === 'timesUsed') {
            return b.timesUsed - a.timesUsed;
        } else {
            return b.timesWon - a.timesWon;
        }
    }

    authStore.subscribe(async (value) => {
        user = value.user;
        userToken = await value.user?.getIdToken();
    });

    let userData: any = null;
    let startWordData: any = null;
    let tableSource: TableSource | undefined;

    async function setTableData(): Promise<TableSource | undefined> {
        if (!firebaseAuth.currentUser?.uid) return;

		const startWordDoc = doc(firebaseFirestore, 'startWords', firebaseAuth.currentUser.uid);

		const startWordDocSnap = await getDoc(startWordDoc);
		startWordData = startWordDocSnap.data()?.words.sort(sort);

		if (!startWordData) return;
			
        paginationSettings = {
            page: 0,
            limit: 5,
            size: startWordData.length,
            amounts: [3, 5, 10]
        };

        return {
            head: ['Word', 'Times Used', 'Times Won'],
            body: tableMapperValues(startWordData, ['word', 'timesUsed', 'timesWon']),
            meta: tableMapperValues(startWordData, ['word'])
        };
    }

    onMount(async () => {
        if (!firebaseAuth.currentUser?.uid) return;
        const userDoc = doc(firebaseFirestore, 'wordleUserStats', firebaseAuth.currentUser.uid);

        const userDocSnap = await getDoc(userDoc);
        userData = userDocSnap.data();

        const startWordDoc = doc(firebaseFirestore, 'startWords', firebaseAuth.currentUser.uid);

        const startWordDocSnap = await getDoc(startWordDoc);
        startWordData = startWordDocSnap.data()?.words.sort(sort);

        tableSource = await setTableData();
    });

	onAuthStateChanged(firebaseAuth, async (user) => {
		if (user) {
			tableSource = await setTableData();
		}
	});

    $: gamesWon = userData?.totalGamesWon ? userData.totalGamesWon : 0;
    $: gamesPlayed = userData?.totalGamesPlayed ? userData.totalGamesPlayed : 0;
    $: winRate = isNaN(userData?.totalGamesWon / userData?.totalGamesPlayed)
        ? 0
        : Math.trunc((userData?.totalGamesWon / userData?.totalGamesPlayed) * 100);
    $: winStreak = userData?.currentWinStreak ? userData.currentWinStreak : 0;

    $: tableSourceSlice = tableSource?.body.slice(
        paginationSettings.page * paginationSettings.limit,
        paginationSettings.page * paginationSettings.limit + paginationSettings.limit
    );
</script>

<div class="h-full p-10 flex justify-center w-full bg-surface-100-800-token">
    {#if user}
        <div class="gap-8 p-10 rounded-md w-full">
            <div class="flex justify-between">
                <h1 class="h1">Hello, {user.displayName?.split(' ')[0]}</h1>
                <button
                    type="button"
                    class="btn variant-ghost-error"
                    on:click={() => {
                        document.cookie = '';
                        authHandlers.logout();
                    }}>Logout</button
                >
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div
                    class="mt-8 variant-soft-primary py-5 px-8 rounded-3xl aspect-square w-[13rem] flex flex-col relative mx-auto"
                >
                    <h4 class="h4 mb-4 absolute">Games Won</h4>
                    <h1 class="h1 text-center my-auto">{gamesWon}</h1>
                </div>
                <div
                    class="mt-8 variant-soft-primary py-5 px-8 rounded-3xl aspect-square w-[13rem] flex flex-col relative mx-auto"
                >
                    <h4 class="h4 mb-4 absolute">Games Played</h4>
                    <h1 class="h1 text-center my-auto">{gamesPlayed}</h1>
                </div>
                <div
                    class="mt-8 variant-soft-primary py-5 px-8 rounded-3xl aspect-square w-[13rem] mx-auto"
                >
                    <h4 class="h4 mb-4">Wins</h4>
                    <div class="flex justify-center">
                        <ProgressRadial
                            stroke={100}
                            width="w-28"
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
                    class="mt-8 py-5 px-8 rounded-3xl aspect-square w-[13rem] flex flex-col relative mx-auto {winStreak >=
                    10
                        ? 'variant-filled-error'
                        : ''} {winStreak >= 3 && winStreak <= 9
                        ? 'variant-filled-warning'
                        : ''} {winStreak < 3 ? 'variant-soft-primary' : ''}"
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
            <div class="mt-6">
                <h2 class="h2 mb-2">Your Start Words</h2>
                {#if tableSourceSlice}
					{#if tableSource} 
						<Table
							interactive={true}
							source={{head: tableSource.head, body: tableSourceSlice}}
							text="uppercase font-semibold"
							regionHeadCell="h4"
						/>
						<div class="mt-2">
							<Paginator settings={paginationSettings} />
						</div>
					{/if}
                {:else}
                    <div class="w-full flex flex-col justify-between gap-2">
                        <div>
                            <div
                                class="w-full h-14 placeholder variant-filled-surface animate-pulse"
                            ></div>
                        </div>
                        <div class="flex justify-between">
                            <div class="w-[15%] h-10 placeholder animate-pulse"></div>
                            <div class="w-[25%] h-10 placeholder animate-pulse"></div>
                            <div class="w-[60%] h-10 placeholder animate-pulse"></div>
                        </div>
                        <div class="flex justify-between">
                            <div class="w-[15%] h-10 placeholder animate-pulse"></div>
                            <div class="w-[25%] h-10 placeholder animate-pulse"></div>
                            <div class="w-[60%] h-10 placeholder animate-pulse"></div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {:else}
        <Authenticate />
        <div></div>
    {/if}
</div>
