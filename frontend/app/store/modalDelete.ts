import { create } from "zustand";

interface State {
  isOpen: boolean;
  title: string;
  closeModal: () => void;
  onConfirm: () => void;
  openModal: (title: string, onConfirm: () => void) => void;
}

export const useModalStore = create<State>((set) => {
  return {
    title: '',
    isOpen: false,
    openModal: (title: string, onConfirm: () => void) => {
      set({ title, onConfirm, isOpen: true });
    },
    onConfirm: () => {
      set({ isOpen: false })
    },
    closeModal: () => {
      set({ isOpen: false })
    },
  }
})