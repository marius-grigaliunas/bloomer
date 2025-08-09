import { create } from "zustand";

interface CareNavigationState {
  selectedDate: Date | null;
  selectedMonth: number;
  selectedYear: number;
  selectedPlants: string[]; // Array of plant IDs
}

interface NavigationState {
  careState: CareNavigationState;
  
  // Actions to update care state
  setCareState: (state: Partial<CareNavigationState>) => void;
  clearCareState: () => void;
  
  // Helper to get current date for initialization
  getCurrentDate: () => { month: number; year: number };
}

const getCurrentDate = () => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear()
  };
};

export const useNavigationState = create<NavigationState>((set, get) => {
  const { month, year } = getCurrentDate();
  
  return {
    careState: {
      selectedDate: null,
      selectedMonth: month,
      selectedYear: year,
      selectedPlants: []
    },

    setCareState: (newState: Partial<CareNavigationState>) => {
      set((state) => ({
        careState: { ...state.careState, ...newState }
      }));
    },

    clearCareState: () => {
      const { month, year } = getCurrentDate();
      set({
        careState: {
          selectedDate: null,
          selectedMonth: month,
          selectedYear: year,
          selectedPlants: []
        }
      });
    },

    getCurrentDate
  };
});
