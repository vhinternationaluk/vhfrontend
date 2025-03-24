import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Clock, Check, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const mockOrders = [
  {
    id: 'VH-12345',
    date: '2025-06-15',
    status: 'Delivered',
    total: 12999,
    items: [
      { id: 1, name: 'Modern Leather Sofa', price: 89999, quantity: 1 },
      { id: 2, name: 'Scandinavian Dining Table', price: 40000, quantity: 1 }
    ]
  },
  {
    id: 'VH-12346',
    date: '2025-07-26',
    status: 'Processing',
    total: 10995,
    items: [
      { id: 3, name: 'King Size Platform Bed', price: 10995, quantity: 1 }
    ]
  },
  {
    id: 'VH-12347',
    date: '2025-08-03',
    status: 'Shipped',
    total: 14998,
    items: [
      { id: 4, name: 'Minimalist Coffee Table', price: 7499, quantity: 2 }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'Processing':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'Shipped':
      return <Package className="h-4 w-4 text-blue-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Processing':
      return 'bg-amber-100 text-amber-800';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-red-100 text-red-800';
  }
};

const Orders = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-medium text-center mb-8">My Orders</h1>
          
          {mockOrders.length > 0 ? (
            <div className="space-y-6">
              {mockOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Package className="h-5 w-5" />
                            Order #{order.id}
                          </CardTitle>
                          <CardDescription>
                            Placed on {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardDescription>
                        </div>
                        <Badge className={`flex items-center gap-1 px-3 py-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="py-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {item.quantity} x {item.name}
                              </span>
                            </div>
                            <span>₹{item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between pt-2">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">₹{order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Link 
                          to={`/order/${order.id}`} 
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View Details →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center p-8 border-0 shadow-lg bg-white/90 backdrop-blur-md">
              <CardContent className="pt-6">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors"
                >
                  Start Shopping
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;
