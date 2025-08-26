"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  username: string | null;
  setUsername: (username: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username) => set({ username }),
      clearUser: () => set({ username: null }),
    }),
    {
      name: "user-storage", // key in localStorage
    }
  )
);
