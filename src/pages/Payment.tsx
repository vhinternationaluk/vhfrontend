import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "@/components/Navbar";
// import config from "../config/config"; // Uncomment if using config file

// Choose ONE of these approaches:
// Option 1: For Vite (recommended)
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_actual_key_here";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Option 2: For Create React App
// const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_your_key_id";
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Option 3: Using config file
// const RAZORPAY_KEY_ID = config.RAZORPAY_KEY_ID;
// const API_BASE_URL = config.API_BASE_URL;

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';
type UpiProvider = 'gpay' | 'paytm' | 'phonepe' | 'bhim' | 'amazonpay' | 'other';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

// Car Animation Component
const CarAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-mx-4 text-center">
        <div className="mb-6">
          <div className="relative overflow-hidden h-20 mb-4">
            <div className="absolute bottom-0 w-full h-2 bg-gray-700"></div>
            <div className="absolute bottom-0 w-full h-px bg-yellow-400 animate-pulse"></div>
            
            <div className="absolute bottom-2 animate-bounce">
              <div className="car-container animate-drive">
                <svg width="60" height="30" viewBox="0 0 60 30" className="text-blue-600">
                  <rect x="5" y="12" width="40" height="12" fill="currentColor" rx="2"/>
                  <rect x="15" y="8" width="20" height="8" fill="currentColor" rx="2"/>
                  <rect x="17" y="10" width="6" height="4" fill="#87CEEB" rx="1"/>
                  <rect x="27" y="10" width="6" height="4" fill="#87CEEB" rx="1"/>
                  <circle cx="15" cy="24" r="4" fill="#333"/>
                  <circle cx="35" cy="24" r="4" fill="#333"/>
                  <circle cx="15" cy="24" r="2" fill="#666"/>
                  <circle cx="35" cy="24" r="2" fill="#666"/>
                  <circle cx="47" cy="18" r="2" fill="#FFD700"/>
                </svg>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-4 animate-bounce" style={{animationDelay: '0.5s'}}>
              <div className="w-6 h-6 bg-amber-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs">📦</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-6xl animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
          <p className="text-gray-600">Your order is being processed</p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Processing your order...</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes drive {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(400px); }
        }
        
        .animate-drive {
          animation: drive 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, getCartTotal } = useCart();
  
  const shippingData = location.state?.shippingData as ShippingData;
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedUpiProvider, setSelectedUpiProvider] = useState<UpiProvider>('gpay');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [showCarAnimation, setShowCarAnimation] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  useEffect(() => {
    if (!shippingData) {
      navigate("/checkout");
    }
  }, [shippingData, navigate]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // API call to create Razorpay order
  const createRazorpayOrder = async (amount: number): Promise<RazorpayOrder> => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            customer_name: `${shippingData.firstName} ${shippingData.lastName}`,
            customer_email: shippingData.email,
            customer_phone: shippingData.phone,
            shipping_address: shippingData.address,
            items: items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity
            }))
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // API call to verify payment
  const verifyPayment = async (paymentData: RazorpayResponse & { shipping_data: ShippingData, order_items: any[] }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded. Please refresh and try again.');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const totalAmount = getCartTotal() + (paymentMethod === 'cod' ? 50 : 0);
      const order = await createRazorpayOrder(totalAmount);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        image: '/logo.png', // Your store logo
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment with backend
            await verifyPayment({
              ...response,
              shipping_data: shippingData,
              order_items: items.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.price
              }))
            });

            // Show success animation
            setShowCarAnimation(true);
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        notes: {
          address: shippingData.address,
        },
        theme: {
          color: '#B45309', // Your theme color (amber-700)
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessingPayment(false);
      });

      rzp.open();
    } catch (error) {
      alert('Failed to initiate payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const generateUPIQRCode = async (provider: UpiProvider) => {
    try {
      const totalAmount = getCartTotal() + (paymentMethod === 'cod' ? 50 : 0);
      
      const upiString = `upi://pay?pa=merchant@${provider}&pn=Your Store&am=${totalAmount}&cu=INR&tn=Payment for Order`;
      
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
      
      setQrCodeUrl(qrApiUrl);
      setShowQRCode(true);
      
      setPaymentId(`pay_${Date.now()}`);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handleUpiProviderSelect = (provider: UpiProvider) => {
    setSelectedUpiProvider(provider);
    if (provider !== 'other') {
      generateUPIQRCode(provider);
    } else {
      setShowQRCode(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowCarAnimation(false);
    clearCart();
    navigate("/order-confirmation");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'cod') {
      // For COD, directly show success animation
      setShowCarAnimation(true);
    } else if (paymentMethod === 'upi' && showQRCode) {
      const confirmPayment = window.confirm('Have you completed the payment? Click OK if payment is done.');
      if (confirmPayment) {
        setShowCarAnimation(true);
      }
    } else {
      // For card and netbanking, use Razorpay
      handleRazorpayPayment();
    }
  };

  const upiProviders = [
    { id: 'gpay', name: 'Google Pay', icon: '🟢' },
    { id: 'paytm', name: 'Paytm', icon: '🔵' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
    { id: 'bhim', name: 'BHIM UPI', icon: '🟠' },
    { id: 'amazonpay', name: 'Amazon Pay', icon: '🟡' },
    { id: 'other', name: 'Other UPI App', icon: '⚪' },
  ];

  const popularBanks = [
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Bank of Baroda',
    'Punjab National Bank',
    'Canara Bank',
    'Union Bank of India',
    'Indian Bank',
    'Central Bank of India'
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F7F5]">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Please add items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your payment will be processed securely through Razorpay. You'll be redirected to enter your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Choose QR code option for quick payment, or click "Complete Purchase" to pay via Razorpay UPI.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick UPI Payment Options
              </label>
              <div className="grid grid-cols-2 gap-3">
                {upiProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleUpiProviderSelect(provider.id as UpiProvider)}
                    className={`p-3 border rounded-lg flex items-center space-x-2 transition-all ${
                      selectedUpiProvider === provider.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-lg">{provider.icon}</span>
                    <span className="text-sm font-medium">{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {showQRCode && selectedUpiProvider !== 'other' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Scan QR Code to Pay with {upiProviders.find(p => p.id === selectedUpiProvider)?.name}
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Amount: ₹{getCartTotal().toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment ID: {paymentId}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Waiting for payment...</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-blue-700">
                        1. Open your {upiProviders.find(p => p.id === selectedUpiProvider)?.name} app<br/>
                        2. Scan this QR code<br/>
                        3. Complete the payment<br/>
                        4. Click "Confirm Payment" below after payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    You will be redirected to Razorpay to select your bank and complete the payment securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Cash on Delivery</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Pay with cash when your order is delivered to your doorstep.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please keep exact change ready. Additional charges of ₹50 apply for COD orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!shippingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />
      {showCarAnimation && <CarAnimation onComplete={handleAnimationComplete} />}
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-400">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-100 text-green-600">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium">Shipping</span>
              </div>
              <div className="w-8 h-px bg-amber-600"></div>
              <div className="flex items-center text-amber-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-amber-100 text-amber-600">
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Payment Details
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Choose your payment method and complete your order
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{getCartTotal().toFixed(2)}</p>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <p>COD Charges</p>
                    <p>₹50.00</p>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                  <p>Total</p>
                  <p>₹{(getCartTotal() + (paymentMethod === 'cod' ? 50 : 0)).toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Shipping Address</h3>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="text-amber-600 text-sm hover:text-amber-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{shippingData.firstName} {shippingData.lastName}</p>
                  <p>{shippingData.address}</p>
                  <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                  <p>{shippingData.country}</p>
                  <p>{shippingData.email}</p>
                  <p>{shippingData.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Payment Method
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <div className="font-medium">Cards</div>
                          <div className="text-sm text-gray-500">Debit/Credit Cards</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <div className="font-medium">UPI</div>
                          <div className="text-sm text-gray-500">Pay via UPI</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🏦</span>
                        <div>
                          <div className="font-medium">Net Banking</div>
                          <div className="text-sm text-gray-500">Internet Banking</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💵</span>
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay when delivered</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {renderPaymentForm()}
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate("/checkout")}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-lg font-medium"
                      disabled={isProcessingPayment}
                    >
                      ← Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className={`flex-1 py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 text-lg font-medium transition-colors ${
                        isProcessingPayment
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-amber-700 text-white hover:bg-amber-800'
                      }`}
                    >
                      {isProcessingPayment ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : paymentMethod === 'cod' ? 
                        'Place Order' : 
                        paymentMethod === 'upi' && showQRCode ? 
                          'Confirm Payment (After Scanning QR)' : 
                          'Complete Purchase'
                      }
                    </button>
                  </div>
                  
                  {/* Security badges */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Secure Payment
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="font-semibold">Razorpay</span>
                      <span className="ml-1">Powered</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;