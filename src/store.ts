import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface TokenStore {
  token: string;
  setToken: (data: string) => void;
  logout: () => void;
}

const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (data: string) => set(() => ({ token: data })),
        logout: () => {
          set(() => ({ token: "" }));
          // Clear the token from localStorage manually
          localStorage.removeItem("token-storage");
        },
      }),
      { name: "token-storage" }
    )
  )
);

export default useTokenStore;
