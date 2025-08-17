import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useItems, Item } from "@/context/ItemContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Upload, X, ShoppingBag, Loader2 } from "lucide-react";
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
import { fileToBase64, validateImageFile } from "@/utils/fileUtils";
import { toast } from "@/components/ui/use-toast";

// Form fields component outside of main component
const ItemFormFields = ({ formData, setFormData, imagePreview, setImagePreview, imageFile, setImageFile, editingItem }) => {
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleImageChange = useCallback(async (e) => {
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
      setFormData(prev => ({ ...prev, image: base64 }));
    } catch (error) {
      console.error("Error converting image:", error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  }, [setFormData, setImagePreview, setImageFile]);

  const removeImage = useCallback(() => {
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
    setImageFile(null);
  }, [setFormData, setImagePreview, setImageFile]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item-name">Name *</Label>
        <Input
          id="item-name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Item name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="item-description">Description</Label>
        <Textarea
          id="item-description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Item description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="item-price">Price (₹) *</Label>
          <Input
            id="item-price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-category">Category *</Label>
          <Input
            id="item-category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="item-image">Image {!editingItem && '*'}</Label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="item-image-upload"
            className="flex items-center justify-center w-full h-12 px-4 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            <span>{imageFile ? imageFile.name : "Upload image"}</span>
            <input
              id="item-image-upload"
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
          <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  );
};

const ManageItems = () => {
  const { getUserItems, addItem, updateItem, deleteItem, isLoading } = useItems();
  const userItems = getUserItems();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const resetForm = useCallback(() => {
    setFormData({ name: "", description: "", price: "", category: "", image: "" });
    setImagePreview("");
    setImageFile(null);
    setEditingItem(null);
  }, []);

  const openAddSheet = useCallback(() => {
    resetForm();
    setIsSheetOpen(true);
  }, [resetForm]);

  const openEditSheet = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setImagePreview(item.image);
    setIsSheetOpen(true);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || (!formData.image && !editingItem)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category.toLowerCase(),
        ...(formData.image && { image: formData.image }),
      };

      if (editingItem) {
        await updateItem(editingItem.id, itemData);
      } else {
        await addItem({ ...itemData, image: formData.image });
      }

      setIsSheetOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'add'} item`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [formData, editingItem, addItem, updateItem, resetForm]);

  const handleDelete = useCallback(async (id) => {
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
  }, [deleteItem]);

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
    resetForm();
  }, [resetForm]);

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
              <p className="text-black/70 mt-1">Add, edit, and remove items that you want to sell</p>
            </div>

            <Button 
              className="bg-black text-white hover:bg-black/80 transition-colors flex items-center gap-2"
              onClick={openAddSheet}
            >
              <Plus size={16} />
              <span>Add New Item</span>
            </Button>
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full capitalize">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">₹{item.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-black"
                              onClick={() => openEditSheet(item)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    onClick={() => handleDelete(item.id)}
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
                  You haven't added any items yet. Click the "Add New Item" button to get started.
                </p>
                <Button
                  className="bg-black text-white hover:bg-black/80 transition-colors"
                  onClick={openAddSheet}
                >
                  Add Your First Item
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-6">
              <ItemFormFields 
                formData={formData}
                setFormData={setFormData}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                imageFile={imageFile}
                setImageFile={setImageFile}
                editingItem={editingItem}
              />
            </div>
            <SheetFooter className="mt-8 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeSheet}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ManageItems;