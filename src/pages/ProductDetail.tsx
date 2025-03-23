
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Heart } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-8 animate-fade-in">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-black/70 hover:text-black transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
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
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-black/5 rounded-full mb-3">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              <h1 className="text-3xl md:text-4xl font-medium mb-2">{product.name}</h1>
              <p className="text-2xl mb-6">${product.price}</p>
              <p className="text-black/70 mb-8">{product.description}</p>
              
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
                <button className="bg-white border border-black/10 p-3 rounded-full hover:bg-black/5 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="border-t border-black/10 pt-8">
                <div className="flex border-b border-black/10">
                  <button
                    className={`py-3 px-4 text-sm font-medium relative ${
                      activeTab === 'details' 
                        ? 'text-black' 
                        : 'text-black/50 hover:text-black/70'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                    {activeTab === 'details' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                  <button
                    className={`py-3 px-4 text-sm font-medium relative ${
                      activeTab === 'specifications' 
                        ? 'text-black' 
                        : 'text-black/50 hover:text-black/70'
                    }`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Specifications
                    {activeTab === 'specifications' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                  <button
                    className={`py-3 px-4 text-sm font-medium relative ${
                      activeTab === 'materials' 
                        ? 'text-black' 
                        : 'text-black/50 hover:text-black/70'
                    }`}
                    onClick={() => setActiveTab('materials')}
                  >
                    Materials
                    {activeTab === 'materials' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                </div>
                
                <div className="py-6">
                  {activeTab === 'details' && (
                    <div className="animate-fade-in">
                      <ul className="space-y-2">
                        {product.details.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2"></span>
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
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2"></span>
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
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2"></span>
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
      
      {/* Product recommendations - simplified for this version */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-medium mb-10 text-center">You may also like</h2>
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full font-medium transition-transform hover:translate-x-1 animate-fade-in"
            >
              View more products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
