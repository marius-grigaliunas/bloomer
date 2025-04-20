import { create } from 'zustand'
import { Plant } from './interfaces';

interface PlantInformation {
  identifiedPlant: {
    plant: Plant;
  } | null;
  setIdentifiedPlant: (plant: Plant) => void;
  clearIdentifiedPlant: () => void;
}

export const usePlantInformation = create<PlantInformation>((set) => ({
  identifiedPlant: null,
  setIdentifiedPlant: (plant) => set({ 
    identifiedPlant: { 
      plant: {
        scientificName: plant.scientificName,
        commonNames: plant.commonNames,
        confidence: plant.confidence,
        careInfo: plant.careInfo,
        imageUri: plant.imageUri
      } 
    } 
  }),
  clearIdentifiedPlant: () => set({ identifiedPlant: null }),
}));