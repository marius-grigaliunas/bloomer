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

// Optimized version with reduced date operations and better performance
export function generateWateringDays(
  plants: DatabasePlantType[],
  startDate: Date,
  endDate: Date
): Map<string, WateringDay> {
  const wateringDays = new Map<string, WateringDay>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const endTime = endDate.getTime();
  
  // Pre-calculate today for late comparison
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  
  plants.forEach(plant => {
    if (!plant.wateringFrequency || !plant.lastWatered) return;
    
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = plant.nextWateringDate ? new Date(plant.nextWateringDate) : new Date(lastWatered);
    nextWatering.setHours(0, 0, 0, 0);
    
    let currentTime = nextWatering.getTime();
    const frequencyMs = plant.wateringFrequency * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    
    while (currentTime <= endTime) {
      const currentDate = new Date(currentTime);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const dayOfMonth = currentDate.getDate();
      
      // Optimized date key generation
      const dateKey = `${year}-${month < 10 ? '0' : ''}${month}-${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}`;
      
      // Calculate if late more efficiently
      const isLate = currentTime < todayTime;
      const daysLate = isLate ? Math.ceil((todayTime - currentTime) / (24 * 60 * 60 * 1000)) : 0;
      
      if (!wateringDays.has(dateKey)) {
        wateringDays.set(dateKey, {
          date: currentDate,
          plants: []
        });
      }

      const wateringDayEntry = wateringDays.get(dateKey)!;
      wateringDayEntry.plants.push({
        plantId: plant.plantId,
        nickname: plant.nickname,
        isNextWatering: currentTime === nextWatering.getTime(),
        isLate,
        daysLate
      });

      currentTime += frequencyMs;
    }
  });

  return wateringDays;
}
