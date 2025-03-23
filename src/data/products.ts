
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
    price: 1299,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
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
    price: 899,
    image: "https://images.unsplash.com/photo-1617098474202-0d0d7f3fb0d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
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
    price: 649,
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
    price: 1499,
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
    price: 459,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
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
    price: 329,
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
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};
