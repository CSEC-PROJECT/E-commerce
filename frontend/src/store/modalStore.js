import { create } from "zustand";

export const useModalStore = create((set) => ({
    isChangePasswordOpen: false,
    openChangePassword: () => set({ isChangePasswordOpen: true }),
    closeChangePassword: () => set({ isChangePasswordOpen: false }),
}));
