import { useState, useEffect, useRef } from 'react';
import { DatabasePlantType } from '@/interfaces/interfaces';
import { generateWateringDays, WateringDay } from '@/lib/services/dateService';

interface UseWateringDaysReturn {
  wateringDays: Map<string, WateringDay>;
  plantsNeedCare: DatabasePlantType[];
  plantsNeedCareLater: DatabasePlantType[];
  isTestData: boolean;
}

export const useWateringDays = (plants: Record<string, DatabasePlantType>): UseWateringDaysReturn => {
  const [wateringDays, setWateringDays] = useState<Map<string, WateringDay>>(new Map());
  const [plantsNeedCare, setPlantsNeedCare] = useState<DatabasePlantType[]>([]);
  const [plantsNeedCareLater, setPlantsNeedCareLater] = useState<DatabasePlantType[]>([]);
  const [isTestData, setIsTestData] = useState(false);

  // Add a ref to track if we've already calculated for this plants data
  const plantsRef = useRef<Record<string, DatabasePlantType>>({});

  useEffect(() => {
    const updatePlantsCare = () => {
      // Only recalculate if plants data has actually changed
      const plantsString = JSON.stringify(plants);
      const plantsRefString = JSON.stringify(plantsRef.current);
      
      if (plantsString === plantsRefString) {
        return; // Skip if plants haven't changed
      }
      
      plantsRef.current = plants;
      
      // Generate watering days for the current week using dateService
      if (Object.keys(plants).length > 0) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Include past month to catch overdue plants
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Include next week
        
        const plantsArray = Object.values(plants);
        
        // Filter plants that have the required fields for watering days
        const plantsWithWateringData = plantsArray.filter(plant => 
          plant.wateringFrequency && plant.lastWatered
        );
        
        // If no plants have watering data, create some test data for demonstration
        let plantsToUse = plantsWithWateringData;
        let isUsingTestData = false;
        if (plantsWithWateringData.length === 0 && plantsArray.length > 0) {
          isUsingTestData = true;
          plantsToUse = plantsArray.slice(0, 2).map((plant, index) => {
            const wateringFrequency = 3; // Water every 3 days
            // Set lastWatered to 10 days ago to make it clearly overdue
            const lastWatered = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
            const nextWateringDate = new Date(lastWatered.getTime() + wateringFrequency * 24 * 60 * 60 * 1000); // 7 days ago (overdue)
            
            return {
              ...plant,
              wateringFrequency,
              lastWatered,
              nextWateringDate
            };
          });
        }
        
        if (plantsToUse.length > 0) {
          const wateringDaysData = generateWateringDays(plantsToUse, startDate, endDate);
          setWateringDays(wateringDaysData);
          setIsTestData(isUsingTestData);
          
          // Find all overdue plants (plants with isLate=true)
          const overduePlants: DatabasePlantType[] = [];
          const plantsNeedCareSoon: DatabasePlantType[] = [];
          
          wateringDaysData.forEach((wateringDay, dateKey) => {
            wateringDay.plants.forEach(plantInfo => {
              const plant = plantsArray.find(p => p.plantId === plantInfo.plantId);
              if (plant) {
                if (plantInfo.isLate) {
                  // This plant is overdue
                  if (!overduePlants.find(p => p.plantId === plant.plantId)) {
                    overduePlants.push(plant);
                  }
                } else if (plantInfo.daysLate === 0 && !plantInfo.isNextWatering) {
                  // This plant needs care soon (not overdue, not next watering)
                  if (!plantsNeedCareSoon.find(p => p.plantId === plant.plantId)) {
                    plantsNeedCareSoon.push(plant);
                  }
                }
              }
            });
          });
          
          setPlantsNeedCare(overduePlants);
          setPlantsNeedCareLater(plantsNeedCareSoon);
        } else {
          setWateringDays(new Map());
          setIsTestData(false);
          setPlantsNeedCare([]);
          setPlantsNeedCareLater([]);
        }
      }
    };

    updatePlantsCare();
  }, [plants]);

  return {
    wateringDays,
    plantsNeedCare,
    plantsNeedCareLater,
    isTestData
  };
};
