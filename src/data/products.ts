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
    name: "Modern Leather Sofa",
    description: "Elegant three-seater leather sofa with sleek design and exceptional comfort for your living room.",
    price: 40000,
    image: "https://images.unsplash.com/photo-1643717714673-830d9cb8ea26?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "sofas",
    featured: true,
    details: {
      specifications: [
        "84\" W x 38\" D x 34\" H",
        "Full-grain leather",
        "Kiln-dried hardwood frame",
        "Down-filled cushions",
        "Sinuous spring suspension"
      ],
      highlights: [
        "Hand-stitched details",
        "Removable cushion covers",
        "Corner-blocked joinery",
        "5-year warranty"
      ],
      materials: [
        "Full-grain Italian leather",
        "Solid oak legs",
        "High-density foam core",
        "Hypoallergenic down alternative"
      ]
    }
  },
  {
    id: "2",
    name: "Scandinavian Dining Table",
    description: "Minimalist solid oak dining table with clean lines and versatile design that seats up to six people.",
    price: 8999,
    image: "https://cdn-bnokp.nitrocdn.com/QNoeDwCprhACHQcnEmHgXDhDpbEOlRHH/assets/images/optimized/rev-c7971c9/www.decorilla.com/online-decorating/wp-content/uploads/2023/06/Scandinavian-dining-room-with-light-wood-tones.jpg",
    category: "dining",
    featured: true,
    details: {
      specifications: [
        "72\" L x 36\" W x 30\" H",
        "Solid oak construction",
        "Seats 6 people",
        "Self-leveling floor glides",
        "Rectangular shape"
      ],
      highlights: [
        "FSC-certified wood",
        "Hand-finished surfaces",
        "Easy assembly",
        "Stain-resistant finish"
      ],
      materials: [
        "Solid oak wood",
        "Water-based finishes",
        "Brass hardware accents",
        "Steel reinforcements"
      ]
    }
  },
  {
    id: "3",
    name: "Mid-Century Accent Chair",
    description: "Statement lounge chair with iconic mid-century design and premium upholstery for superior comfort.",
    price: 6499,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "chairs",
    featured: false,
    details: {
      specifications: [
        "30\" W x 34\" D x 32\" H",
        "19\" seat height",
        "Molded plywood frame",
        "360° swivel base",
        "High-resilience foam"
      ],
      highlights: [
        "Ergonomic design",
        "Iconic silhouette",
        "Button-tufted back",
        "Includes accent pillow"
      ],
      materials: [
        "Performance velvet upholstery",
        "Walnut veneer shell",
        "Die-cast aluminum base",
        "Silicon bronze glides"
      ]
    }
  },
  {
    id: "4",
    name: "King Size Platform Bed",
    description: "Contemporary platform bed with integrated nightstands and hidden storage for modern bedrooms.",
    price: 14999,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "bedroom",
    featured: true,
    details: {
      specifications: [
        "King size: 80\" W x 84\" L",
        "12\" platform height",
        "Integrated LED lighting",
        "Floating design",
        "4 storage drawers"
      ],
      highlights: [
        "No box spring needed",
        "Integrated USB charging",
        "Headboard with shelving",
        "Easy assembly"
      ],
      materials: [
        "Engineered wood frame",
        "Walnut veneer finish",
        "Metal support system",
        "Felt-lined drawers"
      ]
    }
  },
  {
    id: "5",
    name: "Minimalist Coffee Table",
    description: "Geometric coffee table with tempered glass top and sculptural base for a statement living room centerpiece.",
    price: 4599,
    image: "https://chetakfurniture.co/wp-content/uploads/2024/01/813Ifmym7ZL._SX569_.jpg",
    category: "tables",
    featured: false,
    details: {
      specifications: [
        "48\" L x 24\" W x 18\" H",
        "10mm tempered glass top",
        "Open storage shelf",
        "Geometric base design",
        "20kg weight capacity"
      ],
      highlights: [
        "Nesting design",
        "Scratch-resistant surface",
        "Anti-tip stabilizers",
        "Modern silhouette"
      ],
      materials: [
        "Tempered glass",
        "Powder-coated steel frame",
        "Solid ash wood accents",
        "Brass-finish details"
      ]
    }
  },
  {
    id: "6",
    name: "Handwoven Storage Ottoman",
    description: "Versatile storage ottoman with natural handwoven exterior that functions as seating, storage, and occasional table.",
    price: 32999,
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "storage",
    featured: false,
    details: {
      specifications: [
        "24\" diameter x 18\" H",
        "150lb weight capacity",
        "Hinged lid",
        "Interior storage",
        "Lightweight design"
      ],
      highlights: [
        "Multifunctional piece",
        "Handwoven exterior",
        "Child-safe hinges",
        "Portable design"
      ],
      materials: [
        "Handwoven water hyacinth",
        "Engineered wood frame",
        "Cotton canvas lining",
        "Foam-padded top"
      ]
    }
  },
  {
    id: "7",
    name: "Artisanal Bookshelf",
    description: "Handcrafted bookshelf featuring open shelving design and natural wood with black metal accents.",
    price: 8999,
    image: "https://i.etsystatic.com/10146012/r/il/d2f52c/2305892882/il_570xN.2305892882_ez5y.jpg",
    category: "storage",
    featured: true,
    details: {
      specifications: [
        "36\" W x 16\" D x 72\" H",
        "5 adjustable shelves",
        "Wall anchoring system",
        "80kg per shelf capacity",
        "Open-back design"
      ],
      highlights: [
        "Modular configuration",
        "Artisanal craftsmanship",
        "Adjustable leveling feet",
        "Sustainably sourced wood"
      ],
      materials: [
        "Solid acacia wood",
        "Powder-coated steel frame",
        "Brass shelf supports",
        "Non-toxic finishes"
      ]
    }
  },
  {
    id: "8",
    name: "Velvet Lounge Chair",
    description: "Luxurious velvet lounge chair with elegant curved design and gold-finish metal base.",
    price: 7499,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "chairs",
    featured: true,
    details: {
      specifications: [
        "33\" W x 35\" D x 32\" H",
        "18\" seat height",
        "Channel tufting",
        "Swivel base",
        "Contoured backrest"
      ],
      highlights: [
        "Plush comfort",
        "Statement silhouette",
        "Stain-resistant velvet",
        "Premium construction"
      ],
      materials: [
        "Premium velvet upholstery",
        "Gold-finish stainless steel",
        "High-density foam cushioning",
        "Reinforced hardwood frame"
      ]
    }
  },
  {
    id: "9",
    name: "Marble Dining Table",
    description: "Elegant round dining table with genuine marble top and sophisticated brass finish base.",
    price: 18999,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "dining",
    featured: false,
    details: {
      specifications: [
        "60\" diameter x 30\" H",
        "Genuine marble top",
        "Seats 6 people",
        "Pedestal base",
        "15mm marble thickness"
      ],
      highlights: [
        "Natural stone variation",
        "Hand-polished surface",
        "Protected with sealant",
        "Heirloom quality piece"
      ],
      materials: [
        "Italian Carrara marble",
        "Brass-finished steel base",
        "Protective floor pads",
        "Water-resistant sealant"
      ]
    }
  },
  {
    id: "10",
    name: "Rattan Accent Chair",
    description: "Natural rattan accent chair with organic form and comfortable cushion for a touch of bohemian style.",
    price: 15499,
    image: "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "chairs",
    featured: false,
    details: {
      specifications: [
        "32\" W x 33\" D x 34\" H",
        "18\" seat height",
        "Handwoven frame",
        "Removable cushion",
        "Indoor use only"
      ],
      highlights: [
        "Artisan crafted",
        "Lightweight design",
        "Ergonomic form",
        "Natural material variation"
      ],
      materials: [
        "Natural rattan",
        "Sustainable hardwood frame",
        "Cotton cushion cover",
        "High-resilience foam filling"
      ]
    }
  },
  {
    id: "11",
    name: "Scandinavian Desk",
    description: "Minimalist work desk with sleek lines and built-in storage for an organized home office.",
    price: 17499,
    image: "https://png.pngtree.com/background/20230827/original/pngtree-d-rendering-of-a-cozy-scandinavian-office-with-wood-table-and-picture-image_4838900.jpg",
    category: "office",
    featured: false,
    details: {
      specifications: [
        "52\" W x 26\" D x 30\" H",
        "2 storage drawers",
        "Cable management system",
        "Angled legs",
        "Writing surface"
      ],
      highlights: [
        "Clean aesthetic",
        "Hidden storage",
        "Solid construction",
        "Multifunctional use"
      ],
      materials: [
        "Solid white oak",
        "Lacquered finish",
        "Metal drawer glides",
        "Bronze hardware"
      ]
    }
  },
  {
    id: "12",
    name: "Media Console",
    description: "Contemporary media console with sliding doors and integrated speaker fabric for a sleek entertainment setup.",
    price: 9999,
    image: "https://t3.ftcdn.net/jpg/03/76/17/64/360_F_376176417_aOQx7Ppibwj5UD9lJjyyPhYIfNIa41SU.jpg",
    category: "storage",
    featured: true,
    details: {
      specifications: [
        "68\" W x 18\" D x 24\" H",
        "Sliding cabinet doors",
        "Acoustic speaker fabric",
        "Wire management",
        "Adjustable shelving"
      ],
      highlights: [
        "Floating design",
        "Remote control access",
        "Ventilated back panel",
        "Wall-mounting option"
      ],
      materials: [
        "Walnut veneer",
        "Acoustic fabric panels",
        "Soft-closing hardware",
        "Metal legs with levelers"
      ]
    }
  },
  {
    id: "13",
    name: "Linen Loveseat",
    description: "Compact two-seater sofa upholstered in natural linen with tapered wooden legs for small spaces.",
    price: 8999,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "sofas",
    featured: false,
    details: {
      specifications: [
        "62\" W x 34\" D x 35\" H",
        "Two-seater design",
        "Removable seat cushions",
        "8-way hand-tied springs",
        "Kiln-dried frame"
      ],
      highlights: [
        "Apartment-friendly scale",
        "Stain-resistant fabric",
        "Plush comfort",
        "Classic silhouette"
      ],
      materials: [
        "Belgian linen upholstery",
        "Solid beech wood legs",
        "High-density foam",
        "No-sag spring system"
      ]
    }
  },
  {
    id: "14",
    name: "Queen Upholstered Bed",
    description: "Contemporary upholstered bed with channel-tufted headboard and wingback design for elegant bedrooms.",
    price: 12999,
    image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?q=80&w=2149&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "bedroom",
    featured: false,
    details: {
      specifications: [
        "Queen size: 63\" W x 86\" L",
        "64\" headboard height",
        "Channel tufting",
        "Wingback design",
        "Center support leg"
      ],
      highlights: [
        "Statement headboard",
        "No box spring needed",
        "Noise-reducing construction",
        "Easy assembly"
      ],
      materials: [
        "Performance velvet upholstery",
        "Solid pine slats",
        "Engineered wood frame",
        "Metal leg supports"
      ]
    }
  },
  {
    id: "15",
    name: "Canopy Bed Frame",
    description: "Dramatic four-poster canopy bed with architectural frame and minimalist design for a statement bedroom.",
    price: 15999,
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "bedroom",
    featured: true,
    details: {
      specifications: [
        "King size available",
        "82\" height to canopy",
        "Four-poster design",
        "12\" under-bed clearance",
        "Slat support system"
      ],
      highlights: [
        "Architectural silhouette",
        "No box spring required",
        "Customizable fabric canopy",
        "Minimal assembly"
      ],
      materials: [
        "Powder-coated steel frame",
        "Solid oak legs",
        "Steel support slats",
        "Non-toxic finish"
      ]
    }
  },
  {
    id: "16",
    name: "Round Nesting Tables",
    description: "Set of three nesting tables with marble tops and brass-finish bases for versatile living room use.",
    price: 5999,
    image: "https://m.media-amazon.com/images/I/81oOCWXdUTL.jpg",
    category: "tables",
    featured: false,
    details: {
      specifications: [
        "Large: 24\" dia. x 22\" H",
        "Medium: 20\" dia. x 18\" H",
        "Small: 16\" dia. x 16\" H",
        "Nesting design",
        "Protective floor glides"
      ],
      highlights: [
        "Space-saving design",
        "Multifunctional use",
        "Natural stone variation",
        "Lightweight mobility"
      ],
      materials: [
        "Genuine marble tops",
        "Brass-finished steel bases",
        "Protective felt bottom",
        "Sealed stone surfaces"
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


export const getProducts = (): Product[] => {
  return products;
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
