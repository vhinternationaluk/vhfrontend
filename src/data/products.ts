
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  details: {
    specifications: string[];
    highlights: string[];
    materials: string[];
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Minimalist Watch",
    description: "Elegantly designed timepiece with premium materials and exceptional craftsmanship.",
    price: 299,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    category: "accessories",
    featured: true,
    details: {
      specifications: [
        "Swiss movement",
        "42mm case diameter",
        "Sapphire crystal",
        "100m water resistance",
        "Italian leather strap"
      ],
      highlights: [
        "Hand-finished case",
        "Super-LumiNova indices",
        "Exhibition caseback",
        "5-year warranty"
      ],
      materials: [
        "316L stainless steel",
        "Calfskin leather",
        "Sapphire crystal"
      ]
    }
  },
  {
    id: "2",
    name: "Wireless Earbuds",
    description: "Immersive sound experience with noise cancellation and extended battery life.",
    price: 179,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80",
    category: "electronics",
    featured: true,
    details: {
      specifications: [
        "Active noise cancellation",
        "8-hour battery life",
        "24-hour with charging case",
        "IPX4 water resistance",
        "Touch controls"
      ],
      highlights: [
        "Adaptive EQ",
        "Transparency mode",
        "Spatial audio",
        "Voice assistant compatible"
      ],
      materials: [
        "High-grade plastic",
        "Silicone ear tips",
        "Aluminum accents"
      ]
    }
  },
  {
    id: "3",
    name: "Leather Backpack",
    description: "Functional and stylish backpack crafted with premium leather for everyday use.",
    price: 249,
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    category: "bags",
    featured: false,
    details: {
      specifications: [
        "Full-grain leather",
        "15\" laptop compartment",
        "Multiple internal pockets",
        "Water-resistant",
        "Magnetic closures"
      ],
      highlights: [
        "Hand-stitched details",
        "Breathable back panel",
        "Adjustable straps",
        "Lifetime warranty"
      ],
      materials: [
        "Full-grain leather",
        "YKK zippers",
        "Cotton canvas lining"
      ]
    }
  },
  {
    id: "4",
    name: "Smart Speaker",
    description: "Voice-controlled speaker with exceptional sound quality and smart home integration.",
    price: 129,
    image: "https://images.unsplash.com/photo-1589003511523-86b1f9207058?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "electronics",
    featured: true,
    details: {
      specifications: [
        "360° sound",
        "Far-field microphones",
        "Wi-Fi and Bluetooth",
        "Multi-room audio",
        "Voice assistant"
      ],
      highlights: [
        "Adaptive sound",
        "Privacy controls",
        "Smart home hub",
        "Automatic updates"
      ],
      materials: [
        "Acoustic fabric",
        "Recycled plastic",
        "Silicone base"
      ]
    }
  },
  {
    id: "5",
    name: "Ceramic Mug Set",
    description: "Artisanal ceramic mugs with minimalist design, perfect for your morning ritual.",
    price: 59,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "home",
    featured: false,
    details: {
      specifications: [
        "12 oz capacity",
        "Microwave safe",
        "Dishwasher safe",
        "Set of 4",
        "Matching saucers"
      ],
      highlights: [
        "Hand-thrown ceramics",
        "Lead-free glaze",
        "Unique variations",
        "Stackable design"
      ],
      materials: [
        "Stoneware clay",
        "Non-toxic glaze",
        "Natural pigments"
      ]
    }
  },
  {
    id: "6",
    name: "Portable Power Bank",
    description: "Sleek, high-capacity power bank for on-the-go charging of all your devices.",
    price: 89,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    category: "electronics",
    featured: false,
    details: {
      specifications: [
        "20,000 mAh capacity",
        "Dual USB-C ports",
        "Fast charging",
        "Power delivery",
        "LED indicator"
      ],
      highlights: [
        "Aluminum body",
        "Travel-friendly",
        "Charge multiple devices",
        "Pass-through charging"
      ],
      materials: [
        "Anodized aluminum",
        "Li-ion battery",
        "Tempered glass"
      ]
    }
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};
