import {getFirestore, initFirebase} from "../config/firebase";

jest.mock("firebase-admin", () => ({
    initializeApp: jest.fn(() => ({name: "mockedFirebaseApp"})), // Mock Firebase init
    credential: {
        cert: jest.fn(),
    },
    firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
            doc: jest.fn(),
        })),
    })),
}));

beforeAll(() => {
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({project_id: "test-project"});
    initFirebase();
});

afterAll(() => {
    jest.resetAllMocks();
});

describe("Firebase Config", () => {
    it("should initialize Firebase without errors", () => {
        expect(() => initFirebase()).not.toThrow();
    });

    it("should return Firestore instance", () => {
        const db = getFirestore();
        expect(db).toBeDefined();
    });
});
