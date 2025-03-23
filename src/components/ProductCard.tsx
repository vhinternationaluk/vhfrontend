
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card flex flex-col rounded-xl overflow-hidden animate-fade-in bg-white"
      style={{ 
        animationDelay: `${100 * index}ms`,
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`product-image w-full h-full object-cover ${imageLoaded ? 'image-loaded' : 'image-loading'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <span className="text-xs uppercase tracking-wider text-black/50 mb-2">
          {product.category}
        </span>
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <p className="text-sm text-black/70 mb-4 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-medium">${product.price}</span>
          <span className="text-sm font-medium inline-flex items-center text-black/70 group-hover:text-black transition-colors">
            Details <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
