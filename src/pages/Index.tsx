
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  // Get non-featured products for the grid
  const regularProducts = products.filter(p => !p.featured);
  
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      {/* Hero section with featured products */}
      <HeroSection />
      
      {/* Product grid section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-black/5 rounded-full mb-3">
                New Arrivals
              </span>
              <h2 className="text-3xl md:text-4xl font-medium">Our Collection</h2>
            </div>
            <a href="#" className="inline-flex items-center text-sm font-medium hover:underline">
              View all <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-white/10 rounded-full mb-3">
            Stay Updated
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Join our newsletter</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Be the first to know about new products, exclusive offers, and design inspiration.
          </p>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-full px-6 py-3 outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-white/50"
              required
            />
            <button
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-r-full font-medium transition-colors hover:bg-white/90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-[#FAFAFA] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-medium mb-4">Essence</h3>
              <p className="text-black/70 mb-4">
                Minimalist essentials for modern living.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">All Products</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Featured</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">New Arrivals</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Our Story</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Materials</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Sustainability</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Shipping</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Returns</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">FAQ</a></li>
                <li><a href="#" className="text-black/70 hover:text-black transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center">
            <p className="text-black/50 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Essence. All rights reserved.
            </p>
            <div className="space-x-4">
              <a href="#" className="text-black/70 hover:text-black transition-colors">Instagram</a>
              <a href="#" className="text-black/70 hover:text-black transition-colors">Twitter</a>
              <a href="#" className="text-black/70 hover:text-black transition-colors">Pinterest</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
