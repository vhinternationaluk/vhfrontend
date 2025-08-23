import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Package,
  UserCircle,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/data/Assests/logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { currentUser, logout, isAdmin, userRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/25 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={Logo}
                alt="VH International"
                className="h-8 w-auto sm:h-10 lg:h-12 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/"
              className="text-sm lg:text-base font-medium hover:text-black/70 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-sm lg:text-base font-medium hover:text-black/70 transition-colors duration-200"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-sm lg:text-base font-medium hover:text-black/70 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm lg:text-base font-medium hover:text-black/70 transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors relative focus:outline-none"
                    aria-label="User menu"
                  >
                    {isAdmin ? (
                      <Shield className="h-5 w-5 text-red-600 hover:text-red-700" />
                    ) : (
                      <User className="h-5 w-5 text-gray-600 hover:text-[#d4a000]" />
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 bg-white/90 backdrop-blur-lg border border-gray-100 shadow-lg rounded-lg"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {currentUser.displayName || currentUser.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {currentUser.email}
                    </p>
                  </div>
                  <DropdownMenuItem
                    className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md mt-1"
                    onClick={() => navigate("/profile")}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
                    onClick={() => navigate("/orders")}
                  >
                    <Package className="h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  
                  {/* Show Manage Items only for Admin */}
                  {isAdmin && (
                    <DropdownMenuItem
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
                      onClick={() => navigate("/manage-items")}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Manage Items</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  <DropdownMenuItem
                    className="flex items-center gap-2 py-2 text-red-500 cursor-pointer hover:bg-red-50 transition-colors rounded-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Popover>
                <PopoverTrigger>
                  <User className="h-5 w-5 text-gray-600 hover:text-[#d4a000] cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="p-4 flex flex-col items-center bg-white/90 backdrop-blur-lg border border-gray-100 shadow-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    Welcome! Please login.
                  </p>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </PopoverContent>
              </Popover>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-full hover:bg-black/5 transition-colors md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <Link
                to="/"
                className="flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={Logo}
                  alt="VH International"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Mobile Menu Content */}
            <nav className="flex flex-col p-6 space-y-6 overflow-y-auto">
              <Link
                to="/"
                className="text-xl font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-xl font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-xl font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-xl font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {currentUser && (
                <>
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-sm text-gray-500 font-medium">
                        Account
                      </p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Admin
                        </span>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      className="text-lg font-medium py-2 border-b border-gray-100 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircle className="h-5 w-5" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="text-lg font-medium py-2 border-b border-gray-100 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-5 w-5" />
                      My Orders
                    </Link>
                    
                    {/* Show Manage Items only for Admin in mobile menu */}
                    {isAdmin && (
                      <Link
                        to="/manage-items"
                        className="text-lg font-medium py-2 border-b border-gray-100 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingBag className="h-5 w-5" />
                        Manage Items
                      </Link>
                    )}
                    
                    <button
                      className="text-lg font-medium text-red-500 text-left py-2 flex items-center gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </>
              )}

              {!currentUser && (
                <div className="pt-4">
                  <Button
                    variant="default"
                    className="w-full text-lg py-3"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;