export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  secondaryColor?: string; // Add this line
  season: string[];
  occasion: string[];
  imageUrl: string;
  timesWorn: number;
  cost?: number;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  date?: string;
  occasion?: string;
}