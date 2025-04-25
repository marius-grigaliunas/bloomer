import { DatabasePlantType } from "@/interfaces/interfaces";

export interface WateringDay {
  date: Date;
  plants: {
    plantId: string;
    nickname: string;
    isNextWatering: boolean;
  }[];
}

export function generateWateringDays(
  plants: DatabasePlantType[],
  startDate: Date,
  endDate: Date
): Map<string, WateringDay> {
  const wateringDays = new Map<string, WateringDay>();
  
  plants.forEach(plant => {
    if (!plant.wateringFrequency || !plant.lastWatered) return;
    
    // Ensure dates are properly initialized
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = plant.nextWateringDate ? new Date(plant.nextWateringDate) : lastWatered;
    let currentDate = new Date(nextWatering);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      console.log(`- Adding watering day: ${dateKey}`);
      
      if (!wateringDays.has(dateKey)) {
        wateringDays.set(dateKey, {
          date: new Date(currentDate),
          plants: []
        });
      }

      const day = wateringDays.get(dateKey)!;
      day.plants.push({
        plantId: plant.plantId,
        nickname: plant.nickname,
        isNextWatering: currentDate.getTime() === nextWatering.getTime()
      });

      // Create new date object to avoid mutation
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + plant.wateringFrequency);
    }
  });

  return wateringDays;
}
