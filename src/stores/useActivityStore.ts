import { create } from 'zustand';

interface ActivityStore {
  currentImageIndex: number;
  allImages: string[];
  isAlertOpen: boolean;
  isErrorAlertOpen: boolean;
  errorMessage: string;
  setCurrentImageIndex: (index: number) => void;
  setAllImages: (images: string[]) => void;
  setIsAlertOpen: (isOpen: boolean) => void;
  setIsErrorAlertOpen: (isOpen: boolean) => void;
  setErrorMessage: (message: string) => void;
}

export const useActivityStore = create<ActivityStore>(set => ({
  currentImageIndex: 0,
  allImages: [],
  isAlertOpen: false,
  isErrorAlertOpen: false,
  errorMessage: '',
  setCurrentImageIndex: index => set({ currentImageIndex: index }),
  setAllImages: images => set({ allImages: images }),
  setIsAlertOpen: isOpen => set({ isAlertOpen: isOpen }),
  setIsErrorAlertOpen: isOpen => set({ isErrorAlertOpen: isOpen }),
  setErrorMessage: message => set({ errorMessage: message }),
}));
