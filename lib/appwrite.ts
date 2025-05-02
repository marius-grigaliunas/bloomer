import { Account, Avatars, Client, Databases, ID, Models, OAuthProvider, Query, Storage } from "react-native-appwrite"
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { DatabasePlantType, Plant, User } from "@/interfaces/interfaces"
import { SplashScreen } from "expo-router"
import * as FileSystem from 'expo-file-system';
import { Alert, Image, ImageSourcePropType } from "react-native"

export const config = {
    platform: 'com.margri.bloomer',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

const databaseId = `${process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID}`;
const usersCollectionId = `${process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID}`;
const plantsCollectionId = `${process.env.EXPO_PUBLIC_APPWRITE_PLANTS_COLLECTION_ID}`;
const plantImageStorageId = `${process.env.EXPO_PUBLIC_APPWRITE_IMAGES_STORAGE_BUCKET_ID}`;

export async function AnnonymousLogin() {
    try {
        const session = await account.createAnonymousSession();

        if(!session) throw new Error("Failed to create an annonymous Session")
        
        return true;
    } catch (error) {
        
        console.error(error)
        return false;
    }
}

export async function login () {
    try {
        const redirectUri = Linking.createURL("/");

        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri); 

        if(!response) throw new Error("Failed to login"); 

        const browserResult = await WebBrowser.openAuthSessionAsync(
            response.toString(), 
            redirectUri
        );

        if(browserResult.type !== "success") throw new Error("Failed to login");
        
        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if(!secret || !userId) throw new Error("Failed to get secret/userId");

        const session = await account.createSession(userId, secret);
        if(!session) throw new Error("Failed to login");

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function logout () {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await account.get()

        if(response.$id) {
            const userAvatar = avatar.getInitials(response.name);

            try {
                const existingUser = await databases.listDocuments(
                    databaseId,
                    usersCollectionId,
                    [
                        Query.equal('userId', response.$id)
                    ]
                );

                if(existingUser.documents.length === 0) {
                    await createNewDatabaseUser(response, userAvatar.toString());
                }
            } catch(error) {
                console.error("Failed to create new user:", error);
            }

            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }

        return null;
    } catch (error: any) {
        if(error?.code === 401 || error?.type === "user_unauthorized") {
            return null;
        }
        
        console.error(error)
        return null;
    }
}

export const createNewDatabaseUser = async (user: User, profilePic: string) => {

    try {
        const newUser = await databases.createDocument(
            databaseId,
            usersCollectionId,
            ID.unique(),
            {
                userId: user.$id,
                email: user.email,
                createdAt: new Date(user.$createdAt),
                notificationsEnabled: true,
                profilePicture: profilePic,
                unitSystem: 'metric',
                mondayFirstDayOfWeek: true,
                temperatureUnit: 'celsius'
            }
        );
        return newUser;
    } catch (error) {
        console.error("Error creating database user:", error);
        return null;
    }
}

export const getUserPlants = async (userId: string): Promise<DatabasePlantType[]>  => {
    try {
        const userPlants = databases.listDocuments(
            databaseId,
            plantsCollectionId,
            [
                Query.equal("ownerId", userId),
                Query.orderDesc("dateAdded")
            ]
        );

        return (await userPlants).documents.map(document => ({
            plantId: document.plantId,
            ownerId: document.ownerId,
            nickname: document.nickname,
            scientificName: document.scientificName,
            commonNames: document.commonNames,
            imageUrl: document.imageUrl, // Convert URL to photo prop format
            wateringFrequency: document.wateringFrequency,
            wateringAmount: document.wateringAmount,
            lastWatered: document.lastWatered,
            nextWateringDate: document.nextWateringDate,
            lightRequirements: document.lightRequirements,
            soilPreferences: document.soilPreferences,
            humidity: document.humidity,
            minTemperature: document.minTemperature,
            maxTemperature: document.maxTemperature,
            dateAdded: document.dateAdded,
            wateringHistory: document.wateringHistory,
            commonIssues: document.commonIssues,
            notes: document.notes,
            careInstructions: document.careInstructions
        }))

    } catch (error) {
        console.log("Error fetching user plants:", error);
        return [];
    }
}

export const uploadPlantPicture = async (fileUri: string, id: string) => {
    if(!fileUri) return;

    try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if(!fileInfo.exists) {
            throw new Error(`File does not exist: ${fileUri}`);
        }

        const uploadedFile = await storage.createFile(
            plantImageStorageId,
            id,
            {
                name: `plant${fileUri}`,
                type: 'image/jpg',
                size: fileInfo.size,
                uri: fileUri
            }
        )

        const fileUrl = await storage.getFileView(
            plantImageStorageId,
            id
        )

        if(!fileUrl) {
            throw new Error("Error getting file preview");
        }

        return fileUrl;

    } catch (error) {
        console.error("Error uploading image to appwrite cloud: ", error);
        return;
    }
}

export const createNewDatabasePlant = async (plant: DatabasePlantType) => {

    try {
        const newPlant = await databases.createDocument(
            databaseId,
            plantsCollectionId,
            ID.unique(),
            plant,
        );

        return newPlant;
    } catch (error) {
        console.error("Error creating database user:", error);
        return null;
    }
}

export const updatePlant = async (plant: DatabasePlantType) => {
    console.log("Implement plant update in the database");
    Alert.alert("UPDATE WIP", "Implement plant update in the database");
}


export const deletePlant = async (plantId: string) => {
    console.log("Implement plant delete in the database");
    Alert.alert("DELETE WIP", "Implement plant delete in the database");
}

export const markAsWatered = async (plant: DatabasePlantType) => {
    console.log("Implement marking plant as watered in the database");
    Alert.alert("MARK WATERED WIP", "Implement marking plant as watered in the database");
}