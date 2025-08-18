import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "@/components/Navbar";

import invoicePDF from "@/data/Assests/invoice.pdf";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';
type UpiProvider = 'gpay' | 'paytm' | 'phonepe' | 'bhim' | 'amazonpay' | 'other';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedUpiProvider, setSelectedUpiProvider] = useState<UpiProvider>('gpay');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  // Load Razorpay script
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

  // Generate UPI QR Code using Razorpay
  const generateUPIQRCode = async (provider: UpiProvider) => {
    try {
      const totalAmount = getCartTotal() + (paymentMethod === 'cod' ? 50 : 0);
      
      // Create UPI payment link
      const upiString = `upi://pay?pa=merchant@${provider}&pn=Your Store&am=${totalAmount}&cu=INR&tn=Payment for Order`;
      
      // Generate QR code using a QR code API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
      
      setQrCodeUrl(qrApiUrl);
      setShowQRCode(true);
      
      // Generate a mock payment ID
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

  // Simulate payment verification
  const verifyPayment = () => {
    // In a real implementation, you would verify the payment status with Razorpay
    const isPaymentSuccessful = Math.random() > 0.2; // 80% success rate for demo
    
    if (isPaymentSuccessful) {
      alert('Payment Successful! ✅');
      downloadInvoicePDF();
      clearCart();
      navigate("/order-confirmation");
    } else {
      alert('Payment Failed! Please try again. ❌');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadInvoicePDF = () => {
    const link = document.createElement("a");
    link.href = invoicePDF;
    link.download = "invoice.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'upi' && showQRCode) {
      // For UPI QR code payments, show verification dialog
      const confirmPayment = window.confirm('Have you completed the payment? Click OK if payment is done.');
      if (confirmPayment) {
        verifyPayment();
      }
    } else {
      // For other payment methods, process normally
      downloadInvoicePDF();
      clearCart();
      navigate("/order-confirmation");
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
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card number
              </label>
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                required
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                value={formData.cardNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                Name on card
              </label>
              <input
                type="text"
                name="cardName"
                id="cardName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                value={formData.cardName}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  id="expiryDate"
                  placeholder="MM/YY"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  id="cvv"
                  required
                  placeholder="123"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose UPI Provider
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
            
            {/* QR Code Display */}
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
                    Amount: ₹{(getCartTotal() + ((paymentMethod as PaymentMethod) === 'cod' ? 50 : 0)).toFixed(2)}
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
                        4. Click "Complete Purchase" below after payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                id="upiId"
                required
                placeholder="yourname@upi"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                value={formData.upiId}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI ID (e.g., 9876543210@paytm, yourname@oksbi)
              </p>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                Select Bank
              </label>
              <select
                name="bankName"
                id="bankName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                value={formData.bankName}
                onChange={handleChange}
              >
                <option value="">Select your bank</option>
                {popularBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    You will be redirected to your bank's secure login page to complete the payment.
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
                    Please keep exact change ready. Additional charges of ₹50 may apply for COD orders.
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

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Please fill in your details to complete your purchase
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
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
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Street address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Payment Method
                  </h2>
                  
                  {/* Payment Method Selection */}
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
                          <div className="text-sm text-gray-500">Pay via UPI ID</div>
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

                  {/* Dynamic Payment Form */}
                  {renderPaymentForm()}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-amber-700 text-white py-3 px-4 rounded-full hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 text-lg font-medium"
                  >
                    {paymentMethod === 'cod' 
                      ? 'Place Order' 
                      : paymentMethod === 'upi' && showQRCode 
                        ? 'Complete Purchase (After Payment)' 
                        : 'Complete Purchase'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;