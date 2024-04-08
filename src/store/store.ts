import { firebaseAuth, googleAuthProvider, firebaseFirestore } from '$lib/firebase/firebase.app';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import type { WordleUserStats } from './types';

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
                initialGuesses: [{
                    word: '',
                    usedCount: 0,
                    winCount: 0
                }],
                longestWinStreak: 0,
                successfulGuessesInRow: 0,
                totalGamesPlayed: 0,
                totalGamesWon: 0,
                dailyStreak: 0
            }
            await setDoc(doc(firebaseFirestore, 'wordleUserStats', userRes.user.uid), initializeData);
            console.log('New user initialized');
        }

    }
}