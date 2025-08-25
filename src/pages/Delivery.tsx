import React, { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import Logo from "@/data/Assests/logo.png";

const DeliveryPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState([
    false,
    false,
    false,
  ]);

  const deliverySteps = [
    {
      id: "packed",
      title: "Order Packed",
      description:
        "Your furniture has been carefully packed and is ready for shipment",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
      date: "2025-08-20",
      time: "10:30 AM",
    },
    {
      id: "shipped",
      title: "In Transit",
      description: "Your order is on its way and will arrive soon",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      date: "2025-08-21",
      time: "2:15 PM",
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Your beautiful furniture has arrived at your doorstep",
      icon: CheckCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      date: "2025-08-23",
      time: "Expected by 6:00 PM",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    deliverySteps.forEach((_, index) => {
      setTimeout(() => {
        setAnimationComplete((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, (index + 1) * 800);
    });
  });

  const handleContactDelivery = () => {
    window.location.href = "/contact";
  };

  const handleViewOrderDetails = () => {
    window.location.href = "/orders";
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Company Logo - Increased Size */}
            <div
              onClick={() => (window.location.href = "/")}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src={Logo}
                alt="Company Logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Centered Order Info */}
            <div className="text-center">
              <h1 className="text-lg font-medium text-gray-900">
                Track Your Order
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Order #VH-2025-8901234
              </p>
            </div>

            {/* Estimated Delivery */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="text-lg font-medium text-amber-700">
                August 23, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        {/* Progress Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 top-16 h-96 w-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-b from-amber-500 to-amber-600 w-full transition-all duration-1000 ease-out"
              style={{
                height: `${((currentStep + 1) / deliverySteps.length) * 100}%`,
                transform: "translateY(-100%)",
                animation: "slideDown 2s ease-out forwards",
              }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {deliverySteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={step.id}
                  className={`relative flex items-start transition-all duration-700 ${
                    animationComplete[index]
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                >
                  {/* Icon Container */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive ? step.bgColor : "bg-gray-100"
                    } ${isActive ? "scale-110 shadow-lg" : "scale-100"}`}
                  >
                    <Icon
                      size={24}
                      className={`transition-all duration-300 ${
                        isActive ? step.color : "text-gray-400"
                      } ${isCompleted ? "animate-bounce" : ""}`}
                    />

                    {/* Pulse Animation for Active Step */}
                    {isActive && !isCompleted && (
                      <div
                        className={`absolute inset-0 rounded-full ${step.bgColor} animate-ping opacity-30`}
                      />
                    )}

                    {/* Check Mark for Completed Steps */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="ml-6 flex-1">
                    <div
                      className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-500 ${
                        isActive
                          ? "border-amber-200 shadow-md transform scale-105"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`text-xl font-semibold mb-2 ${
                              isActive ? "text-amber-800" : "text-gray-700"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {step.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            <span>
                              {step.date} at {step.time}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted
                              ? "bg-green-100 text-green-800"
                              : isActive
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isCompleted
                            ? "Completed"
                            : isActive
                            ? "In Progress"
                            : "Pending"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Info Card */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <MapPin size={20} className="mr-2 text-amber-600" />
            Delivery Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Shipping Address
              </h4>
              <p className="text-gray-600 leading-relaxed">
                John Doe
                <br />
                123 Main Street, Apt 4B
                <br />
                Dehra Dun, Uttarakhand 248001
                <br />
                India
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Delivery Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Courier:</span>
                  <span className="font-medium">VH Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking ID:</span>
                  <span className="font-medium">VHE789012345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Window:</span>
                  <span className="font-medium">9 AM - 7 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleContactDelivery}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Contact Delivery Partner
          </button>
          <button
            onClick={handleViewOrderDetails}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 py-3 px-6 rounded-lg font-medium border border-gray-300 transition-colors duration-200"
          >
            View Order Details
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DeliveryPage;
