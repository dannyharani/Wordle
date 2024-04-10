<script lang="ts">
    import { onMount } from 'svelte';
    import '../app.postcss';

    // authentication
    import { authHandlers, authStore } from '../store/store';
    import type { User } from 'firebase/auth';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { AppBar, AppShell, Avatar, storePopup } from '@skeletonlabs/skeleton';
    import { firebaseAuth } from '$lib/firebase/firebase.app';
    import { goto } from '$app/navigation';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    // Lighswitch
    import { LightSwitch } from '@skeletonlabs/skeleton';

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

    let userInitials: string | undefined = '';

    let currentUser: User | null;
    authStore.subscribe((value) => {
        currentUser = value.user;

        if (!currentUser) return;

        userInitials = currentUser.displayName
            ?.split(' ')
            .map((name) => name[0])
            .join('');
    });
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar
            slotTrail="place-content-end"
            shadow="shadow-xl bg-secondary-backdrop-token"
        >
            <svelte:fragment slot="lead"
                ><h2 class="h2">
                    <a href="/">Kurdle</a>
                </h2></svelte:fragment
            >
            <svelte:fragment slot="trail">
                <LightSwitch />
                {#if currentUser}
                    <Avatar
                        initials={userInitials}
                        border="border-4 border-surface-400-600-token hover:!border-primary-500"
                        cursor="cursor-pointer"
                        width="w-12"
                        on:click={() => goto('/profile')}
                    />
                {:else}
                    <button class="btn variant-filled-primary text-token font-semibold" on:click={authHandlers.loginWithGoogle}
                        >Login</button
                    >
                {/if}
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <!-- ... -->
    <slot />
</AppShell>
