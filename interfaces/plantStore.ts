import { create } from "zustand";
import { DatabasePlantType } from "./interfaces";
import { getUserPlants } from "@/lib/appwrite";
import { isLoading } from "expo-font";

interface PlantState {
    plants: Record<string, DatabasePlantType>;
    allPlantIds: string[];
    isLoading: boolean;
    error: string | null;

    fetchAllUserPlants: (userId: string) => Promise<void>;
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

    fetchAllUserPlants: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const plantsData = await getUserPlants(userId);

            const plantsById: Record<string, DatabasePlantType> = {};
            plantsData.forEach(plant => {
                plantsById[plant.plantId] = plant;
            });

            set({
                plants:plantsById,
                allPlantIds: plantsData.map(plant => plant.plantId),
                isLoading: false
            });
        } catch (err: unknown) {
            set({isLoading: false, error: err instanceof Error ? err.message : 'An error fetching plants has occured'});
        }
    },

    getPlantById: (id: string) => {
        return get().plants[id];
    },

    updatePlant: async (plant: DatabasePlantType) => {},

    deletePlant: async (id: string) => {},
    
    markAsWatered: async (id: string) => {},
}))