/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
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
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define user roles
export type UserRole = "admin" | "user";

// Extended user interface with role
interface UserWithRole extends User {
  role?: UserRole;
}

// API Login Response Interface
interface LoginApiResponse {
  status: boolean;
  status_message: string;
  payload: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  exception: string | null;
}

// API Register Response Interface
interface RegisterApiResponse {
  status: boolean;
  status_message: string;
  payload: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    user_type: string;
    profile_img: string;
  };
  exception: string | null;
}

// Admin Check API Response Interface
interface AdminCheckResponse {
  is_admin: boolean;
}

// Registration data interface
interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  profileImage: File;
}

interface AuthContextProps {
  currentUser: UserWithRole | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  registerWithApi: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Admin credentials for local admin access
const ADMIN_CREDENTIALS = {
  email: "admin",
  password: "AdminPass123!",
};

// Function to check if user is admin via API
const checkUserAdminStatus = async (accessToken: string): Promise<boolean> => {
  try {
    console.log("Checking admin status with API...");
    const response = await fetch("/accounts/user/is_admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data: AdminCheckResponse = await response.json();
      console.log("Admin check response:", data);
      return data.is_admin;
    } else {
      console.error(
        "Admin check API failed:",
        response.status,
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Function to determine user role
const getUserRole = (user: User | null, isAdminLogin = false): UserRole => {
  if (isAdminLogin) {
    return "admin";
  }

  // You can implement more complex role logic here
  // For example, check user email, database records, etc.
  if (user?.email === "admin@company.com") {
    return "admin";
  }

  return "user";
};

// Helper function to create API user object
const createApiUser = (
  username: string,
  accessToken: string,
  refreshToken: string,
  role: UserRole = "user"
): UserWithRole => {
  return {
    uid: `api-${username}`,
    email: username,
    displayName: username,
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime:
        localStorage.getItem("loginTime") || new Date().toISOString(),
      lastSignInTime:
        localStorage.getItem("loginTime") || new Date().toISOString(),
    },
    providerData: [],
    refreshToken: refreshToken,
    tenantId: null,
    phoneNumber: null,
    photoURL: null,
    providerId: "api",
    delete: async () => {
      throw new Error("Delete operation not supported for API users");
    },
    getIdToken: async () => accessToken,
    getIdTokenResult: async () => ({
      token: accessToken,
      expirationTime:
        localStorage.getItem("tokenExpiry") ||
        new Date(Date.now() + 3600000).toISOString(),
      authTime: localStorage.getItem("loginTime") || new Date().toISOString(),
      issuedAtTime:
        localStorage.getItem("loginTime") || new Date().toISOString(),
      signInProvider: "api",
      signInSecondFactor: null,
      claims: { role },
    }),
    reload: async () => {
      console.log("Reload called for API user");
    },
    toJSON: () => ({}),
    role,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [isApiSession, setIsApiSession] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      console.log("Initializing auth state...");

      // Priority 1: Check for API login session
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const username = localStorage.getItem("username");
      const storedUserRole = localStorage.getItem("userRole") as UserRole;

      if (isLoggedIn === "true" && accessToken && username) {
        console.log("Found API session for user:", username);

        // Use stored role if available, otherwise default to user
        const role = storedUserRole || "user";
        const apiUser = createApiUser(
          username,
          accessToken,
          refreshToken || "",
          role
        );

        setCurrentUser(apiUser);
        setUserRole(role);
        setIsApiSession(true);
        setIsAdminSession(false);
        setLoading(false);
        console.log("API session restored successfully with role:", role);
        return;
      }

      // Priority 2: Check for persisted admin session
      const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
      const storedAdminUser = localStorage.getItem("adminUser");

      if (isAdminLoggedIn === "true" && storedAdminUser) {
        try {
          const adminUser: UserWithRole = JSON.parse(storedAdminUser);
          setCurrentUser(adminUser);
          setUserRole("admin");
          setIsAdminSession(true);
          setIsApiSession(false);
          setLoading(false);
          console.log("Admin session restored from localStorage");
          return;
        } catch (error) {
          console.error("Error parsing stored admin user:", error);
          localStorage.removeItem("isAdminLoggedIn");
          localStorage.removeItem("adminUser");
        }
      }

      // Priority 3: Set up Firebase auth listener
      console.log("Setting up Firebase auth listener...");
      unsubscribe = onAuthStateChanged(auth, (user) => {
        // Double-check that admin/API session hasn't been established
        const currentAdminStatus = localStorage.getItem("isAdminLoggedIn");
        const currentApiStatus = localStorage.getItem("isLoggedIn");

        if (currentAdminStatus === "true" || currentApiStatus === "true") {
          console.log("Firebase auth ignored - admin or API session active");
          return;
        }

        if (user) {
          const role = getUserRole(user);
          const userWithRole: UserWithRole = { ...user, role };
          setCurrentUser(userWithRole);
          setUserRole(role);
          setIsAdminSession(false);
          setIsApiSession(false);
          console.log("Firebase user authenticated:", user.email);
        } else {
          setCurrentUser(null);
          setUserRole("user");
          setIsAdminSession(false);
          setIsApiSession(false);
          console.log("No Firebase user found");
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

  // Monitor localStorage changes for cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;

      console.log("Storage change detected:", e.key, e.newValue);

      const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
      const isApiLoggedIn = localStorage.getItem("isLoggedIn");
      const storedAdminUser = localStorage.getItem("adminUser");
      const username = localStorage.getItem("username");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUserRole = localStorage.getItem("userRole") as UserRole;

      // Handle admin session changes
      if (isAdminLoggedIn === "true" && storedAdminUser && !isAdminSession) {
        try {
          const adminUser: UserWithRole = JSON.parse(storedAdminUser);
          setCurrentUser(adminUser);
          setUserRole("admin");
          setIsAdminSession(true);
          setIsApiSession(false);
          console.log("Admin session restored from storage change");
        } catch (error) {
          console.error("Error parsing admin user from storage:", error);
        }
      }

      // Handle API session changes
      else if (
        isApiLoggedIn === "true" &&
        username &&
        accessToken &&
        !isApiSession
      ) {
        const role = storedUserRole || "user";
        const apiUser = createApiUser(
          username,
          accessToken,
          refreshToken || "",
          role
        );
        setCurrentUser(apiUser);
        setUserRole(role);
        setIsApiSession(true);
        setIsAdminSession(false);
        console.log(
          "API session restored from storage change with role:",
          role
        );
      }

      // Handle session clearing
      else if (
        isAdminLoggedIn !== "true" &&
        isApiLoggedIn !== "true" &&
        (isAdminSession || isApiSession)
      ) {
        setCurrentUser(null);
        setUserRole("user");
        setIsAdminSession(false);
        setIsApiSession(false);
        console.log("Session cleared from storage change");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAdminSession, isApiSession]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt for:", email);

      // Check for admin login first
      if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        console.log("Admin login detected");

        // Clear any existing sessions
        if (auth.currentUser) {
          await signOut(auth);
        }
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");

        // Create admin user object
        const adminUser: UserWithRole = {
          uid: "admin-uid",
          email: "admin@VHINTERNATIONAL",
          displayName: "Administrator",
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
          },
          providerData: [],
          refreshToken: "admin-token",
          tenantId: null,
          phoneNumber: null,
          photoURL: null,
          providerId: "custom",
          delete: async () => {
            throw new Error("Delete operation not supported for admin users");
          },
          getIdToken: async () => "admin-token",
          getIdTokenResult: async () => ({
            token: "admin-token",
            expirationTime: new Date(Date.now() + 3600000).toISOString(),
            authTime: new Date().toISOString(),
            issuedAtTime: new Date().toISOString(),
            signInProvider: "custom",
            signInSecondFactor: null,
            claims: { role: "admin" },
          }),
          reload: async () => {
            console.log("Reload called for admin user");
          },
          toJSON: () => ({}),
          role: "admin",
        };

        // Set states
        setCurrentUser(adminUser);
        setUserRole("admin");
        setIsAdminSession(true);
        setIsApiSession(false);

        // Persist admin session
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminUser", JSON.stringify(adminUser));
        localStorage.setItem("adminLoginTime", new Date().toISOString());

        console.log("Admin session established successfully");

        toast({
          title: "Welcome Administrator",
          description: "You have admin access to manage items.",
        });
        navigate("/");
        return;
      }

      // Try API login for regular users
      console.log("Attempting API login...");
      try {
        const loginPayload = {
          username: email.trim(),
          password: password,
        };

        const response = await fetch("/accounts/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(loginPayload),
        });

        if (response.ok) {
          const data: LoginApiResponse = await response.json();

          if (data.status && data.payload) {
            console.log("API login successful");

            // Clear other sessions
            if (auth.currentUser) {
              await signOut(auth);
            }
            localStorage.removeItem("isAdminLoggedIn");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("adminLoginTime");

            // Check admin status using the access token
            const isAdminUser = await checkUserAdminStatus(
              data.payload.access_token
            );
            const userRole: UserRole = isAdminUser ? "admin" : "user";

            console.log("User admin status:", isAdminUser, "Role:", userRole);

            // Store API tokens and user info
            localStorage.setItem("accessToken", data.payload.access_token);
            localStorage.setItem("refreshToken", data.payload.refresh_token);
            localStorage.setItem(
              "tokenExpiry",
              (Date.now() + data.payload.expires_in * 1000).toString()
            );
            localStorage.setItem("loginTime", Date.now().toString());
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", email);
            localStorage.setItem("userRole", userRole);

            // Create and set API user with correct role
            const apiUser = createApiUser(
              email,
              data.payload.access_token,
              data.payload.refresh_token,
              userRole
            );

            setCurrentUser(apiUser);
            setUserRole(userRole);
            setIsApiSession(true);
            setIsAdminSession(false);

            console.log(
              "API session established successfully with role:",
              userRole
            );

            toast({
              title: "Login successful",
              description: isAdminUser
                ? "Welcome Administrator! You have admin access."
                : "Welcome back!",
            });
            navigate("/");
            return;
          } else {
            console.log("API login failed - invalid response:", data);
            throw new Error(data.status_message || "API login failed");
          }
        } else {
          console.log("API login failed - HTTP error:", response.status);
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.status_message ||
              errorData.message ||
              `API login failed (${response.status})`
          );
        }
      } catch (apiError) {
        console.log("API login failed, trying Firebase:", apiError);

        // If API login fails, try Firebase as fallback
        console.log("Attempting Firebase login...");
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const role = getUserRole(userCredential.user);
        const userWithRole: UserWithRole = { ...userCredential.user, role };

        // Clear other session data
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");

        setCurrentUser(userWithRole);
        setUserRole(role);
        setIsAdminSession(false);
        setIsApiSession(false);

        console.log("Firebase login successful");

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/");
        return;
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      // Provide user-friendly error messages
      let errorMessage = "Login failed. Please check your credentials.";

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const role = getUserRole(userCredential.user);
      const userWithRole: UserWithRole = { ...userCredential.user, role };
      setCurrentUser(userWithRole);
      setUserRole(role);
      setIsAdminSession(false);
      setIsApiSession(false);

      // Clear other session data
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // New API registration method
  const registerWithApi = async (data: RegisterData) => {
    try {
      console.log("API Registration attempt for:", data.username);

      // Basic validation
      if (
        !data.firstName ||
        !data.lastName ||
        !data.username ||
        !data.email ||
        !data.password ||
        !data.mobile ||
        !data.profileImage
      ) {
        throw new Error("All fields including profile image are required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Mobile validation (basic check for digits)
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(data.mobile.replace(/\D/g, ""))) {
        throw new Error("Please enter a valid 10-digit mobile number");
      }

      // Password validation - basic length check only
      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("username", data.username.trim());
      formData.append("first_name", data.firstName.trim());
      formData.append("last_name", data.lastName.trim());
      formData.append("email", data.email.trim().toLowerCase());
      formData.append("password", data.password);
      formData.append("mobile", data.mobile.replace(/\D/g, ""));
      formData.append("profile_img", data.profileImage);

      console.log("Sending registration data to API");

      const response = await fetch("/accounts/register/", {
        method: "POST",
        body: formData,
      });

      // Handle response
      if (!response.ok) {
        if (response.status === 502) {
          throw new Error(
            "Server is temporarily unavailable. Please try again later."
          );
        }

        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(
            `Registration failed (${response.status}). Please try again.`
          );
        }

        if (errorData.status === false) {
          throw new Error(errorData.status_message || "Registration failed");
        }

        throw new Error(
          errorData.message || errorData.status_message || "Registration failed"
        );
      }

      const responseData: RegisterApiResponse = await response.json();

      if (!responseData.status) {
        throw new Error(responseData.status_message || "Registration failed");
      }

      console.log("Registration successful:", responseData);

      // Store user data for potential use
      if (responseData.payload) {
        localStorage.setItem(
          "registeredUser",
          JSON.stringify({
            id: responseData.payload.id,
            username: responseData.payload.username,
            firstName: responseData.payload.first_name,
            lastName: responseData.payload.last_name,
            email: responseData.payload.email,
            mobile: responseData.payload.mobile,
            userType: responseData.payload.user_type,
            profileImg: responseData.payload.profile_img,
          })
        );
      }

      toast({
        title: "Registration Successful",
        description:
          responseData.status_message || "Account created successfully!",
      });

      // Navigate to login with success message
      navigate("/login", {
        state: {
          registrationSuccess: true,
          message: responseData.status_message,
          username: responseData.payload?.username,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes("502")) {
          errorMessage =
            "Server is temporarily unavailable. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw new Error(errorMessage);
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
      setIsApiSession(false);

      // Clear other session data
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/");
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
      setIsApiSession(false);

      // Clear other session data
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/");
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
      console.log("Logout initiated, sessions:", {
        isAdminSession,
        isApiSession,
      });

      // Call logout API if it's an API session
      if (isApiSession || localStorage.getItem("isLoggedIn") === "true") {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          console.log("Calling logout API...");
          try {
            const response = await fetch("/accounts/logout/", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });

            if (response.ok) {
              console.log("Logout API call successful");
            } else {
              console.warn(
                "Logout API call failed:",
                response.status,
                response.statusText
              );
              // Continue with local logout even if API call fails
            }
          } catch (apiError) {
            console.error("Error calling logout API:", apiError);
            // Continue with local logout even if API call fails
          }
        }
      }

      // Clear admin session
      if (
        isAdminSession ||
        localStorage.getItem("isAdminLoggedIn") === "true"
      ) {
        console.log("Clearing admin session");
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminLoginTime");
      }

      // Clear API session
      if (isApiSession || localStorage.getItem("isLoggedIn") === "true") {
        console.log("Clearing API session");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
      }

      // Clear Firebase session
      if (!isAdminSession && !isApiSession && auth.currentUser) {
        console.log("Clearing Firebase session");
        await signOut(auth);
      }

      // Reset all states
      setCurrentUser(null);
      setUserRole("user");
      setIsAdminSession(false);
      setIsApiSession(false);

      console.log("Logout completed successfully");

      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
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

  const isAdmin = userRole === "admin";

  // Debug function - remove in production
  const debugAuthState = () => {
    console.log("=== Auth Debug State ===");
    console.log("currentUser:", currentUser);
    console.log("userRole:", userRole);
    console.log("isAdminSession:", isAdminSession);
    console.log("isApiSession:", isApiSession);
    console.log("isAdmin:", isAdmin);
    console.log(
      "localStorage isAdminLoggedIn:",
      localStorage.getItem("isAdminLoggedIn")
    );
    console.log("localStorage isLoggedIn:", localStorage.getItem("isLoggedIn"));
    console.log("localStorage adminUser:", localStorage.getItem("adminUser"));
    console.log("localStorage username:", localStorage.getItem("username"));
    console.log("localStorage userRole:", localStorage.getItem("userRole"));
    console.log(
      "localStorage accessToken:",
      localStorage.getItem("accessToken") ? "Present" : "Missing"
    );
    console.log("Firebase currentUser:", auth.currentUser);
    console.log("=====================");
  };

  // Add debug to window for easy access in console
  useEffect(() => {
    (window as any).debugAuth = debugAuthState;
  }, [currentUser, userRole, isAdminSession, isApiSession, isAdmin]);

  const value = {
    currentUser,
    loading,
    userRole,
    isAdmin,
    login,
    register,
    registerWithApi,
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
