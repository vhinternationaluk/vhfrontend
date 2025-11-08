import React from "react";
import Logo from "@/data/Assests/logo.png";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, RefreshCcw } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";

const Index = () => {
  const { products, loading, error } = useProducts();

  // Get regular products (skip first 3 for featured section)
  const regularProducts = products.slice(3);

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.product_category).filter(Boolean))];

  // Get a representative product for each category
  const getCategoryImage = (category: string) => {
    const categoryProduct = products.find(p => p.product_category === category);
    return categoryProduct?.img_url || "https://via.placeholder.com/400x300?text=Category";
  };

  const renderProductSection = () => {
    if (loading && !products.length) {
      return (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      );
    }

    if (error && !products.length) {
      return (
        <div className="text-center py-16">
          <div className="bg-red-50 p-8 rounded-xl border border-red-200 inline-block">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh <RefreshCcw size={16} className="ml-2" />
            </button>
          </div>
        </div>
      );
    }

    if (regularProducts.length === 0 && !loading) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">No products available at the moment.</p>
          <p className="text-sm text-gray-500">Please check back later or contact us for more information.</p>
        </div>
      );
    }

    return (
      <>
        {loading && products.length > 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading more products...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <Navbar />

      {/* Hero section with featured products */}
      <HeroSection />

      {/* Category navigation */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2 className="text-3xl md:text-4xl font-medium mb-10">
              Shop by category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category, index) => (
                <div
                  key={category}
                  className="relative rounded-lg overflow-hidden group h-40 md:h-48 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${100 * index}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
                  <img
                    src={getCategoryImage(category)}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white text-lg font-medium capitalize">
                      {category}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product grid section */}
      <section className="py-20 bg-[#F9F7F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-amber-50 text-amber-800 rounded-full mb-3">
                Our Products
              </span>
              <h2 className="text-3xl md:text-4xl font-medium">
                Our Collection
              </h2>
            </div>
            <a
              href="/shop"
              className="inline-flex items-center text-sm font-medium hover:underline text-amber-700"
            >
              View all <ChevronRight size={16} className="ml-1" />
            </a>
          </div>

          {renderProductSection()}
        </div>
      </section>

      {/* Values section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-amber-100 text-amber-800 rounded-full mb-3">
            Our Values
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-10">
            Why choose our products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-700 font-medium text-xl">01</span>
              </div>
              <h3 className="font-medium text-xl mb-2">
                Premium Materials
              </h3>
              <p className="text-black/70">
                High-quality brass and sustainable materials that respect our planet's
                resources.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-700 font-medium text-xl">02</span>
              </div>
              <h3 className="font-medium text-xl mb-2">Handcrafted Quality</h3>
              <p className="text-black/70">
                Each piece is made by skilled artisans with attention to every
                detail.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-700 font-medium text-xl">03</span>
              </div>
              <h3 className="font-medium text-xl mb-2">Timeless Design</h3>
              <p className="text-black/70">
                Pieces that transcend trends and will be cherished for
                generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter section */}
      <section className="py-20 bg-amber-800 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-white/10 rounded-full mb-3">
            Stay Updated
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Join our newsletter
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Be the first to know about new collections, exclusive offers, and
            design inspiration.
          </p>

          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-full px-6 py-3 outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-white/50"
              required
            />
            <button
              type="submit"
              className="bg-white text-amber-800 px-6 py-3 rounded-r-full font-medium transition-colors hover:bg-white/90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#F9F7F5] border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div>
                <img
                  src={Logo}
                  alt="Vhinternational Logo"
                  width={200}
                  height={200}
                  className="mb-2"
                />

                <CardDescription className="mt-6 text-sm text-gray-600 leading-relaxed">
                  Asdullapur, Sultanpur Dost, Moradabad
                  <br />
                  244001, Uttar Pradesh
                </CardDescription>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-black/70 hover:text-amber-700 transition-colors"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-black/70 hover:text-amber-700 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/delivery"
                    className="text-black/70 hover:text-amber-700 transition-colors"
                  >
                    Delivery
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-black/70 hover:text-amber-700 transition-colors"
                  >
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Follow Us</h4>
              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/vhinternational2/"
                  className="block text-black/70 hover:text-amber-700 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="block text-black/70 hover:text-amber-700 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-amber-100 text-center md:text-center">
            <p className="text-black/50 text-sm">
              © {new Date().getFullYear()} VH International. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
