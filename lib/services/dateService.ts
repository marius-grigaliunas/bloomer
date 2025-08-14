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

// Performance monitoring utilities
let performanceMetrics = {
  calendarGenerationTime: 0,
  cacheHitRate: 0,
  cacheMisses: 0,
  cacheHits: 0
};

// Enhanced cache with better key generation and LRU eviction
const wateringDaysCache = new Map<string, Map<string, WateringDay>>();
const cacheOrder: string[] = [];
const MAX_CACHE_SIZE = 15;

// Optimized cache key generation
const cacheKey = (plants: DatabasePlantType[], startDate: Date, endDate: Date) => {
  // Create a more efficient hash by using plant IDs and key properties
  const plantsHash = plants.map(p => `${p.plantId}-${p.lastWatered}-${p.wateringFrequency}`).join('|');
  return `${plantsHash}-${startDate.getTime()}-${endDate.getTime()}`;
};

// Enhanced cache management with LRU eviction
const addToCache = (key: string, wateringDays: Map<string, WateringDay>) => {
  if (wateringDaysCache.has(key)) {
    // Move to end of order (most recently used)
    const index = cacheOrder.indexOf(key);
    if (index > -1) {
      cacheOrder.splice(index, 1);
    }
  }
  
  wateringDaysCache.set(key, wateringDays);
  cacheOrder.push(key);
  
  // LRU eviction
  if (cacheOrder.length > MAX_CACHE_SIZE) {
    const oldestKey = cacheOrder.shift();
    if (oldestKey) {
      wateringDaysCache.delete(oldestKey);
    }
  }
};

// Optimized date calculations without creating unnecessary Date objects
export function calculateDaysLate(lastWatered: Date, frequency: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  
  const lastWateredDate = new Date(lastWatered);
  lastWateredDate.setHours(0, 0, 0, 0);
  const lastWateredTime = lastWateredDate.getTime();
  
  const expectedTime = lastWateredTime + (frequency * 24 * 60 * 60 * 1000);
  
  if (todayTime <= expectedTime) return 0;
  
  return Math.ceil((todayTime - expectedTime) / (24 * 60 * 60 * 1000));
}

export function calculateDaysUntilNextWatering(lastWatered: Date, frequency: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  
  const lastWateredDate = new Date(lastWatered);
  lastWateredDate.setHours(0, 0, 0, 0);
  const lastWateredTime = lastWateredDate.getTime();
  
  const expectedTime = lastWateredTime + (frequency * 24 * 60 * 60 * 1000);
  
  if (todayTime >= expectedTime) return 0;
  
  return Math.ceil((expectedTime - todayTime) / (24 * 60 * 60 * 1000));
}

// Optimized version with enhanced caching and reduced date operations
export function generateWateringDays(
  plants: DatabasePlantType[],
  startDate: Date,
  endDate: Date
): Map<string, WateringDay> {
  const key = cacheKey(plants, startDate, endDate);
  
  // Check cache first
  if (wateringDaysCache.has(key)) {
    performanceMetrics.cacheHits++;
    return wateringDaysCache.get(key)!;
  }
  
  performanceMetrics.cacheMisses++;
  const startTime = performance.now();

  const wateringDays = new Map<string, WateringDay>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const endTime = endDate.getTime();
  const startTimeMs = startDate.getTime();
  
  // Pre-calculate today for late comparison
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  
  // Process plants in batches for better performance
  const batchSize = 10;
  for (let i = 0; i < plants.length; i += batchSize) {
    const batch = plants.slice(i, i + batchSize);
    
    batch.forEach(plant => {
      if (!plant.wateringFrequency || !plant.lastWatered) return;
      
      const lastWatered = new Date(plant.lastWatered);
      lastWatered.setHours(0, 0, 0, 0);
      const lastWateredTime = lastWatered.getTime();
      
      // Calculate the next watering date based on last watered + frequency
      let nextWateringDate = new Date(lastWatered);
      nextWateringDate.setDate(nextWateringDate.getDate() + plant.wateringFrequency);
      nextWateringDate.setHours(0, 0, 0, 0);
      
      // Generate all watering days within the range
      while (nextWateringDate.getTime() <= endTime) {
        const currentDate = new Date(nextWateringDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dayOfMonth = currentDate.getDate();
        
        // Use the correct date key format with padding to match care.tsx expectations
        const dateKey = `${year}-${month < 10 ? '0' : ''}${month}-${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}`;
        

        
        // Calculate if late more efficiently
        const isLate = nextWateringDate.getTime() < todayTime;
        const daysLate = isLate ? Math.ceil((todayTime - nextWateringDate.getTime()) / (24 * 60 * 60 * 1000)) : 0;
        
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
          isNextWatering: nextWateringDate.getTime() === (lastWateredTime + (plant.wateringFrequency * 24 * 60 * 60 * 1000)),
          isLate,
          daysLate
        });

        // Move to next watering date
        nextWateringDate.setDate(nextWateringDate.getDate() + plant.wateringFrequency);
      }
    });
  }

  // Add to cache with LRU management
  addToCache(key, wateringDays);
  
  // Track performance
  performanceMetrics.calendarGenerationTime = performance.now() - startTime;



  return wateringDays;
}

// Function to clear cache when plants are updated
export function clearWateringDaysCache() {
  wateringDaysCache.clear();
  cacheOrder.length = 0;
}

// Function to clear calendar cache (to be used from CalendarGenerator)
export function clearCalendarCache() {
  // This will be called from CalendarGenerator when needed
  // The calendar cache is managed in CalendarGenerator component
}

export function getPerformanceMetrics() {
  const totalRequests = performanceMetrics.cacheHits + performanceMetrics.cacheMisses;
  const hitRate = totalRequests > 0 ? (performanceMetrics.cacheHits / totalRequests) * 100 : 0;
  
  return {
    ...performanceMetrics,
    cacheHitRate: hitRate
  };
}

export function resetPerformanceMetrics() {
  performanceMetrics = {
    calendarGenerationTime: 0,
    cacheHitRate: 0,
    cacheMisses: 0,
    cacheHits: 0
  };
}

// Pre-generate watering days for a specific month range with better performance
export function pregenerateWateringDays(
  plants: DatabasePlantType[],
  months: number = 6 // Pre-generate 6 months ahead
): void {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Include past month
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (months * 30)); // Include future months
  
  // Use setTimeout to avoid blocking the UI thread
  setTimeout(() => {
    // This will cache the result
    generateWateringDays(plants, startDate, endDate);
  }, 100);
}
