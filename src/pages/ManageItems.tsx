import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Users,
  ShoppingCart,
  Tags,
  Search,
  Filter,
  Check,
  Clock,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import ProductForm from "./ProductForm";
import logo from "@/data/Assests/logo.png";

// API Product interface matching the API response
interface ApiProduct {
  id: string;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  img_url: string | null;
  discount: number;
  is_active: boolean;
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
  no_of_purchase: number;
  product_category: string | null;
}

// Local Product interface (transformed from API)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: "active" | "inactive";
  stock: number;
  sales: number;
  discount: number;
}

// Mock data for categories (keeping as static for now)
const mockCategories = [
  {
    id: 1,
    name: "Brass Items",
    slug: "electronics",
    description: "Electronic brass devices and gadgets",
    productCount: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Home & Kitchen",
    slug: "home",
    description: "Home and kitchen essentials",
    productCount: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Sports & Fitness",
    slug: "sports",
    description: "Sports and fitness equipment",
    productCount: 5,
    status: "active",
  },
  {
    id: 4,
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and accessories",
    productCount: 15,
    status: "inactive",
  },
];

// Mock data for orders (keeping as static for now)
const mockOrders = [
  {
    id: "ORD001",
    customerName: "Sumit Chaudhary",
    customerEmail: "sumit29@gmail.com",
    customerPhone: "+91 9876543210",
    items: [
      { name: "Wired Brass Gramophones", quantity: 1, price: 4999 },
      { name: "Brass Coffee Mug", quantity: 2, price: 299 },
    ],
    totalAmount: 5597,
    status: "pending",
    paymentStatus: "paid",
    orderDate: "2024-08-20",
    shippingAddress: "123 Main St, New Delhi, 110001",
  },
  {
    id: "ORD002",
    customerName: "Shantanu",
    customerEmail: "shantanu12@gmail.com",
    customerPhone: "+91 8765432109",
    items: [{ name: "Brass Lamp", quantity: 1, price: 2999 }],
    totalAmount: 2999,
    status: "shipped",
    paymentStatus: "paid",
    orderDate: "2024-08-19",
    shippingAddress: "456 Oak Ave, Mumbai, 400001",
  },
  {
    id: "ORD003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    customerPhone: "+91 7654321098",
    items: [{ name: "Coffee Mug", quantity: 3, price: 299 }],
    totalAmount: 897,
    status: "delivered",
    paymentStatus: "paid",
    orderDate: "2024-08-18",
    shippingAddress: "789 Pine St, Bangalore, 560001",
  },
];

// Mock data for users (keeping as static for now)
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    role: "customer",
    status: "active",
    joinDate: "2024-06-15",
    totalOrders: 5,
    totalSpent: 15000,
    lastOrder: "2024-08-20",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 8765432109",
    role: "customer",
    status: "active",
    joinDate: "2024-05-20",
    totalOrders: 3,
    totalSpent: 8500,
    lastOrder: "2024-08-19",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    phone: "+91 7654321098",
    role: "admin",
    status: "active",
    joinDate: "2024-01-01",
    totalOrders: 0,
    totalSpent: 0,
    lastOrder: null,
  },
];

// Transform API product to local product format
const transformApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description,
  price: apiProduct.cost,
  category: apiProduct.product_category || "Uncategorized",
  image: apiProduct.img_url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=",
  status: apiProduct.is_active ? "active" : "inactive",
  stock: apiProduct.quantity,
  sales: apiProduct.no_of_purchase,
  discount: apiProduct.discount,
});

// Status badge component
const StatusBadge = ({ status, type = "default" }) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
      case "paid":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return <Badge className={`${getStatusColor()} border-0`}>{status}</Badge>;
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // State management
  const [activeTab, setActiveTab] = useState("products");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Loading states
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Form data states
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
  });

  // Data states - products now dynamic, others remain static
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(mockCategories);
  const [orders, setOrders] = useState(mockOrders);
  const [users, setUsers] = useState(mockUsers);

  // Get bearer token from auth context
  const getBearerToken = useCallback(() => {
    // Try to get token from localStorage first (API session)
    const apiToken = localStorage.getItem("accessToken");
    if (apiToken) {
      return apiToken;
    }

    // If currentUser exists and has getIdToken method
    if (currentUser && typeof currentUser.getIdToken === 'function') {
      // For Firebase users, we would need to call getIdToken()
      // But since we're primarily using API tokens, we'll focus on that
      return null;
    }

    return null;
  }, [currentUser]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);

    try {
      const token = getBearerToken();
      
      if (!token) {
        throw new Error("No authentication token available");
      }

      console.log("Fetching products with token...");
      
      const response = await fetch("/products/list/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to access this resource.");
        } else {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
      }

      const apiProducts: ApiProduct[] = await response.json();
      console.log("Fetched products:", apiProducts);

      // Transform API products to local format
      const transformedProducts = apiProducts.map(transformApiProduct);
      setProducts(transformedProducts);

      toast({
        title: "Products loaded",
        description: `Successfully loaded ${transformedProducts.length} products.`,
      });

    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsError(error.message);
      
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProductsLoading(false);
    }
  }, [getBearerToken, toast]);

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Form reset function
  const resetForm = useCallback(() => {
    setCategoryFormData({
      name: "",
      slug: "",
      description: "",
      status: "active",
    });
    setEditingItem(null);
  }, []);

  // Product management functions for ProductForm component
  const handleProductAdd = useCallback((newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const handleProductUpdate = useCallback((productId, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedProduct } : p))
    );
  }, []);

  const handleProductDelete = useCallback((productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // Category management functions
  const handleCategorySubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!categoryFormData.name || !categoryFormData.slug) {
        alert("Please fill in all required fields");
        return;
      }

      setIsProcessing(true);
      try {
        if (editingItem) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingItem.id ? { ...c, ...categoryFormData } : c
            )
          );
        } else {
          const newCategory = {
            ...categoryFormData,
            id: Date.now(),
            productCount: 0,
          };
          setCategories((prev) => [...prev, newCategory]);
        }

        setIsSheetOpen(false);
        resetForm();
      } catch (error) {
        console.error("Error saving category:", error);
        alert(`Failed to ${editingItem ? "update" : "add"} category`);
      } finally {
        setIsProcessing(false);
      }
    },
    [categoryFormData, editingItem, resetForm]
  );

  const handleDeleteCategory = useCallback(async (id) => {
    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  }, []);

  // Order management functions
  const handleUpdateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);

  // User management functions
  const handleUpdateUserStatus = useCallback((userId, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  }, []);

  const handleDeleteUser = useCallback((userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  // Refresh products function
  const handleRefreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtered data based on search and filters
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || category.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchTerm, filterStatus]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterStatus]);

  // Dashboard stats
  const dashboardStats = useMemo(
    () => ({
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === "active").length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      totalUsers: users.filter((u) => u.role === "customer").length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    }),
    [products, orders, users]
  );

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <img src={logo} alt="Logo" className="h-12 w-auto" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="w-12"></div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.activeProducts} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{dashboardStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">total earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package size={16} />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags size={16} />
              Categories
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart size={16} />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter Bar (only for categories, orders, users) */}
          {activeTab !== "products" && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    {activeTab === "orders" && (
                      <>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {activeTab === "categories" && (
                <Button
                  onClick={() => {
                    resetForm();
                    setIsSheetOpen(true);
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Add Category
                </Button>
              )}
            </div>
          )}

          {/* Products Tab - Updated with API integration and refresh button */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Products Management</h2>
              <Button
                onClick={handleRefreshProducts}
                disabled={productsLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} className={productsLoading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
            
            {productsError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <div className="text-sm">
                      <strong>Error loading products:</strong> {productsError}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleRefreshProducts}
                      className="ml-auto"
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {productsLoading ? (
              <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Loading products...</p>
                  <p className="text-gray-600">Please wait while we fetch your products.</p>
                </CardContent>
              </Card>
            ) : (
              <ProductForm
                products={products}
                categories={categories}
                onProductAdd={handleProductAdd}
                onProductUpdate={handleProductUpdate}
                onProductDelete={handleProductDelete}
                refreshProducts={handleRefreshProducts}
                isLoading={productsLoading}
              />
            )}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                {filteredCategories.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Slug
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Description
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Products
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredCategories.map((category) => (
                          <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {category.slug}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600 max-w-[300px] truncate">
                                {category.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">
                                {category.productCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={category.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-500 hover:text-black"
                                  onClick={() => {
                                    setEditingItem(category);
                                    setCategoryFormData({
                                      name: category.name,
                                      slug: category.slug,
                                      description: category.description,
                                      status: category.status,
                                    });
                                    setIsSheetOpen(true);
                                  }}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-500 hover:text-red-500"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Category
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {category.name}"? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-500 text-white hover:bg-red-600"
                                        onClick={() =>
                                          handleDeleteCategory(category.id)
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Tags className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                      No categories found
                    </p>
                    <p className="text-gray-600 mb-6 text-center max-w-md">
                      {searchTerm || filterStatus !== "all"
                        ? "No categories match your search criteria. Try adjusting your filters."
                        : "You haven't added any categories yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                {filteredOrders.length > 0 ? (
                  <div className="space-y-4 p-6">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-6 bg-white"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                          <div className="flex items-center gap-4 mb-4 lg:mb-0">
                            <div>
                              <h3 className="font-medium text-lg">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <StatusBadge status={order.status} />
                              <StatusBadge status={order.paymentStatus} />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">
                              ₹{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Users size={16} />
                              Customer Details
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">
                                {order.customerName}
                              </p>
                              <p className="text-gray-600 flex items-center gap-2">
                                <Mail size={12} />
                                {order.customerEmail}
                              </p>
                              <p className="text-gray-600 flex items-center gap-2">
                                <Phone size={12} />
                                {order.customerPhone}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin size={16} />
                              Shipping Address
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Package size={16} />
                            Order Items
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                              >
                                <div>
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  <span className="text-gray-600 ml-2">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <span className="font-medium">
                                  ₹
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleUpdateOrderStatus(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                <div className="flex items-center gap-2">
                                  <Clock size={12} />
                                  Pending
                                </div>
                              </SelectItem>
                              <SelectItem value="shipped">
                                <div className="flex items-center gap-2">
                                  <Package size={12} />
                                  Shipped
                                </div>
                              </SelectItem>
                              <SelectItem value="delivered">
                                <div className="flex items-center gap-2">
                                  <Check size={12} />
                                  Delivered
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">No orders found</p>
                    <p className="text-gray-600 text-center max-w-md">
                      {searchTerm || filterStatus !== "all"
                        ? "No orders match your search criteria. Try adjusting your filters."
                        : "No orders have been placed yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Phone
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Orders
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Total Spent
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Joined{" "}
                                {new Date(user.joinDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {user.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`text-xs px-2 py-1 rounded-full capitalize ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">
                                {user.totalOrders}
                              </div>
                              {user.lastOrder && (
                                <div className="text-xs text-gray-500">
                                  Last:{" "}
                                  {new Date(
                                    user.lastOrder
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">
                                ₹{user.totalSpent.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={user.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Select
                                  value={user.status}
                                  onValueChange={(value) =>
                                    handleUpdateUserStatus(user.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-[100px] h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                      Inactive
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {user.role !== "admin" && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-500 hover:text-red-500"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete User
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete user "
                                          {user.name}"? This action cannot be
                                          undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-500 text-white hover:bg-red-600"
                                          onClick={() =>
                                            handleDeleteUser(user.id)
                                          }
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">No users found</p>
                    <p className="text-gray-600 text-center max-w-md">
                      {searchTerm || filterStatus !== "all"
                        ? "No users match your search criteria. Try adjusting your filters."
                        : "No users have registered yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Category Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingItem ? "Edit Category" : "Add New Category"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleCategorySubmit} className="mt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name *</Label>
                  <Input
                    id="category-name"
                    name="name"
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }))
                    }
                    placeholder="Category name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-slug">Slug *</Label>
                  <Input
                    id="category-slug"
                    name="slug"
                    value={categoryFormData.slug}
                    onChange={(e) =>
                      setCategoryFormData((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="category-slug"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    name="description"
                    value={categoryFormData.description}
                    onChange={(e) =>
                      setCategoryFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Category description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-status">Status *</Label>
                  <Select
                    value={categoryFormData.status}
                    onValueChange={(value) =>
                      setCategoryFormData((prev) => ({
                        ...prev,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-8 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSheetOpen(false);
                  resetForm();
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingItem ? "Update Category" : "Add Category"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;