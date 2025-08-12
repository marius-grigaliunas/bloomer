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
        startDate.setDate(startDate.getDate() - 7); // Include past week
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Include next week
        
        const plantsArray = Object.values(plants);
        
        // Filter plants that have the required fields for watering days
        const plantsWithWateringData = plantsArray.filter(plant => 
          plant.wateringFrequency && plant.lastWatered
        );
        
        console.log(`Total plants: ${plantsArray.length}, Plants with watering data: ${plantsWithWateringData.length}`);
        
        // If no plants have watering data, create some test data for demonstration
        let plantsToUse = plantsWithWateringData;
        let isUsingTestData = false;
        if (plantsWithWateringData.length === 0 && plantsArray.length > 0) {
          console.log('Creating test watering data for demonstration');
          isUsingTestData = true;
          plantsToUse = plantsArray.slice(0, 2).map(plant => ({
            ...plant,
            wateringFrequency: 3, // Water every 3 days
            lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            nextWateringDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // Tomorrow
          }));
        }
        
        if (plantsToUse.length > 0) {
          const wateringDaysData = generateWateringDays(plantsToUse, startDate, endDate);
          console.log('Watering days generated:', wateringDaysData.size);
          setWateringDays(wateringDaysData);
          setIsTestData(isUsingTestData);
          
          // Extract plants that need immediate attention from watering days
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayKey = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}-${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
          
          const todayWateringDay = wateringDaysData.get(todayKey);
          const plantsNeedCareNow = todayWateringDay ? 
            todayWateringDay.plants.map(plant => plantsArray.find(p => p.plantId === plant.plantId)).filter((p): p is DatabasePlantType => p !== undefined) : [];
          
          setPlantsNeedCare(plantsNeedCareNow);
          
          // Extract plants that need care soon (next 3 days)
          const plantsNeedCareSoon: DatabasePlantType[] = [];
          for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            const futureKey = `${futureDate.getFullYear()}-${futureDate.getMonth() + 1 < 10 ? '0' : ''}${futureDate.getMonth() + 1}-${futureDate.getDate() < 10 ? '0' : ''}${futureDate.getDate()}`;
            
            const futureWateringDay = wateringDaysData.get(futureKey);
            if (futureWateringDay) {
              const futurePlants = futureWateringDay.plants.map(plant => 
                plantsArray.find(p => p.plantId === plant.plantId)
              ).filter((p): p is DatabasePlantType => p !== undefined);
              plantsNeedCareSoon.push(...futurePlants);
            }
          }
          
          setPlantsNeedCareLater(plantsNeedCareSoon);
        } else {
          console.log('No plants available for watering days');
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
