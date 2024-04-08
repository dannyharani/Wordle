import { firebaseAuth, googleAuthProvider, firebaseFirestore } from '$lib/firebase/firebase.app';
import { addDoc, collection } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { User, UserCredential } from 'firebase/auth';

export const authStore = writable<{ user: User | null }>({
	user: null
});

export const authHandlers = {
    logout: async () => {
        await firebaseAuth.signOut();
    },

    loginWithGoogle: async () => {
        await signInWithPopup(firebaseAuth, googleAuthProvider);
    }
}