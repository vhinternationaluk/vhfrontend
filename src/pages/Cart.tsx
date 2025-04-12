import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
    const { items, removeFromCart, updateQuantity, getCartTotal } = useCart(); 
    const navigate = useNavigate();
    
    const handleCheckout = () => {
      navigate('/checkout');
    };
    
    if (items.length === 0) { 
      return (
        <div className="min-h-screen bg-[#F9F7F5]">
          <Navbar />
          <div className="pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-amber-700 mb-6" />
              <h1 className="text-3xl font-medium mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-amber-700 hover:bg-amber-800"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-[#F9F7F5]">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-3xl font-medium mb-10">Your Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  {items.map((item) => (
                    <div key={item.product.id} className="mb-6 last:mb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">₹{item.product.price.toFixed(2)} each</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <label htmlFor={`quantity-${item.product.id}`} className="text-sm text-gray-500 mr-2">Qty:</label>
                              <select 
                                id={`quantity-${item.product.id}`}
                                className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-sm"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                              >
                                {[...Array(10)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                              </select>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    
                      {items.indexOf(item) !== items.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-32">
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-amber-700 hover:bg-amber-800 py-6 rounded-full"
                  >
                    <span className="flex items-center justify-center">
                      Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                    </span>
                  </Button>
                  
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      onClick={() => navigate('/shop')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
 export default Cart