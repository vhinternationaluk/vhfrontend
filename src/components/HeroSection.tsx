import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

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
            Furniture for
            <br />
            modern living
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

        <div className="relative h-[500px] md:h-[700px]">
          {featuredProducts.map((product, index) => (
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
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full z-10">
                  <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-xl max-w-md transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <span className="text-xs uppercase tracking-wider text-amber-700 mb-2 block">
                      {product.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-medium mb-2">
                      {product.name}
                    </h3>
                    <p className="text-black/70 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-medium">
                        ₹{product.price}
                      </span>
                      <span className="inline-flex items-center text-sm font-medium text-amber-700">
                        View details <ArrowRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
