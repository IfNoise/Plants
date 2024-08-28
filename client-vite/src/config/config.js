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
      { element: "NO3", coef: 0.23,ion:"NO3-",charge:-1,mmass:62},
      { element: "NH3", coef: 0.19 ,ion:"NH4+",charge:1,mmass:18},
      { element: "N", coef: 1.0 ,mmass:14},
    ],
  },
  {
    id: 2,
    code: "P",
    name: "Phosphorus",
    description: "Phosphorus is a key nutrient for plant growth",
    content: [
      { element: "P2O5", coef: 0.436,ion:"PO4",charge:-3,mmass:95 },
      { element: "PO4", coef: 0.375,ion:"PO4",charge:-3,mmass:95 },
      { element: "P", coef: 1.0,mmass:31 },
    ],
  },
  {
    id: 3,
    code: "K",
    name: "Potassium",
    description: "Potassium is a key nutrient for plant growth",
    content: [
      { element: "K2O", coef: 0.83,ion:"K+",charge:1,mmass:39 },
      { element: "K", coef: 1.0,mmass:39 },
    ],
  },
  {
    id: 5,
    code: "Ca",
    name: "Calcium",
    description: "Calcium is a key nutrient for plant growth",
    content: [
      { element: "CaO", coef: 0.715,ion:"Ca++",charge:2,mmass:40 },
      { element: "Ca", coef: 1.0,mmass:40 },
    ],
  },
  {
    id: 4,
    code: "Mg",
    name: "Magnesium",
    description: "Magnesium is a key nutrient for plant growth",
    content: [
      { element: "MgO", coef: 0.603,ion:"Mg++",charge:2,mmass:24 },
      { element: "Mg", coef: 1.0,ion:"Mg++",charge:2,mmass:24 },
      { element: "Mg", coef: 1.0,chelate:true,mmass:24 },
    ],
  },
  {
    id: 6,
    code: "S",
    name: "Sulfur",
    description: "Sulfur is a key nutrient for plant growth",
    content: [
      { element: "SO4", coef: 0.33,ion:"SO4--",charge:-2,mmass:96 },
      { element: "S", coef: 1.0,mmass:32 },
    ],
  },
  {
    id: 7,
    code: "Fe",
    name: "Iron",
    description: "Iron is a key nutrient for plant growth",
    content: [
      { element: "FeO", coef: 0.56,ion:"Fe++",charge:2,mmass:56 },
      { element: "Fe", coef: 1 ,chelate:true}],
  },
  {
    id: 11,
    name: "Manganese",
    description: "Manganese is a key nutrient for plant growth",
    content: [{ element: "Mn", coef: 1,mmass:55,chelate:true }],
  },
  {
    id: 9,
    code: "Zn",
    name: "Zinc",
    description: "Zinc is a key nutrient for plant growth",
    content: [{ element: "Zn", coef: 1.0,mmass:65,chelate:true }],
  },
  {
    id: 8,
    code: "Cu",
    name: "Copper",
    description: "Copper is a key nutrient for plant growth",
    content: [
      { element: "CuO", coef: 0.5,ion:"Cu++",charge:2,mmass:64 },
      { element: "Cu", coef: 1.0,mmass:64,chelate:true }],
  },
  {
    id: 10,
    code: "B",
    name: "Boron",
    description: "Boron is a key nutrient for plant growth",
    content: [{ element: "B", coef: 1.0,mmass:11,chelate:true }],
  },
  {
    id: 12,
    code: "Mo",
    name: "Molybdenum",
    description: "Molybdenum is a key nutrient for plant growth",
    content: [{ element: "Mo", coef: 1.0,mmass:96,chelate:true }],
  },
];


