import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Product } from "../data/products";
import { toast } from "sonner";

// API Response interfaces
interface ApiCartItem {
  id: number;
  product: {
    id: string;
    name: string;
    description: string;
    cost: number;
    quantity: number;
    img_url: string;
    discount: number;
    is_active: boolean;
    created_by: string;
    created_on: string;
    modified_by: string;
    modified_on: string;
    no_of_purchase: number;
    product_category: string;
  };
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface ApiCartResponse {
  id: number;
  items: ApiCartItem[];
  total_items: number;
  created_at: string;
  updated_at: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
  loading: boolean;
  syncWithAPI: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const accessToken = localStorage.getItem("accessToken");

    return (isLoggedIn === "true" || isAdminLoggedIn === "true") && accessToken;
  }, []);

  // Helper function to get access token
  const getAccessToken = useCallback(() => {
    return localStorage.getItem("accessToken");
  }, []);

  // Helper function to convert API product to local Product interface
  const convertApiProductToProduct = (
    apiProduct: ApiCartItem["product"]
  ): Product => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.cost,
      image: apiProduct.img_url,
      category: "api-product",
      inStock: apiProduct.quantity > 0,
      discount: apiProduct.discount,
    };
  };

  // API function to get cart items
  const fetchCartFromAPI = async (): Promise<CartItem[]> => {
    const token = getAccessToken();
    if (!token) throw new Error("No access token available");

    try {
      const response = await fetch("/products/api/cart/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No cart exists yet, return empty array
          return [];
        }
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data: ApiCartResponse = await response.json();

      return data.items.map((item) => ({
        product: convertApiProductToProduct(item.product),
        quantity: item.quantity,
      }));
    } catch (error) {
      console.error("Error fetching cart from API:", error);
      throw error;
    }
  };

  // API function to add item to cart
  const addItemToAPI = async (
    productId: string,
    quantity: number
  ): Promise<void> => {
    const token = getAccessToken();
    if (!token) throw new Error("No access token available");

    try {
      const response = await fetch("/products/api/cart/items/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to add item to cart: ${response.status}`
        );
      }

      const data: ApiCartResponse = await response.json();
      console.log("Item added to API cart:", data);
    } catch (error) {
      console.error("Error adding item to API cart:", error);
      throw error;
    }
  };

  const updateItemInAPI = async (
    productId: string,
    quantity: number
  ): Promise<void> => {
    await removeItemFromAPI(productId);
    if (quantity > 0) {
      await addItemToAPI(productId, quantity);
    }
  };

  const removeItemFromAPI = async (productId: string): Promise<void> => {
    const token = getAccessToken();
    if (!token) throw new Error("No access token available");

    try {
      const response = await fetch(`/products/api/cart/items/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to remove item from cart: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing item from API cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadCartItems = async () => {
      setLoading(true);
      try {
        if (isAuthenticated()) {
          const apiItems = await fetchCartFromAPI();
          setItems(apiItems);
        } else {
          const savedCart = localStorage.getItem("cart");
          const localItems = savedCart ? JSON.parse(savedCart) : [];
          setItems(localItems);
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
        const savedCart = localStorage.getItem("cart");
        const localItems = savedCart ? JSON.parse(savedCart) : [];
        setItems(localItems);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const syncWithAPI = async () => {
    if (!isAuthenticated()) return;

    setLoading(true);
    try {
      const apiItems = await fetchCartFromAPI();

      const savedCart = localStorage.getItem("cart");
      const localItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      for (const localItem of localItems) {
        const existingApiItem = apiItems.find(
          (item) => item.product.id === localItem.product.id
        );

        if (existingApiItem) {
          const newQuantity = existingApiItem.quantity + localItem.quantity;
          await updateItemInAPI(localItem.product.id, newQuantity);
        } else {
          await addItemToAPI(localItem.product.id, localItem.quantity);
        }
      }

      const updatedItems = await fetchCartFromAPI();
      setItems(updatedItems);

      localStorage.removeItem("cart");

      toast("Cart synced successfully", {
        description: "Your cart has been synced with your account",
      });
    } catch (error) {
      console.error("Error syncing cart with API:", error);
      toast("Cart sync failed", {
        description: "Failed to sync cart with your account",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        await addItemToAPI(product.id, quantity);
        const updatedItems = await fetchCartFromAPI();
        setItems(updatedItems);
      } else {
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return prevItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            return [...prevItems, { product, quantity }];
          }
        });
      }

      toast(`Added to cart: ${product.name}`, {
        description: `Quantity: ${quantity}`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Failed to add item to cart", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      const itemToRemove = items.find((item) => item.product.id === productId);

      if (isAuthenticated()) {
        await removeItemFromAPI(productId);
        const updatedItems = await fetchCartFromAPI();
        setItems(updatedItems);
      } else {
        setItems((prevItems) =>
          prevItems.filter((item) => item.product.id !== productId)
        );
      }

      if (itemToRemove) {
        toast(`Removed from cart: ${itemToRemove.product.name}`);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast("Failed to remove item from cart", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    try {
      if (isAuthenticated()) {
        await updateItemInAPI(productId, quantity);
        const updatedItems = await fetchCartFromAPI();
        setItems(updatedItems);
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast("Failed to update quantity", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        // Clear API cart by removing all items
        for (const item of items) {
          await removeItemFromAPI(item.product.id);
        }
      }
      setItems([]);
      localStorage.removeItem("cart");

      toast("Cart cleared", {
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast("Failed to clear cart", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        loading,
        syncWithAPI,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
