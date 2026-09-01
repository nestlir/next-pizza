import { create } from 'zustand';
import { cartApi } from '@/shared/services/cart';
import { Cart, CartItem } from '@prisma/client';

interface CartState {
  loading: boolean;
  error: string | null;
  items: CartItem[];
  totalAmount: number;
  fetchCartItems: () => Promise<void>;
  addCartItem: (productItemId: string, ingredients?: string[]) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  removeCartItem: (id: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  loading: false,
  error: null,
  items: [],
  totalAmount: 0,

  fetchCartItems: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await cartApi.getCart();
      set({ items: data.items || [], totalAmount: data.total || 0, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addCartItem: async (productItemId, ingredients) => {
    set({ loading: true, error: null });
    try {
      await cartApi.addCartItem({ productItemId, ingredients });
      await get().fetchCartItems();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateItemQuantity: async (id, quantity) => {
    set({ loading: true, error: null });
    try {
      await cartApi.updateItemQuantity(id, quantity);
      await get().fetchCartItems();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeCartItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await cartApi.removeCartItem(id);
      await get().fetchCartItems();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
