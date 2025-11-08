import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Package,
  Loader2,
  Search,
  Filter,
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB ka max size hoga
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: "Please select a valid image file (JPEG, PNG, WebP, or GIF)",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, message: "Image size should be less than 5MB" };
  }

  return { valid: true };
};

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
      case true:
        return "bg-green-100 text-green-800";
      case "inactive":
      case false:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const displayStatus =
    status === true ? "active" : status === false ? "inactive" : status;

  return (
    <Badge className={`${getStatusColor()} border-0`}>{displayStatus}</Badge>
  );
};

const ProductFormFields = ({
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  imageFile,
  setImageFile,
  editingItem,
  categories,
}) => {
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      setImageFile(file);
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
        setFormData((prev) => ({ ...prev, image: file })); 
      } catch (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image");
      }
    },
    [setFormData, setImagePreview, setImageFile]
  );

  const removeImage = useCallback(() => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: null }));
    setImageFile(null);
  }, [setFormData, setImagePreview, setImageFile]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-name">Product Name *</Label>
        <Input
          id="product-name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-price">Price (₹) *</Label>
          <Input
            id="product-price"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock Quantity *</Label>
          <Input
            id="product-stock"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-discount">Discount (%)</Label>
        <Input
          id="product-discount"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleInputChange}
          placeholder="0"
          min="0"
          max="100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-status">Status *</Label>
        <Select
          value={formData.is_active?.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, is_active: value === "true" }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-image">
          Product Image {!editingItem && "*"}
        </Label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="product-image-upload"
            className="flex items-center justify-center w-full h-12 px-4 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            <span>{imageFile ? imageFile.name : "Upload image"}</span>
            <input
              id="product-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeImage}
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      {imagePreview && (
        <div className="mt-4 border rounded-md overflow-hidden w-full max-w-xs">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );
};

const ProductForm = ({
  products = [],
  categories = [],
  onProductAdd,
  onProductUpdate,
  onProductDelete,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    cost: "",
    image: null,
    is_active: true,
    quantity: "",
    discount: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const resetForm = useCallback(() => {
    setProductFormData({
      name: "",
      description: "",
      cost: "",
      image: null,
      is_active: true,
      quantity: "",
      discount: "",
    });
    setImagePreview("");
    setImageFile(null);
    setEditingItem(null);
  }, []);

  const getAccessToken = useCallback(() => {
    return localStorage.getItem("accessToken");
  }, []);

  const createProductAPI = useCallback(
    async (productData) => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("Creating product with data:", productData);

      try {
        let imgUrl = null;
        if (productData.image && productData.image instanceof File) {
          console.log("Converting image to base64...");
          imgUrl = await fileToBase64(productData.image);
        }

        const username = localStorage.getItem("username") || "admin";
        const currentDateTime = new Date().toISOString();

        const jsonPayload = {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: productData.name,
          description: productData.description || "",
          cost: parseFloat(productData.cost),
          quantity: parseInt(productData.quantity),
          img_url: imgUrl,
          discount: parseFloat(productData.discount) || 0,
          is_active: productData.is_active,
          created_by: username,
          created_on: currentDateTime,
          modified_by: new Date().toLocaleDateString("en-GB"), 
          modified_on: currentDateTime,
          no_of_purchase: 0,
          product_category: null,
        };

        console.log("Sending complete JSON payload:", jsonPayload);

        const response = await fetch("/products/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: accessToken,
          },
          body: JSON.stringify(jsonPayload),
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          const responseText = await response.text();
          console.log("API Error Response:", responseText);

          let errorMessage = "Failed to create product.";

          if (response.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
          } else if (response.status === 400) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage =
                errorData.message ||
                errorData.detail ||
                errorData.status_message ||
                errorMessage;
              if (errorData.errors || errorData.non_field_errors) {
                const errors = errorData.errors || errorData.non_field_errors;
                if (Array.isArray(errors)) {
                  errorMessage = errors.join(", ");
                } else if (typeof errors === "object") {
                  errorMessage = Object.values(errors).flat().join(", ");
                }
              }
            } catch (e) {
              errorMessage = responseText || errorMessage;
            }
          } else if (response.status === 404) {
            errorMessage = "API endpoint not found. Please check the URL.";
          } else if (response.status === 500) {
            errorMessage = "Server error occurred. Please try again later.";
          } else {
            errorMessage = `Request failed (${response.status}): ${responseText}`;
          }

          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log("API Success Response:", responseData);
        return responseData;
      } catch (error) {
        console.error("API Request Error:", error);

        if (error.message.includes("Failed to fetch")) {
          throw new Error(
            "Network error. Please check your internet connection."
          );
        }

        throw error;
      }
    },
    [getAccessToken]
  );

  const updateProductAPI = useCallback(
    async (productId, productData) => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("Updating product with ID:", productId, "Data:", productData);

      try {
        let imgUrl = null;
        if (productData.image && productData.image instanceof File) {
          console.log("Converting image to base64...");
          imgUrl = await fileToBase64(productData.image);
        } else {
          imgUrl =
            imagePreview && !imagePreview.startsWith("data:")
              ? imagePreview
              : null;
        }

        const username = localStorage.getItem("username") || "admin";
        const currentDateTime = new Date().toISOString();

        const originalProduct = editingItem;

        const jsonPayload = {
          id: productId, 
          name: productData.name,
          description: productData.description || "",
          cost: parseFloat(productData.cost),
          quantity: parseInt(productData.quantity),
          img_url: imgUrl,
          discount: parseFloat(productData.discount) || 0,
          is_active: productData.is_active,
          created_by: originalProduct?.created_by || username,
          created_on: originalProduct?.created_on || currentDateTime,
          modified_by: new Date().toLocaleDateString("en-GB"), 
          modified_on: currentDateTime,
          no_of_purchase:
            originalProduct?.no_of_purchase || originalProduct?.sales || 0,
          product_category:
            originalProduct?.product_category ||
            originalProduct?.category ||
            null,
        };

        console.log("Sending complete update JSON payload:", jsonPayload);

        const response = await fetch(`/products/update/${productId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: accessToken,
          },
          body: JSON.stringify(jsonPayload),
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.log("Update API Error Response:", responseText);

          let errorMessage = "Failed to update product.";
          if (response.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
          } else if (response.status === 404) {
            errorMessage = "Product not found.";
          } else if (response.status === 400) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage =
                errorData.message ||
                errorData.detail ||
                errorData.status_message ||
                errorMessage;
              if (errorData.errors || errorData.non_field_errors) {
                const errors = errorData.errors || errorData.non_field_errors;
                if (Array.isArray(errors)) {
                  errorMessage = errors.join(", ");
                } else if (typeof errors === "object") {
                  errorMessage = Object.values(errors).flat().join(", ");
                }
              }
            } catch (e) {
              errorMessage = responseText || errorMessage;
            }
          }

          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log("Update API Success Response:", responseData);
        return responseData;
      } catch (error) {
        console.error("Update API Request Error:", error);
        throw error;
      }
    },
    [getAccessToken, imagePreview, editingItem]
  );

  const deleteProductAPI = useCallback(
    async (productId) => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      try {
        const response = await fetch(`/products/delete/${productId}/`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            token: accessToken,
          },
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.log("Delete API Error Response:", responseText);

          let errorMessage = "Failed to delete product.";
          if (response.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
          } else if (response.status === 404) {
            errorMessage = "Product not found.";
          }

          throw new Error(errorMessage);
        }

        return await response.json();
      } catch (error) {
        console.error("Delete API Request Error:", error);
        throw error;
      }
    },
    [getAccessToken]
  );

  const openAddProductSheet = useCallback(() => {
    resetForm();
    setIsSheetOpen(true);
  }, [resetForm]);

  const openEditProductSheet = useCallback((product) => {
    setEditingItem(product);
    setProductFormData({
      name: product.name || "",
      description: product.description || "",
      cost: product.cost?.toString() || product.price?.toString() || "",
      image: null, 
      is_active:
        product.is_active !== undefined
          ? product.is_active
          : product.status === "active",
      quantity: product.quantity?.toString() || product.stock?.toString() || "",
      discount: product.discount?.toString() || "",
    });
    setImagePreview(product.img_url || product.image || "");
    setIsSheetOpen(true);
  }, []);

  const handleProductSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !productFormData.name ||
        !productFormData.cost ||
        !productFormData.quantity ||
        (!productFormData.image && !editingItem)
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      try {
        const productData = {
          name: productFormData.name,
          description: productFormData.description,
          cost: parseFloat(productFormData.cost),
          is_active: productFormData.is_active,
          quantity: parseInt(productFormData.quantity),
          discount: parseFloat(productFormData.discount) || 0,
          ...(productFormData.image && { image: productFormData.image }),
        };

        if (editingItem) {
          const updatedProduct = await updateProductAPI(
            editingItem.id,
            productData
          );

          const transformedProduct = {
            id: updatedProduct.id,
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.cost,
            cost: updatedProduct.cost,
            category: updatedProduct.product_category,
            product_category: updatedProduct.product_category,
            image: updatedProduct.img_url,
            img_url: updatedProduct.img_url,
            status: updatedProduct.is_active ? "active" : "inactive",
            is_active: updatedProduct.is_active,
            stock: updatedProduct.quantity,
            quantity: updatedProduct.quantity,
            sales: updatedProduct.no_of_purchase || 0,
            no_of_purchase: updatedProduct.no_of_purchase || 0,
            discount: updatedProduct.discount,
            created_by: updatedProduct.created_by,
            created_on: updatedProduct.created_on,
            modified_by: updatedProduct.modified_by,
            modified_on: updatedProduct.modified_on,
          };

          onProductUpdate(editingItem.id, transformedProduct);
          toast({
            title: "Product Updated",
            description: "Product has been updated successfully",
          });
        } else {
          const newProduct = await createProductAPI(productData);

          const transformedProduct = {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.cost,
            cost: newProduct.cost,
            category: newProduct.product_category,
            product_category: newProduct.product_category,
            image: newProduct.img_url,
            img_url: newProduct.img_url,
            status: newProduct.is_active ? "active" : "inactive",
            is_active: newProduct.is_active,
            stock: newProduct.quantity,
            quantity: newProduct.quantity,
            sales: newProduct.no_of_purchase || 0,
            no_of_purchase: newProduct.no_of_purchase || 0,
            discount: newProduct.discount,
            created_by: newProduct.created_by,
            created_on: newProduct.created_on,
            modified_by: newProduct.modified_by,
            modified_on: newProduct.modified_on,
          };

          onProductAdd(transformedProduct);
          toast({
            title: "Product Created",
            description: "Product has been created successfully",
          });
        }

        setIsSheetOpen(false);
        resetForm();
      } catch (error) {
        console.error("Error saving product:", error);
        toast({
          title: "Error",
          description:
            error.message ||
            `Failed to ${editingItem ? "update" : "create"} product`,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [
      productFormData,
      editingItem,
      resetForm,
      onProductAdd,
      onProductUpdate,
      createProductAPI,
      updateProductAPI,
      toast,
    ]
  );

  const handleDeleteProduct = useCallback(
    async (id) => {
      try {
        await deleteProductAPI(id);
        onProductDelete(id);
        toast({
          title: "Product Deleted",
          description: "Product has been deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete product",
          variant: "destructive",
        });
      }
    },
    [onProductDelete, deleteProductAPI, toast]
  );

  // Filtered data based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesFilter = true;
      if (filterStatus !== "all") {
        if (filterStatus === "active") {
          matchesFilter =
            product.status === "active" || product.is_active === true;
        } else if (filterStatus === "inactive") {
          matchesFilter =
            product.status === "inactive" || product.is_active === false;
        }
      }

      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search products..."
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
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddProductSheet}>
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products List */}
      <Card>
        <CardContent className="p-0">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Sales
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
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={product.img_url || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full capitalize">
                          {product.category || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          ₹
                          {(
                            product.cost ||
                            product.price ||
                            0
                          ).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            (product.quantity || product.stock) === 0
                              ? "text-red-600"
                              : (product.quantity || product.stock) < 10
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.quantity || product.stock || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {product.discount || 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {product.no_of_purchase || product.sales || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={
                            product.is_active !== undefined
                              ? product.is_active
                              : product.status
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-black"
                            onClick={() => openEditProductSheet(product)}
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
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 text-white hover:bg-red-600"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
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
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                {searchTerm || filterStatus !== "all"
                  ? "No products match your search criteria. Try adjusting your filters."
                  : "You haven't added any products yet. Click the 'Add Product' button to get started."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button onClick={openAddProductSheet}>
                  Add Your First Product
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingItem ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleProductSubmit} className="mt-6">
            <div className="space-y-6">
              <ProductFormFields
                formData={productFormData}
                setFormData={setProductFormData}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                imageFile={imageFile}
                setImageFile={setImageFile}
                editingItem={editingItem}
                categories={categories}
              />
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
                {editingItem ? "Update Product" : "Add Product"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductForm;
