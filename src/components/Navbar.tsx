
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { getItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-medium transition-opacity hover:opacity-80"
        >
          Essence
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-black/70 transition-colors">
            Home
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-black/70 transition-colors">
            Collection
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-black/70 transition-colors">
            Featured
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-black/70 transition-colors">
            About
          </Link>
        </nav>

        {/* Icon Navigation */}
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          <Link 
            to="/cart" 
            className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
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
