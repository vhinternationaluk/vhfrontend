import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";
import GoogleIcon from "@/data/googleicon";
import { useAuth } from "@/context/AuthContext";

const backgrounds = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle, loginWithFacebook, resetPassword } =
    useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsResettingPassword(true);
      setError("");
      await resetPassword(email);
      setShowForgotPassword(false);
      setError("Password reset link sent to your email!");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to send reset link."
      );
    } finally {
      setIsResettingPassword(false);
    }
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
                    <div
                      className={`text-sm mb-4 p-2 rounded-md ${
                        error.includes("sent")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleResetPassword}>
                    <div className="space-y-2 mb-6">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      disabled={!email || isResettingPassword}
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

                  {error && (
                    <div className="bg-red-100 text-red-700 text-sm mb-4 p-2 rounded-md text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 px-0">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email / Username</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="email"
                            type="text"
                            placeholder="Enter Email or Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            placeholder="Enter Password"
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
                        onClick={loginWithGoogle}
                      >
                        <GoogleIcon className="h-4 w-4" />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={loginWithFacebook}
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