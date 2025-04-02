import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '../config/firebase';

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

const api = {
  // Auth methods
  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
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

  // Request methods
  async createRequest(data: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, error: null };
    } catch (error: any) {
      return { id: null, error: error.message };
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

  // Moderation methods
  async getPendingRequests() {
    try {
      const q = query(
        collection(db, 'requests'),
        where('status', '==', 'pending'),
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

  async updateRequestStatus(requestId: string, status: 'approved' | 'denied') {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async bulkUpdateRequestStatus(requestIds: string[], status: 'approved' | 'denied') {
    try {
      const promises = requestIds.map(id => 
        this.updateRequestStatus(id, status)
      );
      await Promise.all(promises);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Response methods
  async createResponse(data: Omit<Response, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'responses'), {
        ...data,
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

  // Auth state
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};

export default api; 