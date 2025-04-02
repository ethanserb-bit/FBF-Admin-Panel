import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

// Types
export interface Request {
  id?: string;
  question: string;
  content: string;
  status: 'pending' | 'approved' | 'denied';
  isUrgent: boolean;
  category: string;
  type: 'regular' | 'expert';
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  mediaUrls?: string[];
  assignedExpertId?: string;
}

export interface Response {
  id?: string;
  requestId: string;
  content: string;
  authorId: string;
  authorType: 'user' | 'expert';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'pending' | 'approved' | 'denied';
  mediaUrls?: string[];
}

export interface UserDocument {
  role: string;
  email: string;
  createdAt: Timestamp;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***' : undefined,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

console.log('Firebase initialized:', {
  app: !!app,
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  analytics: !!analytics
});

export const firebaseService = {
  // Authentication methods
  async signUpWithEmail(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Auth state observer
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Get auth instance
  getAuth() {
    return auth;
  },

  // Get storage instance
  getStorage() {
    return storage;
  },

  // Get Firestore instance
  getFirestore() {
    return db;
  },

  // Firestore methods
  async createRequest(requestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...requestData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, error: null };
    } catch (error: any) {
      return { id: null, error: error.message };
    }
  },

  async updateRequest(requestId: string, updateData: Partial<Request>) {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getRequest(requestId: string) {
    try {
      const requestDoc = await getDoc(doc(db, 'requests', requestId));
      if (requestDoc.exists()) {
        return { data: { id: requestDoc.id, ...requestDoc.data() } as Request, error: null };
      }
      return { data: null, error: 'Request not found' };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getPendingRequests() {
    console.log('Getting pending requests...');
    try {
      const q = query(
        collection(db, 'requests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      console.log('Query created');
      
      const querySnapshot = await getDocs(q);
      console.log('Got query snapshot, size:', querySnapshot.size);
      
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Request[];
      console.log('Mapped requests:', requests);
      
      return { data: requests, error: null };
    } catch (error: any) {
      console.error('Error in getPendingRequests:', error);
      return { data: null, error: error.message };
    }
  },

  async createResponse(responseData: Omit<Response, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'responses'), {
        ...responseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, error: null };
    } catch (error: any) {
      return { id: null, error: error.message };
    }
  },

  async getRequestResponses(requestId: string) {
    try {
      const q = query(
        collection(db, 'responses'),
        where('requestId', '==', requestId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const responses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Response[];
      return { data: responses, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getUserRequests(userId: string) {
    try {
      const q = query(
        collection(db, 'requests'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Request[];
      return { data: requests, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getUserDocument(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { data: userDoc.data() as UserDocument, error: null };
      }
      return { data: null, error: 'User document not found' };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
};

export default firebaseService; 