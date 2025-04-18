import { Account, Avatars, Client, Databases, ID, Models, OAuthProvider, Query } from "react-native-appwrite"
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { User } from "@/interfaces/interfaces"
import { SplashScreen } from "expo-router"
import { DatabaseUserType } from '../interfaces/interfaces';

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

const databaseId = `${process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID}`;
const usersCollectionId = `${process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID}`;
const plantsCollectionId = `${process.env.EXPO_PUBLIC_APPWRITE_PLANTS_COLLECTION_ID}`;

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

export const getUserPlants = async (userId: string) => {
    try {
        const userPlants = databases.listDocuments(
            databaseId,
            plantsCollectionId,
            [
                Query.equal("ownerID", userId),
                Query.orderDesc("dateAdded")
            ]
        );

        return (await userPlants).documents.map(document => ({
            $id: document.$id,
            photo: { uri: document.imageUrl }, // Convert URL to photo prop format
            name: document.nickname,
            scientificName: document.scientificName,
            commonNames: document.commonNames,
            wateringFrequency: document.wateringFrequency,
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
    }
}