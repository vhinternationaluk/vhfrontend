import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

// here i have efine the Item interface
export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  userId: string;
  createdAt: number;
}

interface ItemContextType {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "userId" | "createdAt">) => Promise<void>;
  updateItem: (
    id: string,
    updates: Partial<Omit<Item, "id" | "userId" | "createdAt">>
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getUserItems: () => Item[];
  isLoading: boolean;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemProvider");
  }
  return context;
};

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("items");
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to load items from localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("items", JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = async (
    newItem: Omit<Item, "id" | "userId" | "createdAt">
  ) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to add items",
        variant: "destructive",
      });
      return;
    }

    try {
      const itemToAdd: Item = {
        ...newItem,
        id: Date.now().toString(),
        userId: currentUser.uid,
        createdAt: Date.now(),
      };

      setItems((prevItems) => [...prevItems, itemToAdd]);

      toast({
        title: "Success",
        description: "Item added successfully",
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (
    id: string,
    updates: Partial<Omit<Item, "id" | "userId" | "createdAt">>
  ) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to update items",
        variant: "destructive",
      });
      return;
    }

    try {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id && item.userId === currentUser.uid) {
            return { ...item, ...updates };
          }
          return item;
        })
      );

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      console.error("Failed to update item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to delete items",
        variant: "destructive",
      });
      return;
    }

    try {
      setItems((prevItems) =>
        prevItems.filter(
          (item) => !(item.id === id && item.userId === currentUser.uid)
        )
      );

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const getUserItems = () => {
    if (!currentUser) return [];
    return items.filter((item) => item.userId === currentUser.uid);
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        getUserItems,
        isLoading,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
