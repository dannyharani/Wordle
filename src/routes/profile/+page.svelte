<script lang="ts">
    import type { User } from "firebase/auth";
    import { authHandlers, authStore } from "../../store/store";
	import Authenticate from "../../components/Authenticate.svelte";
    
    let user: User | null = null;

    authStore.subscribe((value) => {
        user = value.user;
    });
</script>

<div class="h-full">
    {#if user}
        <h1 class="h1">Hello {user.displayName}</h1>
        <button type="button" class="btn" on:click={authHandlers.logout}>Logout</button>
    {:else}
        <Authenticate />
    {/if}
</div>