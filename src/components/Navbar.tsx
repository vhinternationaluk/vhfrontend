import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/data/Assests/logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0" style={{ maxHeight: "100%" }}>
          <img
            src={Logo}
            alt="VH International"
            width={100}
            height={100}
            style={{ maxHeight: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            About
          </Link>
          <Link
            to="/"
            className="text-sm font-medium hover:text-black/70 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Icon Navigation */}
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger>
              <User className="h-5 w-5 text-gray-600 hover:text-[#d4a000] cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="p-4 flex flex-col items-center">
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

          <button
            className="p-2 rounded-full hover:bg-black/5 transition-colors md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
          <div className="flex justify-between items-center p-6">
            <Link
              to="/"
              className="text-xl font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Essence
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
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
              to="/"
              className="text-2xl font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Collection
            </Link>
            <Link
              to="/"
              className="text-2xl font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Featured
            </Link>
            <Link
              to="/"
              className="text-2xl font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
