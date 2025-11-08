import React, { useState, useEffect } from "react";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/use-products";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { products, loading, error, refetch } = useProducts();

  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const getFallbackImage = () =>
    "https://via.placeholder.com/800x600?text=VH+International";

  const renderContent = () => {
    if (loading) {
      return (
        <div className="relative h-[500px] md:h-[700px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured products...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="relative h-[500px] md:h-[700px] flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh <RefreshCcw size={16} className="ml-2" />
            </button>
          </div>
        </div>
      );
    }

    if (featuredProducts.length === 0) {
      return (
        <div className="relative h-[500px] md:h-[700px] flex items-center justify-center">
          <div className="text-center bg-yellow-50 p-8 rounded-xl border border-yellow-200">
            <p className="text-yellow-800">
              No featured products available at the moment.
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Please check back later or browse our full collection.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[500px] md:h-[700px]">
        {featuredProducts.map((product, index) => {
          const discountedPrice =
            product.cost - (product.cost * product.discount) / 100;
          const imageUrl = product.img_url || getFallbackImage();

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={`absolute inset-0 transition-all duration-700 ease-in-out product-card ${
                index === activeIndex
                  ? "opacity-100 translate-x-0 scale-100"
                  : index < activeIndex
                  ? "opacity-0 -translate-x-full scale-95"
                  : "opacity-0 translate-x-full scale-95"
              }`}
            >
              <div className="relative h-full w-full rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                {product.discount > 0 && (
                  <div className="absolute top-8 left-8 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-lg">
                    {product.discount}% OFF
                  </div>
                )}
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full z-10">
                  <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-xl max-w-md transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <span className="text-xs uppercase tracking-wider text-amber-700 mb-2 block">
                      {product.product_category || "Featured Product"}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-medium mb-2">
                      {product.name}
                    </h3>
                    <p className="text-black/70 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-xl font-medium">
                              ₹{Math.round(discountedPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.cost}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-medium">
                            ₹{product.cost}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center text-sm font-medium text-amber-700">
                        View details <ArrowRight size={16} className="ml-1" />
                      </span>
                    </div>
                    {product.quantity > 0 ? (
                      <p className="text-xs text-green-600 mt-2">In Stock</p>
                    ) : (
                      <p className="text-xs text-red-600 mt-2">Out of Stock</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {featuredProducts.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                className={`w-8 h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-amber-700" : "bg-black/20"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="min-h-screen w-full pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-16 md:mb-24">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-amber-50 text-amber-800 rounded-full mb-3 animate-fade-in">
            Handcrafted Quality
          </span>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            Handmade Brass <br />
            Endless Grace
          </h1>
          <p
            className="text-lg md:text-xl text-black/70 max-w-2xl mb-8 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            Thoughtfully designed pieces that bring comfort, style, and
            functionality to your home. Crafted with sustainable materials and
            timeless design.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-transform hover:translate-x-1 animate-fade-in hover:bg-amber-800"
            style={{ animationDelay: "600ms" }}
          >
            Browse collection <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        {renderContent()}
      </div>
    </section>
  );
};

export default HeroSection;
