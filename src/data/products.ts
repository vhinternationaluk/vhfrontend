export interface Product {
  id: string;
  name: string;
  description: string;
  cost: number;
  discount: number;
  img_url: string;
  product_category: string;
  quantity: number;
  is_active: boolean;

  featured?: boolean;
  details?: {
    specifications: string[];
    highlights: string[];
    materials: string[];
  };

  price?: number;
  image?: string;
  category?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Brass Cup and Tray",
    description:
      "Modern geometric pendant light with antique brass finish, perfect for dining rooms and entryways.",
    cost: 12999,
    discount: 0,
    img_url: "/ProductImages/250.jpg",
    product_category: "lighting",
    quantity: 10,
    is_active: true,
    featured: true,
    details: {
      specifications: [
        '18" diameter x 24" H',
        "Adjustable chain length",
        "E26 bulb socket",
        "Maximum 60W bulb",
        "Dimmable compatible",
      ],
      highlights: [
        "Geometric design",
        "Antique brass finish",
        "Easy installation",
        "Modern aesthetic",
      ],
      materials: [
        "Solid brass construction",
        "Hand-finished details",
        "Premium wiring components",
        "Steel mounting hardware",
      ],
    },
  },
  {
    id: "2",
    name: "Brass Table Lamp",
    description:
      "Contemporary table lamp with brushed brass base and linen shade.",
    cost: 5999,
    discount: 10,
    img_url: "/ProductImages/127.jpg",
    product_category: "lighting",
    quantity: 5,
    is_active: true,
    featured: false,
    details: {
      specifications: [
        '16" shade diameter',
        '26" total height',
        "E26 socket type",
        "3-way switch",
        "6ft cord length",
      ],
      highlights: [
        "Modern silhouette",
        "Warm ambient light",
        "Stable base design",
        "Versatile style",
      ],
      materials: [
        "Brushed brass base",
        "Natural linen shade",
        "Brass accents",
        "UL listed components",
      ],
    },
  },
  {
    id: "3",
    name: "Brass Floor Lamp",
    description:
      "Contemporary floor lamp with brass finish and adjustable head.",
    cost: 7999,
    discount: 15,
    img_url: "/ProductImages/215.jpg",
    product_category: "lighting",
    quantity: 8,
    is_active: true,
    featured: true,
    details: {
      specifications: [
        '72" total height',
        "Adjustable head",
        "E26 socket type",
        "3-way switch",
        "8ft cord length",
      ],
      highlights: [
        "Modern design",
        "Adjustable lighting",
        "Stable base",
        "Versatile placement",
      ],
      materials: [
        "Brass finish",
        "Steel construction",
        "Premium wiring",
        "Weighted base",
      ],
    },
  },
  {
    id: "4",
    name: "Brass Wall Sconce",
    description:
      "Elegant wall sconce with articulating arm and antique brass finish.",
    cost: 4599,
    discount: 5,
    img_url: "/ProductImages/221.jpg",
    product_category: "lighting",
    quantity: 12,
    is_active: true,
    featured: false,
    details: {
      specifications: [
        '6" backplate diameter',
        '20" arm reach',
        "E12 socket type",
        "Hardwired installation",
        "Adjustable head",
      ],
      highlights: [
        "Adjustable design",
        "Vintage inspiration",
        "Easy installation",
        "UL listed",
      ],
      materials: [
        "Antique brass finish",
        "Steel construction",
        "Premium wiring",
        "Mounting hardware included",
      ],
    },
  },
  {
    id: "5",
    name: "Brass Tea Cups",
    description: "Modern tea cups with brass finish and frosted glass shade.",
    cost: 8999,
    discount: 0,
    img_url: "/ProductImages/245.jpg",
    product_category: "lighting",
    quantity: 6,
    is_active: true,
    featured: false,
    details: {
      specifications: [
        '16" diameter',
        "E26 socket type",
        "Hardwired installation",
        "Dimmable compatible",
        "LED compatible",
      ],
      highlights: [
        "Modern design",
        "Soft diffused light",
        "Easy installation",
        "Energy efficient",
      ],
      materials: [
        "Brass finish",
        "Frosted glass",
        "Premium wiring",
        "Mounting hardware",
      ],
    },
  },
  {
    id: "6",
    name: "Brass Desk Lamp",
    description: "Modern desk lamp with brass finish and adjustable arm.",
    cost: 4999,
    discount: 8,
    img_url: "/ProductImages/261.jpg",
    product_category: "lighting",
    quantity: 15,
    is_active: true,
    featured: false,
    details: {
      specifications: [
        '18" arm reach',
        "Adjustable head",
        "E26 socket type",
        "3-way switch",
        "6ft cord length",
      ],
      highlights: [
        "Adjustable design",
        "Modern aesthetic",
        "Stable base",
        "Task lighting",
      ],
      materials: [
        "Brass finish",
        "Steel construction",
        "Premium wiring",
        "Weighted base",
      ],
    },
  },

  {
    id: "7",
    name: "Brass Bar Cart",
    description:
      "Luxurious two-tier bar cart with polished brass frame and tempered glass shelves.",
    cost: 15999,
    discount: 20,
    img_url: "/ProductImages/277.jpg",
    product_category: "furniture",
    quantity: 3,
    is_active: true,
    featured: true,
    details: {
      specifications: [
        '32" W x 18" D x 32" H',
        "Two glass shelves",
        "Rolling casters",
        "75 lb capacity per shelf",
        "360° mobility",
      ],
      highlights: [
        "Art deco inspired",
        "Removable glass shelves",
        "Locking wheels",
        "Easy assembly",
      ],
      materials: [
        "Polished brass frame",
        "Tempered glass shelves",
        "Premium casters",
        "Protective floor pads",
      ],
    },
  },
  {
    id: "8",
    name: "Brass Coffee Table",
    description: "Modern coffee table with brass frame and tempered glass top.",
    cost: 18999,
    discount: 0,
    img_url: "/ProductImages/287.jpg",
    product_category: "furniture",
    quantity: 4,
    is_active: true,
    featured: true,
    details: {
      specifications: [
        '48" L x 28" W x 18" H',
        "12mm glass thickness",
        "Geometric base design",
        "100 lb capacity",
        "Protective floor pads",
      ],
      highlights: [
        "Contemporary design",
        "Durable construction",
        "Easy assembly",
        "Striking presence",
      ],
      materials: [
        "Polished brass frame",
        "Tempered glass top",
        "Protective glass coating",
        "Non-scratch floor pads",
      ],
    },
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getProducts = (): Product[] => {
  return products;
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.product_category === category);
};
