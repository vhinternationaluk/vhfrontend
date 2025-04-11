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
  // Lighting Category
  {
    id: "1",
    name: "Brass Cup and Tray",
    description: "Modern geometric pendant light with antique brass finish, perfect for dining rooms and entryways.",
    price: 12999,
    image: "/ProductImages/250.jpg",
    category: "lighting",
    featured: true,
    details: {
      specifications: [
        "18\" diameter x 24\" H",
        "Adjustable chain length",
        "E26 bulb socket",
        "Maximum 60W bulb",
        "Dimmable compatible"
      ],
      highlights: [
        "Geometric design",
        "Antique brass finish",
        "Easy installation",
        "Modern aesthetic"
      ],
      materials: [
        "Solid brass construction",
        "Hand-finished details",
        "Premium wiring components",
        "Steel mounting hardware"
      ]
    }
  },
  {
    id: "2",
    name: "Brass Table Lamp",
    description: "Contemporary table lamp with brushed brass base and linen shade.",
    price: 5999,
    image: "/ProductImages/127.jpg",
    category: "lighting",
    featured: false,
    details: {
      specifications: [
        "16\" shade diameter",
        "26\" total height",
        "E26 socket type",
        "3-way switch",
        "6ft cord length"
      ],
      highlights: [
        "Modern silhouette",
        "Warm ambient light",
        "Stable base design",
        "Versatile style"
      ],
      materials: [
        "Brushed brass base",
        "Natural linen shade",
        "Brass accents",
        "UL listed components"
      ]
    }
  },
  {
    id: "3",
    name: "Brass Floor Lamp",
    description: "Contemporary floor lamp with brass finish and adjustable head.",
    price: 7999,
    image: "/ProductImages/215.jpg",
    category: "lighting",
    featured: true,
    details: {
      specifications: [
        "72\" total height",
        "Adjustable head",
        "E26 socket type",
        "3-way switch",
        "8ft cord length"
      ],
      highlights: [
        "Modern design",
        "Adjustable lighting",
        "Stable base",
        "Versatile placement"
      ],
      materials: [
        "Brass finish",
        "Steel construction",
        "Premium wiring",
        "Weighted base"
      ]
    }
  },
  {
    id: "4",
    name: "Brass Wall Sconce",
    description: "Elegant wall sconce with articulating arm and antique brass finish.",
    price: 4599,
    image: "/ProductImages/221.jpg",
    category: "lighting",
    featured: false,
    details: {
      specifications: [
        "6\" backplate diameter",
        "20\" arm reach",
        "E12 socket type",
        "Hardwired installation",
        "Adjustable head"
      ],
      highlights: [
        "Adjustable design",
        "Vintage inspiration",
        "Easy installation",
        "UL listed"
      ],
      materials: [
        "Antique brass finish",
        "Steel construction",
        "Premium wiring",
        "Mounting hardware included"
      ]
    }
  },
  {
    id: "5",
    name: "Brass Tea Cups",
    description: "Modern tea cups with brass finish and frosted glass shade.",
    price: 8999,
    image: "/ProductImages/245.jpg",
    category: "lighting",
    featured: false,
    details: {
      specifications: [
        "16\" diameter",
        "E26 socket type",
        "Hardwired installation",
        "Dimmable compatible",
        "LED compatible"
      ],
      highlights: [
        "Modern design",
        "Soft diffused light",
        "Easy installation",
        "Energy efficient"
      ],
      materials: [
        "Brass finish",
        "Frosted glass",
        "Premium wiring",
        "Mounting hardware"
      ]
    }
  },
  {
    id: "6",
    name: "Brass Desk Lamp",
    description: "Modern desk lamp with brass finish and adjustable arm.",
    price: 4999,
    image: "/ProductImages/261.jpg",
    category: "lighting",
    featured: false,
    details: {
      specifications: [
        "18\" arm reach",
        "Adjustable head",
        "E26 socket type",
        "3-way switch",
        "6ft cord length"
      ],
      highlights: [
        "Adjustable design",
        "Modern aesthetic",
        "Stable base",
        "Task lighting"
      ],
      materials: [
        "Brass finish",
        "Steel construction",
        "Premium wiring",
        "Weighted base"
      ]
    }
  },

  // Furniture Category
  {
    id: "7",
    name: "Brass Bar Cart",
    description: "Luxurious two-tier bar cart with polished brass frame and tempered glass shelves.",
    price: 15999,
    image: "/ProductImages/277.jpg",
    category: "furniture",
    featured: true,
    details: {
      specifications: [
        "32\" W x 18\" D x 32\" H",
        "Two glass shelves",
        "Rolling casters",
        "75 lb capacity per shelf",
        "360° mobility"
      ],
      highlights: [
        "Art deco inspired",
        "Removable glass shelves",
        "Locking wheels",
        "Easy assembly"
      ],
      materials: [
        "Polished brass frame",
        "Tempered glass shelves",
        "Premium casters",
        "Protective floor pads"
      ]
    }
  },
  {
    id: "8",
    name: "Brass Coffee Table",
    description: "Modern coffee table with brass frame and tempered glass top.",
    price: 18999,
    image: "/ProductImages/287.jpg",
    category: "furniture",
    featured: true,
    details: {
      specifications: [
        "48\" L x 28\" W x 18\" H",
        "12mm glass thickness",
        "Geometric base design",
        "100 lb capacity",
        "Protective floor pads"
      ],
      highlights: [
        "Contemporary design",
        "Durable construction",
        "Easy assembly",
        "Striking presence"
      ],
      materials: [
        "Polished brass frame",
        "Tempered glass top",
        "Protective glass coating",
        "Non-scratch floor pads"
      ]
    }
  },
  {
    id: "9",
    name: "Brass Side Table",
    description: "Elegant side table with brass frame and marble top.",
    price: 12999,
    image: "/ProductImages/253.jpg",
    category: "furniture",
    featured: false,
    details: {
      specifications: [
        "20\" W x 20\" D x 24\" H",
        "Marble top",
        "Geometric base",
        "50 lb capacity",
        "Protective pads"
      ],
      highlights: [
        "Luxurious materials",
        "Stable construction",
        "Easy assembly",
        "Versatile use"
      ],
      materials: [
        "Brass frame",
        "Carrara marble top",
        "Protective coating",
        "Non-scratch pads"
      ]
    }
  },
  {
    id: "10",
    name: "Brass Console Table",
    description: "Elegant console table with brass frame and glass top.",
    price: 14999,
    image: "/ProductImages/221.jpg",
    category: "furniture",
    featured: true,
    details: {
      specifications: [
        "48\" W x 16\" D x 30\" H",
        "Tempered glass top",
        "Geometric base",
        "75 lb capacity",
        "Protective pads"
      ],
      highlights: [
        "Sleek design",
        "Durable construction",
        "Easy assembly",
        "Versatile placement"
      ],
      materials: [
        "Brass frame",
        "Tempered glass",
        "Protective coating",
        "Non-scratch pads"
      ]
    }
  },
  {
    id: "11",
    name: "Brass Dining Table",
    description: "Modern dining table with brass frame and marble top.",
    price: 24999,
    image: "/ProductImages/271.jpg",
    category: "furniture",
    featured: true,
    details: {
      specifications: [
        "72\" L x 36\" W x 30\" H",
        "Marble top",
        "Seats 6 people",
        "150 lb capacity",
        "Protective pads"
      ],
      highlights: [
        "Luxurious design",
        "Durable construction",
        "Easy assembly",
        "Statement piece"
      ],
      materials: [
        "Brass frame",
        "Carrara marble top",
        "Protective coating",
        "Non-scratch pads"
      ]
    }
  },
  {
    id: "12",
    name: "Brass Nightstand",
    description: "Modern nightstand with brass frame and marble top.",
    price: 8999,
    image: "/ProductImages/281.jpg",
    category: "furniture",
    featured: false,
    details: {
      specifications: [
        "18\" W x 16\" D x 24\" H",
        "Marble top",
        "Drawer storage",
        "30 lb capacity",
        "Protective pads"
      ],
      highlights: [
        "Compact design",
        "Storage space",
        "Easy assembly",
        "Versatile use"
      ],
      materials: [
        "Brass frame",
        "Marble top",
        "Wooden drawer",
        "Non-scratch pads"
      ]
    }
  },

  // Decor Category
  {
    id: "13",
    name: "Brass Wall Mirror",
    description: "Elegant round wall mirror with brushed brass frame and decorative detailing.",
    price: 8999,
    image: "/ProductImages/225.jpg",
    category: "decor",
    featured: true,
    details: {
      specifications: [
        "36\" diameter",
        "2\" frame depth",
        "15 lbs weight",
        "Beveled glass edge",
        "Secure wall mounting"
      ],
      highlights: [
        "Timeless design",
        "Versatile placement",
        "Premium glass quality",
        "Handcrafted frame"
      ],
      materials: [
        "Solid brass frame",
        "Premium mirror glass",
        "Protective backing",
        "Brass mounting hardware"
      ]
    }
  },
  {
    id: "14",
    name: "Brass Candle Holders",
    description: "Set of three geometric brass candle holders with varying heights.",
    price: 3999,
    image: "/ProductImages/251.jpg",
    category: "decor",
    featured: false,
    details: {
      specifications: [
        "4\", 6\", and 8\" heights",
        "3\" diameter base",
        "Fits standard tapers",
        "Set of three",
        "Protective felt base"
      ],
      highlights: [
        "Modern geometric design",
        "Varying heights",
        "Stable construction",
        "Gift-ready packaging"
      ],
      materials: [
        "Solid brass construction",
        "Protective coating",
        "Non-slip base",
        "Tarnish-resistant finish"
      ]
    }
  },
  {
    id: "15",
    name: "Brass Plant Stand",
    description: "Modern geometric plant stand with brass finish and multiple tiers.",
    price: 2999,
    image: "/ProductImages/291.jpg",
    category: "decor",
    featured: false,
    details: {
      specifications: [
        "12\" W x 12\" D x 24\" H",
        "Three tiers",
        "15 lb capacity per tier",
        "Indoor use",
        "Adjustable feet"
      ],
      highlights: [
        "Space-saving design",
        "Multiple display options",
        "Stable construction",
        "Easy assembly"
      ],
      materials: [
        "Brass-plated steel",
        "Protective coating",
        "Non-slip feet",
        "Rust-resistant finish"
      ]
    }
  },
  {
    id: "16",
    name: "Brass Wall Clock",
    description: "Modern wall clock with brass frame and minimalist design.",
    price: 3499,
    image: "/ProductImages/241.jpg",
    category: "decor",
    featured: false,
    details: {
      specifications: [
        "24\" diameter",
        "Quartz movement",
        "Silent operation",
        "Battery operated",
        "Easy installation"
      ],
      highlights: [
        "Minimalist design",
        "Silent operation",
        "Easy to read",
        "Modern aesthetic"
      ],
      materials: [
        "Brass frame",
        "Premium glass",
        "Quartz movement",
        "Battery included"
      ]
    }
  },
  {
    id: "17",
    name: "Brass Tea Sets",
    description: "Set of three brass picture frames with modern design.",
    price: 2499,
    image: "/ProductImages/283.jpg",
    category: "decor",
    featured: false,
    details: {
      specifications: [
        "8\" x 10\", 5\" x 7\", 4\" x 6\"",
        "Set of three",
        "Standing or hanging",
        "Easy to use",
        "Protective backing"
      ],
      highlights: [
        "Modern design",
        "Multiple sizes",
        "Versatile display",
        "Gift-ready"
      ],
      materials: [
        "Brass finish",
        "Premium glass",
        "Protective backing",
        "Stand included"
      ]
    }
  },
  {
    id: "18",
    name: "Brass Bookends",
    description: "Set of brass bookends with geometric design.",
    price: 1999,
    image: "/ProductImages/301.jpg",
    category: "decor",
    featured: false,
    details: {
      specifications: [
        "6\" H x 4\" W",
        "Set of two",
        "Weighted base",
        "Non-slip bottom",
        "Easy to use"
      ],
      highlights: [
        "Modern design",
        "Stable construction",
        "Versatile use",
        "Gift-ready"
      ],
      materials: [
        "Solid brass",
        "Weighted base",
        "Protective coating",
        "Non-slip pads"
      ]
    }
  },

  // Accessories Category
  {
    id: "19",
    name: "Brass Key Holder",
    description: "Modern key holder with brass finish and hooks.",
    price: 1499,
    image: "/ProductImages/295.jpg",
    category: "accessories",
    featured: false,
    details: {
      specifications: [
        "12\" W x 6\" H",
        "6 hooks",
        "Wall mounted",
        "Easy installation",
        "Protective backing"
      ],
      highlights: [
        "Modern design",
        "Multiple hooks",
        "Easy installation",
        "Organized storage"
      ],
      materials: [
        "Brass finish",
        "Steel hooks",
        "Protective backing",
        "Mounting hardware"
      ]
    }
  },
  {
    id: "20",
    name: "Brass Coat Rack",
    description: "Modern coat rack with brass finish and hooks.",
    price: 2999,
    image: "/ProductImages/299.jpg",
    category: "accessories",
    featured: false,
    details: {
      specifications: [
        "24\" W x 6\" D x 48\" H",
        "6 hooks",
        "Wall mounted",
        "Easy installation",
        "Protective backing"
      ],
      highlights: [
        "Modern design",
        "Multiple hooks",
        "Easy installation",
        "Organized storage"
      ],
      materials: [
        "Brass finish",
        "Steel hooks",
        "Protective backing",
        "Mounting hardware"
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
