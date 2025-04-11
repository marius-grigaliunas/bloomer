import { create } from 'zustand'
import { PlantCareInfo } from '@/lib/services/chutesService/deepseekService'
import { Plant } from './interfaces';

interface PlantInformation {
    identifiedPlant: {
        plant: Plant;
      } | null;
      setIdentifiedPlant: (plant: any) => void;
      clearIdentifiedPlant: () => void;
}

export const usePlantInformation = create<PlantInformation>((set) => ({
    identifiedPlant: null,
    setIdentifiedPlant: (plant) => set({identifiedPlant: plant}),
    clearIdentifiedPlant: () => set({identifiedPlant: null }),  
}))