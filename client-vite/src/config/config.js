export const baseUrl = "https://ddweed.org";
export const printerUrl = "https://ddweed.org";
export const buildRooms = {
  Hangar1: ["Main room", "Laboratory"],
  Hangar2: ["Main room", "Small room"],
  Outdoor: ["Backyard"],
  Expo: ["Expohall"],
};
export const pots = ["0,25 L", "1 L", "4 L", "7 L", "Slab"];

export const elements = [
  {
    code: "N",
    id: 1,
    name: "Nitrogen",
    description: "Nitrogen is a key nutrient for plant growth",
    forms: [
      { name: "NO3", mmass: 62 },
      { name: "NH4", mmass: 18 },
      { name: "N", mmass: 14 },
    ],
  },
  {
    id: 2,
    code: "P",
    name: "Phosphorus",
    description: "Phosphorus is a key nutrient for plant growth",
    forms: [
      { name: "P2O5", mmass: 95 },
      { name: "PO4", mmass: 95 },
      { name: "P", mmass: 31 },
    ],
  },
  {
    id: 3,
    code: "K",
    name: "Potassium",
    description: "Potassium is a key nutrient for plant growth",
    forms: [
      { name: "K2O", mmass: 39 },
      { name: "K", mmass: 39 },
    ],
  },
  {
    id: 5,
    code: "Ca",
    name: "Calcium",
    description: "Calcium is a key nutrient for plant growth",
    forms: [
      { name: "CaO", mmass: 40 },
      { name: "Ca", mmass: 40 },
    ],
  },
  {
    id: 4,
    code: "Mg",
    name: "Magnesium",
    description: "Magnesium is a key nutrient for plant growth",
    forms: [
      { name: "MgO", mmass: 24 },
      { name: "Mg", mmass: 24 },
      { name: "Mg", mmass: 24, chelate: true },
    ],
  },
  {
    id: 6,
    code: "S",
    name: "Sulfur",
    description: "Sulfur is a key nutrient for plant growth",
    forms: [
      { name: "SO4", mmass: 96 },
      { name: "S", mmass: 32 },
    ],
  },
  {
    id: 7,
    code: "Fe",
    name: "Iron",
    description: "Iron is a key nutrient for plant growth",
    forms: [
      { name: "FeO", mmass: 56 },
      { name: "Fe", chelate: true },
    ],
  },
  {
    id: 11,
    name: "Manganese",
    description: "Manganese is a key nutrient for plant growth",
    forms: [{ name: "Mn", mmass: 55, chelate: true }],
  },
  {
    id: 9,
    code: "Zn",
    name: "Zinc",
    description: "Zinc is a key nutrient for plant growth",
    forms: [{ name: "Zn", mmass: 65, chelate: true }],
  },
  {
    id: 8,
    code: "Cu",
    name: "Copper",
    description: "Copper is a key nutrient for plant growth",
    forms: [
      { name: "CuO", mmass: 64 },
      { name: "Cu", mmass: 64, chelate: true },
    ],
  },
  {
    id: 10,
    code: "B",
    name: "Boron",
    description: "Boron is a key nutrient for plant growth",
    forms: [{ name: "B", mmass: 11, chelate: true }],
  },
  {
    id: 12,
    code: "Mo",
    name: "Molybdenum",
    description: "Molybdenum is a key nutrient for plant growth",
    forms: [{ name: "Mo", mmass: 96, chelate: true }],
  },
];
