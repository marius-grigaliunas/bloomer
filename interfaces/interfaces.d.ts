import { Models } from 'react-native-appwrite';

export interface User extends Models.User<Models.Preferences>{
  avatar?: string;
}

export interface PlantCareInfo {
  error: any;
  wateringFrequency: number;
  wateringAmountMetric: number;
  wateringAmountImperial: number;
  lightRequirements: 'low' | 'medium' | 'high' | 'direct';
  soilPreferences: string;
  humidity: 'low' | 'medium' | 'high';
  minTemperatureCelsius: number;
  maxTemperatureCelsius: number;
  minTemperatureFahrenheit: number;
  maxTemperatureFahrenheit: number;
  commonIssues: string[];
  specialNotes: string[];
  careInstructions: string[];
}

export interface Plant {
  scientificName: string;
  commonNames: string[];
  confidence: number;
  careInfo: PlantCareInfo | null;
  imageUri: string;
}

export interface DatabaseUserType {
  // Core User Identity
  userId: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastLogin?: Date;
    // App Preferences
  notificationsEnabled: boolean;
  pushToken?: string | null;
  notificationTime?: string; // Time of day for notifications in HH:mm format
  timezone?: string;
  reminderAdvanceTime?: number; // hours before watering to send reminder
  
  // Profile Information
  profilePicture?: string;
  
  // User Preferences
  unitSystem: 'metric' | 'imperial';
  mondayFirstDayOfWeek: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  language?: 'en' | 'lt' | 'ro';
}

export interface DatabasePlantType {
  // Plant Identity
  plantId: string;
  ownerId: string;
  nickname: string;
  scientificName: string;
  commonNames?: string[];
  imageUrl: string | undefined;
  
  // Care Requirements
  wateringFrequency: number;
  wateringAmountMetric: number;
  wateringAmountImperial: number;
  lastWatered?: Date;
  nextWateringDate?: Date;
  lightRequirements: 'low' | 'medium' | 'high' | 'direct';
  soilPreferences?: string;
  humidity: 'low' | 'medium' | 'high';
  minTemperatureCelsius: number;
  maxTemperatureCelsius: number;
  minTemperatureFahrenheit: number;
  maxTemperatureFahrenheit: number;
  
  // Tracking & History
  dateAdded?: Date;
  wateringHistory?: Date[];
  
  // Notes & Issues
  commonIssues?: string[];
  notes?: string[];
  careInstructions?: string[];
}
export interface WeatherProps {
    location: string;
    temperature: number;
    description: string;
    descriptionIcon: string; 
}
export interface PlantIdentificationResponse {
    bestMatch: string;
    commonNames: string[] | null;
    confidence: number;
    rawResponse: any; // This will hold the complete response
    error?: string; // Optional error property
}

export interface BugReportType {
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  deviceInfo: string;
}

export interface UserMessageType {
  email: string;
  message: string;
}

/*
$id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: {};
  targets:[
    {
      $id: string;
      $createdAt: string;
      $updatedAt: string;
      name: string;
      userId: string;
      providerId: string;
      providerType: string;
      identifier: string;
      expired: boolean;
    }
  ]
  accessedAt: string;
  avatar: string;*/