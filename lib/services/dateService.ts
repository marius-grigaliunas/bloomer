import { DatabasePlantType } from "@/interfaces/interfaces";

export interface WateringDay {
  date: Date;
  plants: {
    plantId: string;
    nickname: string;
    isNextWatering: boolean;
    isLate: boolean;
    daysLate: number;
  }[];
}

export function calculateDaysLate(lastWatered: Date, frequency: number): number {
  const today = new Date();
  const expectedDate = new Date(lastWatered);
  expectedDate.setDate(expectedDate.getDate() + frequency);
  
  if (today <= expectedDate) return 0;
  
  const diffTime = Math.abs(today.getTime() - expectedDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateDaysUntilNextWatering(lastWatered: Date, frequency: number): number {
  const today = new Date();
  const expectedDate = new Date(lastWatered);
  expectedDate.setDate(expectedDate.getDate() + frequency);
  
  if (today >= expectedDate) return 0;
  
  const diffTime = Math.abs(expectedDate.getTime() - today.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function generateWateringDays(
  plants: DatabasePlantType[],
  startDate: Date,
  endDate: Date
): Map<string, WateringDay> {
  const wateringDays = new Map<string, WateringDay>();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight
  
  plants.forEach(plant => {
    if (!plant.wateringFrequency || !plant.lastWatered) return;
    
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = plant.nextWateringDate ? new Date(plant.nextWateringDate) : lastWatered;
    let currentDate = new Date(nextWatering);
    while (currentDate <= endDate) {
      // Normalize current date to midnight
      currentDate.setHours(0, 0, 0, 0);
      
      // Format date key consistently across the application
      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const daysLate = calculateDaysLate(lastWatered, plant.wateringFrequency);
      // Only mark as late if scheduled date is before today (not today)
      const isLate = currentDate.getTime() < today.getTime();
      
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
        isNextWatering: currentDate.getTime() === nextWatering.getTime(),
        isLate,
        daysLate
      });

      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + plant.wateringFrequency);
    }
  });

  return wateringDays;
}
