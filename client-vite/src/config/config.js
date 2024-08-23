export const baseUrl = "https://ddweed.org";
export const printerUrl = "https://ddweed.org";
export const buildRooms = 
  {
    Hangar1: ["Main room", "Laboratory"],
    Hangar2: ["Main room", "Small Room"],
    Outdoor: ["Backyard"],
  };
export const pots = ["0,25 L", "1 L", "4 L", "7 L", "Slab"];

export const elements = [
  {
    code: "N",
    id: 1,
    name: "Nitrogen",
    description: "Nitrogen is a key nutrient for plant growth",
    content: [
      { element: "NO3", coef: 0.23 },
      { element: "NH3", coef: 0.19 },
      { element: "N", coef: 1.0 },
    ],
  },
  {
    id: 2,
    code: "P",
    name: "Phosphorus",
    description: "Phosphorus is a key nutrient for plant growth",
    content: [
      { element: "P2O5", coef: 0.436 },
      { element: "PO4", coef: 0.375 },
      { element: "P", coef: 1.0 },
    ],
  },
  {
    id: 3,
    code: "K",
    name: "Potassium",
    description: "Potassium is a key nutrient for plant growth",
    content: [
      { element: "K2O", coef: 0.83 },
      { element: "K", coef: 1.0 },
    ],
  },
  {
    id: 5,
    code: "Ca",
    name: "Calcium",
    description: "Calcium is a key nutrient for plant growth",
    content: [
      { element: "CaO", coef: 0.715 },
      { element: "Ca", coef: 1.0 },
    ],
  },
  {
    id: 4,
    code: "Mg",
    name: "Magnesium",
    description: "Magnesium is a key nutrient for plant growth",
    content: [
      { element: "MgO", coef: 0.603 },
      { element: "Mg", coef: 1.0 },
    ],
  },
  {
    id: 6,
    code: "S",
    name: "Sulfur",
    description: "Sulfur is a key nutrient for plant growth",
    content: [
      { element: "SO4", coef: 0.33 },
      { element: "S", coef: 1.0 },
    ],
  },
  {
    id: 7,
    code: "Fe",
    name: "Iron",
    description: "Iron is a key nutrient for plant growth",
    content: [{ element: "Fe", coef: 0.5 }],
  },
  {
    id: 11,
    name: "Manganese",
    description: "Manganese is a key nutrient for plant growth",
    content: [{ element: "Mn", coef: 0.5 }],
  },
  {
    id: 9,
    code: "Zn",
    name: "Zinc",
    description: "Zinc is a key nutrient for plant growth",
    content: [{ element: "Zn", coef: 1.0 }],
  },
  {
    id: 8,
    code: "Cu",
    name: "Copper",
    description: "Copper is a key nutrient for plant growth",
    content: [{ element: "Cu", coef: 1.0 }],
  },
  {
    id: 10,
    code: "B",
    name: "Boron",
    description: "Boron is a key nutrient for plant growth",
    content: [{ element: "B", coef: 1.0 }],
  },
  {
    id: 12,
    code: "Mo",
    name: "Molybdenum",
    description: "Molybdenum is a key nutrient for plant growth",
    content: [{ element: "Mo", coef: 1.0 }],
  },
];


