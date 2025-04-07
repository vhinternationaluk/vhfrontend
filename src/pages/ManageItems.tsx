import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useItems, Item } from "@/context/ItemContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { fileToBase64, validateImageFile } from "@/utils/fileUtils";
import { toast } from "@/components/ui/use-toast";

const ManageItems = () => {
  const { getUserItems, addItem, updateItem, deleteItem, isLoading } =
    useItems();
  const navigate = useNavigate();
  const userItems = getUserItems();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Separate form states for add and edit
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Reset forms
  const resetAddForm = () => {
    setAddFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    setImagePreview("");
    setImageFile(null);
  };

  const resetEditForm = () => {
    setEditFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid image",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      
      // Update the appropriate form based on which dialog is open
      if (isAddDialogOpen) {
        setAddFormData(prev => ({ ...prev, image: base64 }));
      } else if (isEditDialogOpen) {
        setEditFormData(prev => ({ ...prev, image: base64 }));
      }
    } catch (error) {
      console.error("Error converting image to base64:", error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  // Separate input handlers
  const handleAddInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addFormData.name ||
      !addFormData.price ||
      !addFormData.category ||
      !addFormData.image
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await addItem({
        name: addFormData.name,
        description: addFormData.description,
        price: parseFloat(addFormData.price),
        category: addFormData.category.toLowerCase(),
        image: addFormData.image,
      });

      setIsAddDialogOpen(false);
      resetAddForm();
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setImagePreview(item.image);
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingItem ||
      !editFormData.name ||
      !editFormData.price ||
      !editFormData.category
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await updateItem(editingItem.id, {
        name: editFormData.name,
        description: editFormData.description,
        price: parseFloat(editFormData.price),
        category: editFormData.category.toLowerCase(),
        ...(editFormData.image !== editingItem.image ? { image: editFormData.image } : {}),
      });

      setIsEditDialogOpen(false);
      resetEditForm();
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Separate form field components
  const AddItemFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={addFormData.name}
          onChange={handleAddInputChange}
          placeholder="Item name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={addFormData.description}
          onChange={handleAddInputChange}
          placeholder="Item description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={addFormData.price}
            onChange={handleAddInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={addFormData.category}
            onChange={handleAddInputChange}
            placeholder="Category"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image *</Label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center w-full h-12 px-4 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            <span>{imageFile ? imageFile.name : "Upload image"}</span>
            <input
              id="image-upload"
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
              onClick={() => {
                setImagePreview("");
                setAddFormData(prev => ({ ...prev, image: "" }));
                setImageFile(null);
              }}
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      {imagePreview && (
        <div className="mt-4 border rounded-md overflow-hidden w-full max-w-xs mx-auto">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );

  const EditItemFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={editFormData.name}
          onChange={handleEditInputChange}
          placeholder="Item name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={editFormData.description}
          onChange={handleEditInputChange}
          placeholder="Item description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={editFormData.price}
            onChange={handleEditInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={editFormData.category}
            onChange={handleEditInputChange}
            placeholder="Category"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image *</Label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center w-full h-12 px-4 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            <span>{imageFile ? imageFile.name : "Upload image"}</span>
            <input
              id="image-upload"
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
              onClick={() => {
                setImagePreview("");
                setEditFormData(prev => ({ ...prev, image: "" }));
                setImageFile(null);
              }}
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      {imagePreview && (
        <div className="mt-4 border rounded-md overflow-hidden w-full max-w-xs mx-auto">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-medium">Manage Items</h1>
              <p className="text-black/70 mt-1">
                Add, edit, and remove items that you want to sell
              </p>
            </div>

            <Dialog 
              open={isAddDialogOpen} 
              onOpenChange={setIsAddDialogOpen}
              key="add-dialog"
            >
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-black/80 transition-colors flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add New Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem}>
                  <div className="py-4">
                    <AddItemFormFields />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetAddForm();
                        setIsAddDialogOpen(false);
                      }}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Item
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-gray-400" />
                <p className="text-black/70">Loading your items...</p>
              </div>
            ) : userItems.length > 0 ? (
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
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full capitalize">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            ₹{item.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-black"
                              onClick={() => handleEditClick(item)}
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
                                    Delete Item
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{item.name}
                                    "? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    onClick={() => handleDeleteItem(item.id)}
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
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">No items yet</p>
                <p className="text-black/70 mb-6 text-center max-w-md">
                  You haven't added any items yet. Click the "Add New Item"
                  button to get started.
                </p>
                <Button
                  className="bg-black text-white hover:bg-black/80 transition-colors"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Your First Item
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        key="edit-dialog"
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateItem}>
            <div className="py-4">
              <EditItemFormFields />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetEditForm();
                  setIsEditDialogOpen(false);
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageItems;