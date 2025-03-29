import { create } from 'zustand';
import { ClothingItem } from '../types';

interface ClosetState {
  items: ClothingItem[];
  addItem: (item: Omit<ClothingItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
}

export const useClosetStore = create<ClosetState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
}));