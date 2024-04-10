import { firebaseAuth, googleAuthProvider, firebaseFirestore } from '$lib/firebase/firebase.app';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import type { InitialGuesses, WordleUserStats } from './types';

export const authStore = writable<{ user: User | null }>({
	user: null
});

export const authHandlers = {
    logout: async () => {
        await firebaseAuth.signOut();
    },

    loginWithGoogle: async () => {
        const userRes = await signInWithPopup(firebaseAuth, googleAuthProvider);
        const userInfo = await getAdditionalUserInfo(userRes)?? null;

        if (userInfo?.isNewUser) {
            const initializeData: WordleUserStats = {
                longestWinStreak: 0,
                currentWinStreak: 0,
                totalGamesPlayed: 0,
                totalGamesWon: 0,
                dailyStreak: 0,
                totalGuesses: 0,
            }
            const initializeWord = {words: [{word: 'apple', timesUsed: 0, timesWon: 0, totalGuessesForWin: 0}]}
        
            await setDoc(doc(firebaseFirestore, 'wordleUserStats', userRes.user.uid), initializeData);
            await setDoc(doc(firebaseFirestore, 'startWords', userRes.user.uid), initializeWord);
            console.log("initialized")
        }

    }
}