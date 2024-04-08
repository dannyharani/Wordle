<script lang="ts">
    import type { User } from "firebase/auth";
    import { authHandlers, authStore } from "../../store/store";
	import Authenticate from "../../components/Authenticate.svelte";
	import { ProgressRadial } from "@skeletonlabs/skeleton";
    
    let user: User | null = null;

    authStore.subscribe((value) => {
        user = value.user;
    });
</script>

<div class="h-full p-10 flex justify-center items-center">
    {#if user}
        <div class="gap-8 variant-soft-primary p-10 rounded-md w-full">
            <div class="flex justify-between">
                <h1 class="h1">Hello, {user.displayName?.split(' ')[0]}</h1>
                <button type="button" class="btn variant-filled-error" on:click={authHandlers.logout}>Logout</button>
            </div>
            <div class="mt-8">
                <h3 class="h3 mb-4">Wins:</h3>
                <ProgressRadial ... stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" strokeLinecap="round" value={50}> 
                    50%
                </ProgressRadial>
            </div>
        </div>
    {:else}
        <Authenticate />
        <div>

        </div>
    {/if}
</div>