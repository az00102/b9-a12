// src/providers/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../components/firebaseconfig'; // Adjust the path as per your Firebase setup
import axios from 'axios';

const auth = getAuth(app);

export const AuthContext = createContext(null);

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (email) => {
    try {
      const response = await axios.get('https://b9-a12-serverrr.vercel.app/api/profile', {
        params: { email },
      });
      return response.data.role; // Ensure your backend returns the role directly or adjust as needed
    } catch (error) {
      console.error('Error fetching user role:', error.message);
      return null;
    }
  };

  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      await updateProfile(currentUser, { displayName: name, photoURL });
      const role = await fetchUserRole(currentUser.email);
      setUser({ ...currentUser, role });
      return currentUser;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      const role = await fetchUserRole(currentUser.email);
      setUser({ ...currentUser, role });
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('access-token');
    } catch (error) {
      console.error('Error logging out:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to backend if not already there
      const payload = { email: user.email, name: user.displayName, photoURL: user.photoURL, role: 'tourist' };
      const { data } = await axios.get(`https://b9-a12-serverrr.vercel.app/users?email=${user.email}`);
      if (!data.exists) {
        await axios.post('https://b9-a12-serverrr.vercel.app/register', payload);
      }

      // Get JWT token
      const userInfo = { email: user.email };
      const res = await axios.post('https://b9-a12-serverrr.vercel.app/jwt', userInfo);
      if (res.data.token) {
        localStorage.setItem('access-token', res.data.token);
        setAuthToken(res.data.token);
      }

      const role = await fetchUserRole(user.email);
      setUser({ ...user, role: role || 'tourist' }); // Assuming default role as tourist
    } catch (error) {
      console.error('Error in Google sign-in:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const role = await fetchUserRole(currentUser.email);
        setUser({ ...currentUser, role });
        const userInfo = { email: currentUser.email };
        try {
          const res = await axios.post('https://b9-a12-serverrr.vercel.app/jwt', userInfo);
          if (res.data.token) {
            localStorage.setItem('access-token', res.data.token);
            setAuthToken(res.data.token);
          }
        } catch (error) {
          console.error('Error generating JWT:', error.message);
        }
      } else {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('access-token');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    logIn,
    logOut,
    createUser,
    signUpWithGoogle,
    signUpWithGitHub,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;

