import admin from "firebase-admin";

let firebaseApp: admin.app.App;

export const initFirebase = () => {
    if (!firebaseApp) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    return admin.firestore();
};

export const getFirestore = () => {
    if (!firebaseApp) {
        throw new Error("Firebase not initialized");
    }
    return admin.firestore();
};
