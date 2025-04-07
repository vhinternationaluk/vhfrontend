import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '@/data/products'; // Import getProducts
import { useItems } from '@/context/ItemContext';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { Filter, SlidersHorizontal, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6; // Number of products to show initially and to add when "Load More" is clicked

const Shop = () => {
  const navigate = useNavigate();
  const defaultProducts = getProducts(); // Get default products
  const { items: userItems } = useItems(); // Get user-added items
  
  // Combine default products with user-added items
  const allProducts = [...defaultProducts, ...userItems];
  
  const [visibleProducts, setVisibleProducts] = useState<typeof allProducts>([]);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  
  // Extract unique categories
  const categories: string[] = ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Re-filter products when user items change
  useEffect(() => {
    const combinedProducts = [...defaultProducts, ...userItems];
    setFilteredProducts(
      activeCategory === 'all' 
        ? combinedProducts 
        : combinedProducts.filter(p => p.category === activeCategory)
    );
  }, [userItems, defaultProducts, activeCategory]);
  
  useEffect(() => {
    // Update visible products when filtered products or display count changes
    setVisibleProducts(filteredProducts.slice(0, displayCount));
  }, [filteredProducts, displayCount]);
  
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredProducts([...defaultProducts, ...userItems]);
    } else {
      setFilteredProducts([...defaultProducts, ...userItems].filter(p => p.category === category));
    }
    // Reset display count to initial value when category changes
    setDisplayCount(ITEMS_PER_PAGE);
  };
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };
  
  const hasMoreProducts = visibleProducts.length < filteredProducts.length;
  
  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Page title */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Shop Collection</h1>
            <p className="text-black/70 max-w-2xl mx-auto">
              Explore our handcrafted furniture pieces, designed for modern living with timeless elegance.
            </p>
          </motion.div>
          
          {/* Mobile filter button */}
          <div className="md:hidden mb-6 animate-fade-in">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm text-sm"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Filter
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Category filter - Desktop */}
            <motion.div 
              className="hidden md:block w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <Filter size={18} className="mr-2" />
                  Categories
                </h2>
                
                <Separator className="bg-amber-100 mb-4" />
                
                <div className="space-y-2">
                  {categories.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => filterByCategory(category)}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                        activeCategory === category 
                          ? 'bg-amber-50 text-amber-800 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Products grid */}
            <div className="flex-grow">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {visibleProducts.map((product, index) => (
                  <motion.div 
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded-full">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                      <h3 className="font-medium mt-2">{product.name}</h3>
                      <p className="text-black/70">₹{product.price}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {visibleProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl animate-fade-in">
                  <p className="text-black/70">No products found in this category.</p>
                </div>
              )}
              
              {/* Load More Button */}
              {hasMoreProducts && (
                <motion.div 
                  className="mt-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center justify-center bg-amber-50 text-amber-800 px-6 py-3 rounded-full hover:bg-amber-100 transition-colors font-medium"
                  >
                    <Plus size={16} className="mr-2" />
                    Load More Products
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile filter overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Filter</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2"
              >
                <X size={24} />
              </button>
            </div>
            
            <Separator className="bg-amber-100 mb-6" />
            
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => {
                    filterByCategory(category);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                    activeCategory === category 
                      ? 'bg-amber-50 text-amber-800 font-medium' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
