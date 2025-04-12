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
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8",
        isScrolled ? "bg-white/25 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile menu button - moved to the left for better layout */}
        <div className="flex md:hidden">
          <button
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Logo container - responsive positioning */}
        <div className="flex-shrink-0 md:-ml-24 absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
          <img
            src={Logo}
            alt="VH International"
            width={100}
            height={100}
            className="max-h-full object-contain"
          />
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* User and cart actions */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors relative focus:outline-none"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5 text-gray-600 hover:text-[#d4a000]" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-2 bg-white/90 backdrop-blur-lg border border-gray-100 shadow-lg rounded-lg"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.displayName || currentUser.email}
                  </p>
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
                <DropdownMenuItem
                  className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md"
                  onClick={() => navigate("/manage-items")}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Manage Items</span>
                </DropdownMenuItem>
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

          <Link
            to="/cart"
            className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                {getItemCount()}
              </span>
            )}
          </Link>

          {/* Hamburger menu button moved to the left side */}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-6">
              <Link
                to="/"
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Essence
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </motion.button>
            </div>

            <nav className="flex flex-col p-6 space-y-6">
              <Link
                to="/"
                className="text-2xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-2xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-2xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-2xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {currentUser && (
                <>
                  <Link
                    to="/profile"
                    className="text-2xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="text-2xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/manage-items"
                    className="text-2xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Add Items
                  </Link>
                  <button
                    className="text-2xl font-medium text-red-500 text-left"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              )}

              {!currentUser && (
                <Link
                  to="/login"
                  className="text-2xl font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;