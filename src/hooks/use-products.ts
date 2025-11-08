// hooks/useProducts.ts
import { useState, useEffect } from 'react';
// import { Product } from '@/components/ProductCard';
import { Product } from '@/data/products';
import { useAuth } from '@/context/AuthContext';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        console.warn("No access token found, user might not be logged in");
        setError("Please log in to view products");
        setLoading(false);
        return;
      }

      const response = await fetch("/products/list/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const fetchedProducts: Product[] = await response.json();
      
      // Filter only active products
      const activeProducts = fetchedProducts.filter(product => product.is_active);
      
      setProducts(activeProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  useEffect(() => {
    // Only fetch if user is logged in (has currentUser or access token)
    if (currentUser || localStorage.getItem("accessToken")) {
      fetchProducts();
    } else {
      setLoading(false);
      setError("Please log in to view products");
    }
  }, [currentUser]);

  return {
    products,
    loading,
    error,
    refetch
  };
};

export default useProducts;