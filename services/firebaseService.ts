import { auth, db, storage, functions } from '../firebaseConfig';
import { httpsCallable } from "firebase/functions";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    updateProfile as updateFirebaseProfile,
    User as FirebaseUser
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc, 
    Timestamp, 
    collection, 
    addDoc, 
    getDocs,
    query,
    where,
    updateDoc,
    orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User, Booking } from '../types';

type DocumentKeys = 'licenseFront' | 'licenseBack' | 'proofOfAddress' | 'identity';

// --- AUTH FUNCTIONS ---

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // Profile creation is now handled by the onAuthStateChanged listener in App.tsx
        // for better reliability and centralization.
        return { user: result.user, error: null };
    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        return { user: null, error };
    }
};

export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateFirebaseProfile(result.user, { displayName: `${firstName} ${lastName}` });
        // The stripeCustomerId will be created on the first payment attempt.
        const newUser: User = {
            uid: result.user.uid,
            email,
            firstName,
            lastName,
            phone,
            address: '',
            isAdmin: false,
        };
        await createUserProfile(newUser);
        return { user: result.user, error: null };
    } catch (error: any) {
        return { user: null, error };
    }
};

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { user: result.user, error: null };
    } catch (error: any) {
        return { user: null, error };
    }
};

export const logout = () => {
    return signOut(auth);
};


// --- USER PROFILE FUNCTIONS ---

export const createUserProfile = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, user);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
};


// --- STRIPE & BOOKING FUNCTIONS ---

/**
 * Calls the secure backend function to create a Stripe Payment Intent.
 */
export const createPaymentIntent = async (amount: number, user: User): Promise<{ clientSecret: string; paymentIntentId: string; customerId: string; } | null> => {
    try {
        const createPaymentIntentFunction = httpsCallable(functions, 'createPaymentIntent');
        const result = await createPaymentIntentFunction({ amount, user });
        return result.data as { clientSecret: string; paymentIntentId: string; customerId: string; };
    } catch (error) {
        console.error("Error calling createPaymentIntent function:", error);
        return null;
    }
};


const uploadFile = async (path: string, file: File): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

export const createBookingWithDocuments = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'documents'>, documents: Record<DocumentKeys, File>) => {
    // A guard clause at the beginning of the function is cleaner and safer.
    if (!auth.currentUser) {
        console.error("createBookingWithDocuments called without a logged-in user.");
        return { bookingId: null, error: new Error('User not logged in.') };
    }

    try {
        const tempBookingId = `booking_${Date.now()}`;
        
        const uploadPromises = Object.entries(documents).map(([key, file]) => 
            uploadFile(`user-documents/${bookingData.userId}/${tempBookingId}/${key}`, file)
        );
        
        const [licenseFront, licenseBack, proofOfAddress, identity] = await Promise.all(uploadPromises);
        
        const documentUrls = { licenseFront, licenseBack, proofOfAddress, identity };

        const finalBookingData = {
            ...bookingData,
            documents: documentUrls,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "bookings"), finalBookingData);
        
        // If user didn't have a stripeCustomerId, save the one created during payment.
        // We know auth.currentUser exists from the guard clause above.
        const userProfile = await getUserProfile(auth.currentUser.uid);
        if (userProfile && !userProfile.stripeCustomerId && bookingData.stripeCustomerId) {
            await updateUserProfile(bookingData.userId, { stripeCustomerId: bookingData.stripeCustomerId });
        }
        
        return { bookingId: docRef.id, error: null };
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return { bookingId: null, error };
    }
};

export const getBookingsForUser = async (uid: string): Promise<Booking[]> => {
    const q = query(collection(db, "bookings"), where("userId", "==", uid), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getAllBookings = async (): Promise<Booking[]> => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'rejected' | 'completed') => {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status });
};