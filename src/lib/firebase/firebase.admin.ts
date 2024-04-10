import admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase/firestore';

let firebaseAdmin: admin.app.App;
let firebaseAdminAuth: admin.auth.Auth;

function getFirebaseAdmin():admin.app.App {
    if (!firebaseAdmin) {
        if (admin.apps.length == 0)
        {
            firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(import.meta.env.VITE_FIREBASE_ADMIN_CREDENTIALS))
            });
        } else {
            firebaseAdmin = admin.apps[0];
        }
    }
    return firebaseAdmin;
}

function getFirebaseAdminAuth():admin.auth.Auth {
    const currentAdmin:admin.app.App = getFirebaseAdmin();
    if (!firebaseAdminAuth) {
        firebaseAdminAuth = currentAdmin.auth();
    }
    return firebaseAdminAuth;
}

function getFirestoreAdmin():Firestore {
    return admin.firestore();
}

export { getFirebaseAdmin, getFirebaseAdminAuth, getFirestoreAdmin, FieldValue };