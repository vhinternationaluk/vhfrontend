import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
    const { items, removeFromCart, updateQuantity, getCartTotal, loading, syncWithAPI } = useCart(); 
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    // Sync cart when user is authenticated
    useEffect(() => {
      if (currentUser && localStorage.getItem("cart")) {
        // If user just logged in and has local cart items, sync them
        syncWithAPI();
      }
    }, [currentUser, syncWithAPI]);
    
    const handleCheckout = () => {
      if (!currentUser) {
        navigate('/login', { 
          state: { 
            redirectTo: '/checkout',
            message: 'Please login to proceed with checkout' 
          } 
        });
        return;
      }
      navigate('/checkout');
    };

    const handleRemoveItem = async (productId: string) => {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
      try {
        await updateQuantity(productId, quantity);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    };
    
    if (loading && items.length === 0) {
      return (
        <div className="min-h-screen bg-[#F9F7F5]">
          <Navbar />
          <div className="pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <Loader2 className="mx-auto h-16 w-16 text-amber-700 mb-6 animate-spin" />
              <h1 className="text-3xl font-medium mb-4">Loading your cart...</h1>
              <p className="text-gray-600 mb-8">Please wait while we fetch your cart items.</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (items.length === 0) { 
      return (
        <div className="min-h-screen bg-[#F9F7F5]">
          <Navbar />
          <div className="pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-amber-700 mb-6" />
              <h1 className="text-3xl font-medium mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your cart yet.
                {!currentUser && " Log in to sync your cart across devices."}
              </p>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-amber-700 hover:bg-amber-800"
              >
                Continue Shopping
              </Button>
              {!currentUser && (
                <div className="mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    Login to Save Cart
                  </Button>
                </div>
              )}
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
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-medium">Your Cart</h1>
              {!currentUser && (
                <div className="text-sm text-gray-600 bg-amber-50 px-4 py-2 rounded-lg">
                  Cart items are stored locally. 
                  <Button 
                    variant="link" 
                    className="p-0 ml-2 h-auto text-amber-700"
                    onClick={() => navigate('/login')}
                  >
                    Login to sync
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  {loading && (
                    <div className="flex items-center justify-center py-4 mb-4">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-700 mr-2" />
                      <span className="text-sm text-gray-600">Updating cart...</span>
                    </div>
                  )}
                  
                  {items.map((item) => (
                    <div key={item.product.id} className="mb-6 last:mb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">₹{item.product.price.toFixed(2)} each</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <label 
                                htmlFor={`quantity-${item.product.id}`} 
                                className="text-sm text-gray-500 mr-2"
                              >
                                Qty:
                              </label>
                              <select 
                                id={`quantity-${item.product.id}`}
                                className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-sm"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                                disabled={loading}
                              >
                                {[...Array(10)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                              </select>
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                              aria-label={`Remove ${item.product.name} from cart`}
                              disabled={loading}
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
                    disabled={loading || items.length === 0}
                  >
                    <span className="flex items-center justify-center">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {currentUser ? 'Proceed to Checkout' : 'Login & Checkout'}
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
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

                  {currentUser && (
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      Cart synced with your account
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Cart;