
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Heart, Truck, Shield, ArrowRight } from 'lucide-react';
import { getProductById } from '@/data/products';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'materials'>('details');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If product doesn't exist, navigate back to home
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-8 animate-fade-in">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-black/70 hover:text-amber-700 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to products
            </button>
          </div>
          
          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Product Image */}
            <div className="rounded-xl overflow-hidden bg-white animate-fade-in">
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700 ease-out", 
                    imageLoaded ? 'image-loaded' : 'image-loading'
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
            
            {/* Product Info */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-amber-50 text-amber-800 rounded-full mb-3">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              <h1 className="text-3xl md:text-4xl font-medium mb-2">{product.name}</h1>
              <p className="text-2xl mb-6">${product.price}</p>
              <p className="text-black/70 mb-8">{product.description}</p>
              
              {/* Shipping & Returns Info */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Truck className="mt-1 text-amber-700" size={18} />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Free Delivery</h4>
                    <p className="text-xs text-black/60">2-3 weeks for custom pieces</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="mt-1 text-amber-700" size={18} />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">5-Year Warranty</h4>
                    <p className="text-xs text-black/60">On all furniture pieces</p>
                  </div>
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="flex items-center border border-black/10 rounded-full w-fit">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <AddToCartButton product={product} quantity={quantity} className="flex-grow" />
                <button className="bg-white border border-amber-200 p-3 rounded-full hover:bg-amber-50 transition-colors text-amber-700">
                  <Heart size={20} />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="border-t border-amber-100 pt-8">
                <div className="flex border-b border-amber-100">
                  <button
                    className={`py-3 px-4 text-sm font-medium relative ${
                      activeTab === 'details' 
                        ? 'text-amber-700' 
                        : 'text-black/50 hover:text-black/70'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                    {activeTab === 'details' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700" />
                    )}
                  </button>
                  <button
                    className={`py-3 px-4 text-sm font-medium relative ${
                      activeTab === 'specifications' 
                        ? 'text-amber-700' 
                        : 'text-black/50 hover:text-black/70'
                    }`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Specifications
                    {activeTab === 'specifications' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700" />
                    )}
                  </button>
                  <button
                    className={`py-3 px-4 text-sm font-medium relative ${
                      activeTab === 'materials' 
                        ? 'text-amber-700' 
                        : 'text-black/50 hover:text-black/70'
                    }`}
                    onClick={() => setActiveTab('materials')}
                  >
                    Materials
                    {activeTab === 'materials' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700" />
                    )}
                  </button>
                </div>
                
                <div className="py-6">
                  {activeTab === 'details' && (
                    <div className="animate-fade-in">
                      <ul className="space-y-2">
                        {product.details.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-700 mt-2 mr-2"></span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'specifications' && (
                    <div className="animate-fade-in">
                      <ul className="space-y-2">
                        {product.details.specifications.map((spec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-700 mt-2 mr-2"></span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'materials' && (
                    <div className="animate-fade-in">
                      <ul className="space-y-2">
                        {product.details.materials.map((material, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-700 mt-2 mr-2"></span>
                            <span>{material}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Care Instructions */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-medium mb-10 text-center">Care Instructions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-medium mb-2">Regular Cleaning</h3>
              <p className="text-sm text-black/70">Dust with a clean, soft cloth. For wood surfaces, use appropriate wood cleaner and avoid excess moisture.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-medium mb-2">Avoid Direct Sunlight</h3>
              <p className="text-sm text-black/70">Position away from direct sunlight to prevent fading and material damage over time.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-medium mb-2">Spills & Stains</h3>
              <p className="text-sm text-black/70">Clean spills immediately with a soft, dry cloth. For tougher stains, refer to the included care guide.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product recommendations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-medium mb-10 text-center">Complete the look</h2>
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-transform hover:translate-x-1 animate-fade-in"
            >
              View suggested pieces <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
