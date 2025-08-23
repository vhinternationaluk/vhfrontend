/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Auth, 
  User, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Define user roles
export type UserRole = 'admin' | 'user';

// Extended user interface with role
interface UserWithRole extends User {
  role?: UserRole;
}

interface AuthContextProps {
  currentUser: UserWithRole | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin',
  password: '123'
};

// Function to determine user role
const getUserRole = (user: User | null, isAdminLogin = false): UserRole => {
  if (isAdminLogin) {
    return 'admin';
  }
  
  // You can implement more complex role logic here
  // For example, check user email, database records, etc.
  if (user?.email === 'admin@company.com') {
    return 'admin';
  }
  
  return 'user';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = () => {
      // First, check for persisted admin session
      const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
      const storedAdminUser = localStorage.getItem('adminUser');
      
      if (isAdminLoggedIn === 'true' && storedAdminUser) {
        try {
          const adminUser: UserWithRole = JSON.parse(storedAdminUser);
          setCurrentUser(adminUser);
          setUserRole('admin');
          setIsAdminSession(true);
          setLoading(false);
          console.log('Admin session restored from localStorage');
          return;
        } catch (error) {
          console.error('Error parsing stored admin user:', error);
          localStorage.removeItem('isAdminLoggedIn');
          localStorage.removeItem('adminUser');
        }
      }

      // If no admin session, set up Firebase auth listener
      unsubscribe = onAuthStateChanged(auth, (user) => {
        // Double-check admin session hasn't been established in the meantime
        const currentAdminStatus = localStorage.getItem('isAdminLoggedIn');
        if (currentAdminStatus === 'true') {
          console.log('Firebase auth ignored - admin session active');
          return;
        }

        if (user) {
          const role = getUserRole(user);
          const userWithRole: UserWithRole = { ...user, role };
          setCurrentUser(userWithRole);
          setUserRole(role);
          setIsAdminSession(false);
          console.log('Firebase user authenticated:', user.email);
        } else {
          setCurrentUser(null);
          setUserRole('user');
          setIsAdminSession(false);
          console.log('No Firebase user found');
        }
        setLoading(false);
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Add a separate effect to monitor localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
      const storedAdminUser = localStorage.getItem('adminUser');
      
      if (isAdminLoggedIn === 'true' && storedAdminUser && !isAdminSession) {
        try {
          const adminUser: UserWithRole = JSON.parse(storedAdminUser);
          setCurrentUser(adminUser);
          setUserRole('admin');
          setIsAdminSession(true);
          console.log('Admin session restored from storage change');
        } catch (error) {
          console.error('Error parsing admin user from storage:', error);
        }
      } else if (isAdminLoggedIn !== 'true' && isAdminSession) {
        setCurrentUser(null);
        setUserRole('user');
        setIsAdminSession(false);
        console.log('Admin session cleared from storage change');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAdminSession]);

  const login = async (email: string, password: string) => {
    try {
      // Check for admin login first
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('Admin login detected');
        
        // Clear any existing Firebase session first
        if (auth.currentUser) {
          await signOut(auth);
        }
        
        // Create a mock admin user object
        const adminUser: UserWithRole = {
          uid: 'admin-uid',
          email: 'admin@VHINTERNATIONAL',
          displayName: 'Administrator',
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
          },
          providerData: [],
          refreshToken: 'admin-token',
          tenantId: null,
          phoneNumber: null,
          photoURL: null,
          providerId: 'custom',
          delete: async () => {},
          getIdToken: async () => 'admin-token',
          getIdTokenResult: async () => ({
            token: 'admin-token',
            expirationTime: new Date(Date.now() + 3600000).toISOString(),
            authTime: new Date().toISOString(),
            issuedAtTime: new Date().toISOString(),
            signInProvider: 'custom',
            signInSecondFactor: null,
            claims: { role: 'admin' }
          }),
          reload: async () => {},
          toJSON: () => ({}),
          role: 'admin'
        };
        
        // Set states immediately
        setCurrentUser(adminUser);
        setUserRole('admin');
        setIsAdminSession(true);
        
        // Store admin login state in localStorage for persistence
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        console.log('Admin session established successfully');
        
        toast({
          title: "Welcome Administrator",
          description: "You have admin access to manage items.",
        });
        navigate('/');
        return;
      }

      // Regular Firebase authentication for other users
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = getUserRole(userCredential.user);
      const userWithRole: UserWithRole = { ...userCredential.user, role };
      setCurrentUser(userWithRole);
      setUserRole(role);
      setIsAdminSession(false);
      
      // Clear any admin session data
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUser');
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    } catch (error: any) {
      // Show different error messages based on credentials
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const role = getUserRole(userCredential.user);
      const userWithRole: UserWithRole = { ...userCredential.user, role };
      setCurrentUser(userWithRole);
      setUserRole(role);
      setIsAdminSession(false);
      
      // Clear any admin session data
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUser');
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const role = getUserRole(userCredential.user);
      const userWithRole: UserWithRole = { ...userCredential.user, role };
      setCurrentUser(userWithRole);
      setUserRole(role);
      setIsAdminSession(false);
      
      // Clear any admin session data
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUser');
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const role = getUserRole(userCredential.user);
      const userWithRole: UserWithRole = { ...userCredential.user, role };
      setCurrentUser(userWithRole);
      setUserRole(role);
      setIsAdminSession(false);
      
      // Clear any admin session data
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUser');
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Facebook login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logout initiated, isAdminSession:', isAdminSession);
      
      if (isAdminSession || localStorage.getItem('isAdminLoggedIn') === 'true') {
        // Admin logout
        console.log('Performing admin logout');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminLoginTime');
        setCurrentUser(null);
        setUserRole('user');
        setIsAdminSession(false);
      } else {
        // Regular Firebase logout
        console.log('Performing Firebase logout');
        await signOut(auth);
        setCurrentUser(null);
        setUserRole('user');
        setIsAdminSession(false);
      }
      
      console.log('Logout completed successfully');
      
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const isAdmin = userRole === 'admin';

  // Debug function - you can remove this in production
  const debugAuthState = () => {
    console.log('=== Auth Debug State ===');
    console.log('currentUser:', currentUser);
    console.log('userRole:', userRole);
    console.log('isAdminSession:', isAdminSession);
    console.log('isAdmin:', isAdmin);
    console.log('localStorage isAdminLoggedIn:', localStorage.getItem('isAdminLoggedIn'));
    console.log('localStorage adminUser:', localStorage.getItem('adminUser'));
    console.log('Firebase currentUser:', auth.currentUser);
    console.log('=====================');
  };

  // Add debug to window for easy access in console
  useEffect(() => {
    (window as any).debugAuth = debugAuthState;
  }, [currentUser, userRole, isAdminSession, isAdmin]);

  const value = {
    currentUser,
    loading,
    userRole,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};