import { create } from 'zustand'
import { PlantCareInfo } from '@/lib/services/chutesService/deepseekService'

interface PlantInformation {
    identifiedPlant: {
        scientificName: string;
        commonNames: string[];
        confidence: number;
        careInfo: PlantCareInfo | null;
      } | null;
      setIdentifiedPlant: (plant: any) => void;
      clearIdentifiedPlant: () => void;
}

export const usePlantInformation = create<PlantInformation>((set) => ({
    identifiedPlant: null,
    setIdentifiedPlant: (plant) => set({identifiedPlant: plant}),
    clearIdentifiedPlant: () => set({identifiedPlant: null }),  
}))