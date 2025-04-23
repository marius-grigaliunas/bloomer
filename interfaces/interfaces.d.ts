import { Account, Models } from 'react-native-appwrite';

export interface User extends Models.User<Models.Preferences>{
  avatar?: string;
}

export interface PlantCareInfo {
  wateringFrequency: number;
  wateringAmount: number;
  lightRequirements: 'low' | 'medium' | 'high' | 'direct';
  soilPreferences: string;
  humidity: 'low' | 'medium' | 'high';
  minTemperature: number;
  maxTemperature: number;
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
  reminderTime?: Date;
  timezone?: string;
  reminderAdvanceTime?: number;
  
  // Profile Information
  profilePicture?: string;
  
  // User Preferences
  unitSystem: 'metric' | 'imperial';
  mondayFirstDayOfWeek: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
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
  wateringAmount: number;
  lastWatered?: Date;
  nextWateringDate?: Date;
  lightRequirements: 'low' | 'medium' | 'high' | 'direct';
  soilPreferences?: string;
  humidity: 'low' | 'medium' | 'high';
  
  // Temperature Range
  minTemperature?: number;
  maxTemperature?: number;
  
  // Tracking & History
  dateAdded?: Date;
  wateringHistory?: Date[];
  
  // Notes & Issues
  commonIssues?: string[];
  notes?: string[];
  careInstructions?: string[];
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