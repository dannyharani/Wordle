import { firebaseAuth, googleAuthProvider } from '$lib/firebase/firebase.app';
import { signInWithPopup } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { goto } from '$app/navigation';

export const authStore = writable<{ user: User | null }>({
	user: null
});

export const authHandlers = {
    logout: async () => {
        await firebaseAuth.signOut();
        goto('/');
    },
    loginWithGoogle: async () => {
        await signInWithPopup(firebaseAuth, googleAuthProvider);
        goto('/wordle');
    }
}