import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Facebook,
  LogIn,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import GoogleIcon from "@/data/googleicon";

const backgrounds = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
];

interface LoginResponse {
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
    access_token?: string;
    refresh_token?: string;
  } | null;
  exception: string | null;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check for registration success message
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(
        location.state.message || "Registration successful! Please login with your credentials."
      );
      // Clear the success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare payload according to API requirements
      const loginPayload = {
        username: username.trim(),
        password: password,
      };

      console.log("Sending login request:", { username: loginPayload.username });

      const response = await fetch("https://vhdev.onrender.com/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      // Handle different response scenarios
      if (!response.ok) {
        if (response.status === 502) {
          throw new Error("Server is temporarily unavailable. Please try again later.");
        }
        
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Login failed (${response.status}). Please try again.`);
        }

        // Handle API error response
        if (errorData.status === false) {
          throw new Error(errorData.status_message || "Invalid credentials");
        }
        
        throw new Error(errorData.message || errorData.status_message || "Login failed");
      }

      const data: LoginResponse = await response.json();
      
      // Check if the API returned success status
      if (!data.status) {
        throw new Error(data.status_message || "Login failed");
      }

      console.log("Login successful:", data);

      // Store user data and tokens in localStorage
      if (data.payload) {
        const userData = {
          id: data.payload.id,
          username: data.payload.username,
          firstName: data.payload.first_name,
          lastName: data.payload.last_name,
          email: data.payload.email,
          mobile: data.payload.mobile,
          userType: data.payload.user_type,
          profileImg: data.payload.profile_img,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        
        // Store tokens if provided
        if (data.payload.access_token) {
          localStorage.setItem("accessToken", data.payload.access_token);
        }
        if (data.payload.refresh_token) {
          localStorage.setItem("refreshToken", data.payload.refresh_token);
        }
      }

      // Navigate to dashboard or intended page
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof Error) {
        // Handle specific error messages
        if (error.message.includes("Failed to fetch")) {
          setError("Network error.");
        } else if (error.message.includes("502")) {
          setError("Server is temporarily unavailable due to CORS policy. Please try again later.");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter your username/email first");
      return;
    }

    try {
      setIsResettingPassword(true);
      setError("");
      
      // You might need to implement password reset API call here
      // For now, just showing a placeholder message
      setShowForgotPassword(false);
      setSuccessMessage("If an account exists with that username, a password reset link has been sent!");
      
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to send reset link."
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setError(`${provider} login is not implemented yet. Please use username/password login.`);
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={bg}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentBg ? 1 : 0,
              transition: { duration: 1.5 },
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>
      <motion.div
        className="relative z-10 flex items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {showForgotPassword ? (
            <motion.div
              key="forgot-password"
              className="w-full max-w-md px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
                <div className="p-6">
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError("");
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-6"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                    Back to login
                  </button>

                  <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                  {error && (
                    <div className="bg-red-100 text-red-700 text-sm mb-4 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleResetPassword}>
                    <div className="space-y-2 mb-6">
                      <Label htmlFor="reset-username">Username/Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="reset-username"
                          type="text"
                          placeholder="Enter username or email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      disabled={!username || isResettingPassword}
                    >
                      {isResettingPassword ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending Reset Link...
                        </span>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              className="w-full max-w-md px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
                <div className="pt-8 px-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Lock size={30} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-gray-500 mt-1">
                      Sign in to your account
                    </p>
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-green-100 text-green-700 text-sm mb-4 p-3 rounded-md flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {successMessage}
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 text-red-700 text-sm mb-4 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                        
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <button
                            type="button"
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                            onClick={() => setShowForgotPassword(true)}
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setIsPasswordVisible(!isPasswordVisible)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Signing in...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Sign In
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </form>

                  <CardFooter className="flex flex-col gap-3 pt-0 pb-8 px-0">
                    <div className="relative w-full my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => handleSocialLogin("Google")}
                        type="button"
                      >
                        <GoogleIcon className="h-4 w-4" />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => handleSocialLogin("Facebook")}
                        type="button"
                      >
                        <Facebook className="h-4 w-4 text-[#1877F2]" />
                        Facebook
                      </Button>
                    </div>

                    <div className="text-center mt-4">
                      <span className="text-gray-600">
                        Don't have an account?{" "}
                      </span>
                      <Link
                        to="/register"
                        className="text-indigo-600 hover:underline"
                      >
                        Register here
                      </Link>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;