import { Account, Models } from 'react-native-appwrite';

export interface User extends Models.User<Models.Preferences>{
  avatar?: string;
}

export interface Plant {
  scientificName: string;
  commonNames: string[];
  confidence: number;
  careInfo: PlantCareInfo | null;
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