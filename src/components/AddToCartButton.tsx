import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: "primary" | "secondary";
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  variant = "primary",
  className,
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={cn(
        "relative overflow-hidden flex items-center justify-center transition-all duration-300",
        variant === "primary"
          ? "bg-amber-700 text-white py-3 px-6 rounded-full hover:bg-amber-800"
          : "bg-white border border-amber-700 text-amber-700 py-3 px-6 rounded-full hover:bg-amber-50",
        isAdding ? "opacity-90" : "opacity-100",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center transition-transform duration-500",
          isAdding ? "-translate-y-10" : "translate-y-0"
        )}
      >
        <ShoppingBag size={18} className="mr-2" />
        <span>Add to cart</span>
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform duration-500",
          isAdding ? "translate-y-0" : "translate-y-10"
        )}
      >
        Added
      </div>
    </button>
  );
};

export default AddToCartButton;
