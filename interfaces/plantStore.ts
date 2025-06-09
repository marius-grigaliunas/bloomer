import { create } from "zustand";
import { DatabasePlantType } from "./interfaces";
import { deletePlant, getUserPlants, updatePlant } from "@/lib/appwrite";
import { isLoading } from "expo-font";
import { checkMissedWaterings, scheduleWateringReminder } from "@/lib/services/notificationsService";

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
        if(userId === "") {
            set({isLoading: false, error: "No active user"});
            return;
        }

        try {
            const plantsData = await getUserPlants(userId);

            const plantsById: Record<string, DatabasePlantType> = {};

            for(const plant of plantsData) {
                await scheduleWateringReminder(plant);
            }

            await checkMissedWaterings(plantsData);

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

    updatePlant: async (plant: DatabasePlantType) => {
        try {
            set({ isLoading: true, error: null });
            await updatePlant(plant);
            
            set(state => ({
                plants: {...state.plants, [plant.plantId]: plant },
                isLoading: false
            }));
        } catch (err) {
            set({isLoading: false, error: err instanceof Error ? err.message : 'An error updating the plant has occured'});
        }
    },

    deletePlant: async (id: string) => {
        try {
            set({isLoading: true, error: null});
            await deletePlant(id);

            set(state => {
                const newPlants = {...state.plants };
                delete newPlants[id];

                return {
                    plants: newPlants,
                    allPlantIds: state.allPlantIds.filter(plantId => plantId !== id),
                    isLoading: false
                };
            });
        } catch (err) {
            set({isLoading: false, error: err instanceof Error ? err.message : 'An error deleting the plant has occured'});
        }
    },
    
    markAsWatered: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            const plant = get().plants[id];
            
            if (!plant) {
              throw new Error("Plant not found");
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const newWateringHistory = plant.wateringHistory;
            newWateringHistory?.push(today);

            const nextDate = new Date(today);
            nextDate.setHours(0, 0, 0, 0);
            nextDate.setDate(today.getDate() + plant.wateringFrequency);

            const updatedPlant: DatabasePlantType = {
              ...plant,
              lastWatered: today,
              wateringHistory: newWateringHistory,
              nextWateringDate: nextDate
            };
            
            await updatePlant(updatedPlant);
            await scheduleWateringReminder(updatedPlant);
            
            set(state => ({
              plants: { ...state.plants, [id]: updatedPlant },
              isLoading: false
            }));
        } catch (err) {
            set({isLoading: false, error: err instanceof Error ? err.message : 'An error marking the plant as watered has occured'});
        }
    },
}))