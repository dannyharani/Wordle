<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.postcss';

	// authentication
	import { authStore } from '../store/store';
	import type { User } from 'firebase/auth';
	import Authenticate from '../components/Authenticate.svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppBar, AppShell, Avatar, storePopup } from '@skeletonlabs/skeleton';
	import { firebaseAuth } from '$lib/firebase/firebase.app';
	import { goto } from '$app/navigation';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	onMount(() => {
		const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
			if (!user) {
				authStore.update(() => {
					return {
						user: null
					};
				});
			} else {
				authStore.update(() => {
					return {
						user: user
					};
				});
			}
		});
		return unsubscribe;
	});

	let currentUser: User | null;
	authStore.subscribe((value) => {
		currentUser = value.user;
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead"
				><h2 class="h2">
					<a href="/"> Kabyle Wordle </a>
				</h2></svelte:fragment
			>
			<svelte:fragment slot="trail">
				<Avatar
					border="border-4 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
					width="w-12"
					on:click={() => goto('/profile')}
				/>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- ... -->
</AppShell>

{#if !currentUser}
	<Authenticate />
{/if}
<slot />
