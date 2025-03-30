export interface Item {
    id: string;
    name: string;
    category: string;
    color?: string;
    // Add any other properties your items have
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  secondaryColor?: string;
  season: string[];
  occasion: string[];
  imageUrl: string;
  timesWorn: number;
  cost?: number;
}