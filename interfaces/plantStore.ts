import create from "zustand";
import { DatabasePlantType } from "./interfaces";

interface PlantState {
    plants: Record<string, DatabasePlantType>;
    allPlantIds: string[];
    isLoading: boolean;
    error: string | null;

    fetchAllUserPlants: () => Promise<void>;
    getPlantById: (id: string) => DatabasePlantType | undefined;
    updatePlant: (plant: DatabasePlantType) => Promise<void>;
    deletePlant: (id: string) => Promise<void>;
    markAsWatered: (id: string) => Promise<void>; 
}

export const usePlantStore = create<PlantState>((set, get) => ({
    plants: {},
    allPlantIds: [],
    isLoading: false, 
    error: null,

    fetchAllUserPlants: async () => {}
}))