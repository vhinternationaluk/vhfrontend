import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, Facebook, LogIn, User, ArrowRight } from 'lucide-react';
import GoogleIcon from '@/data/googleicon';

// Background images
const backgrounds = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
];

const Login = () => {
  const { login, register, loginWithGoogle, loginWithFacebook, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [currentBg, setCurrentBg] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Cycle through background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length);
    }, 3000); 
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await register(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setIsResettingPassword(true);
      await resetPassword(email);
      setShowForgotPassword(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Motion variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: { opacity: 0 }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Background image with crossfade effect */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={bg}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentBg ? 1 : 0,
              transition: { duration: 1.5 } 
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-full"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <AnimatePresence mode="wait">
          {showForgotPassword ? (
            <motion.div
              key="forgot-password"
              className="w-full max-w-md px-4"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <div className="p-6">
                  <button 
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-6"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                    Back to login
                  </button>
                  
                  <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                  <p className="text-gray-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
                  
                  <form onSubmit={handleResetPassword}>
                    <motion.div 
                      className="space-y-2 mb-6"
                      variants={inputVariants}
                    >
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
                    </motion.div>
                    
                    <motion.div 
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        disabled={!email || isResettingPassword}
                      >
                        {isResettingPassword ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Sending Reset Link...
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="login-register"
              className="w-full max-w-md px-4"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <div className="pt-8 px-8">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4"
                    >
                      <User size={30} className="text-white" />
                    </motion.div>
                    <motion.h1 
                      className="text-2xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Welcome Back
                    </motion.h1>
                    <motion.p 
                      className="text-gray-500 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
                    </motion.p>
                  </div>
                  
                  <Tabs 
                    defaultValue="login" 
                    value={activeTab} 
                    onValueChange={setActiveTab} 
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger 
                        value="login"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50"
                      >
                        Register
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login">
                      <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4 px-0">
                          <motion.div 
                            className="space-y-2"
                            variants={inputVariants}
                          >
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="space-y-2"
                            variants={inputVariants}
                          >
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <button
                                type="button"
                                className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                                onClick={() => setShowForgotPassword(true)}
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                              >
                                {isPasswordVisible ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            className="pt-2"
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  Signing in...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <LogIn className="h-4 w-4" />
                                  Sign In
                                </span>
                              )}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register">
                      <form onSubmit={handleRegister}>
                        <CardContent className="space-y-4 px-0">
                          <motion.div 
                            className="space-y-2"
                            variants={inputVariants}
                          >
                            <Label htmlFor="register-name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="register-name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="space-y-2"
                            variants={inputVariants}
                          >
                            <Label htmlFor="register-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="register-email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="space-y-2"
                            variants={inputVariants}
                          >
                            <Label htmlFor="register-password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="register-password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                              >
                                {isPasswordVisible ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            className="pt-2"
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  Creating account...
                                </span>
                              ) : (
                                "Create Account"
                              )}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </form>
                    </TabsContent>
                  </Tabs>
                  
                  <CardFooter className="flex flex-col gap-3 pt-0 pb-8 px-0">
                    <div className="relative w-full my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <motion.div 
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full flex items-center gap-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                          onClick={loginWithGoogle}
                        >
                          <GoogleIcon className="h-4 w-4" />
                          Google
                        </Button>
                      </motion.div>
                      
                      <motion.div 
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full flex items-center gap-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                          onClick={loginWithFacebook}
                        >
                          <Facebook className="h-4 w-4 text-[#1877F2]" />
                          Facebook
                        </Button>
                      </motion.div>
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
