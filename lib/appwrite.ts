import { Account, Avatars, Client, Databases, ID, Models, OAuthProvider, Query, Storage } from "react-native-appwrite"
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { DatabasePlantType, Plant, User } from "@/interfaces/interfaces"
import { SplashScreen } from "expo-router"
import * as FileSystem from 'expo-file-system';
import { Alert, Image, ImageSourcePropType } from "react-native"
import { makeRedirectUri } from 'expo-auth-session'

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

/*export async function login () {
    try {
        /*
        const redirectUri = Linking.createURL("/");

        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri); 
        console.log("App redirect URI:", redirectUri);

        if(!response) throw new Error("Failed to get OAuth URL"); 

        const browserResult = await WebBrowser.openAuthSessionAsync(
            response.toString(), 
            redirectUri
        );

        if(browserResult.type !== "success") throw new Error("OAuth failed or cancelled");
        
        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if(!secret || !userId) throw new Error("Failed to get secret/userId");

        const session = await account.createSession(userId, secret);
        if(!session) throw new Error("Failed to create session");

        const user = await account.get();
        console.log('Successfully logged in:', user);

        return true;
        ///////////

        const deepLink = new URL(makeRedirectUri({
            preferLocalhost: true,
            path: 'oauth-callback'
        }));

        if(!deepLink.hostname) {
            deepLink.hostname = 'localhost';
        }

        console.log("Deep link: ", deepLink.toString());

        const scheme = `${deepLink.protocol}//`;
        if(!scheme || scheme === "") throw new Error("Failed to create a scheme");
        console.log("Scheme:", scheme);

        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            deepLink.toString(),
            deepLink.toString()
        );

        if (!loginUrl) throw new Error("Failed to get OAuth URL");
        console.log("Login URL:", loginUrl.toString());

        const result = await WebBrowser.openAuthSessionAsync(loginUrl.toString(), scheme);
        console.log("OAuth result:", result);
        
        if(result.type === "success" && result.url) {
            console.log("Success URL:", result.url);

            const url = new URL(result.url);
            const secret = url.searchParams.get('secret');
            const userId = url.searchParams.get('userId');

            if(!secret || !userId) throw new Error("Failed to get secret/userId");
            console.log("Secret:", secret);
            console.log("UserId:", userId)
        
            const session = await account.createSession(userId, secret);

            const user = await account.get();

            if(!session) throw new Error("Failed to create session");

            console.log('Successfully logged in:', user);

            return true;            
        }

        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}*/

export async function login() {
    try {
        // Just use the default redirect URI that Expo generates
        const redirectUri = makeRedirectUri({
            path: 'oauth-callback'
        });
        
        //console.log("Redirect URI:", redirectUri);
        
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri,
            redirectUri
        );
        
        if (!loginUrl) throw new Error("Failed to get OAuth URL");
        //console.log("Login URL:", loginUrl.toString());
        
        const result = await WebBrowser.openAuthSessionAsync(
            loginUrl.toString(), 
            redirectUri.split('/')[0] + '//' // Use the scheme from the redirect URI
        );
        
        //console.log("OAuth result:", result);
        
        if (result.type === "success" && result.url) {
            //console.log("Success URL:", result.url);
            
            const url = new URL(result.url);
            const secret = url.searchParams.get('secret');
            const userId = url.searchParams.get('userId');
            
            //console.log("Secret:", secret);
            //console.log("UserId:", userId);
            
            if (secret && userId) {
                const session = await account.createSession(userId, secret);
                if (!session) throw new Error("Failed to create session");
                
                const user = await account.get();
                //console.log('Successfully logged in:', user);
                return true;
            } else {
                throw new Error(`Missing OAuth parameters - secret: ${secret}, userId: ${userId}`);
            }
        }
        
        return false;
    } catch (error) {
        console.error("Login error:", error);
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

export const createNewDatabaseUser = async (user: User, profilePic: string, pushToken?: string | null) => {
    try {
        const newUser = await databases.createDocument(
            databaseId,
            usersCollectionId,
            user.$id,
            {
                userId: user.$id,
                email: user.email,
                createdAt: new Date(user.$createdAt),
                notificationsEnabled: true,
                pushToken: pushToken,
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
                name: `plant${id}`,
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

export const deletePlantPicture = async (id: string) => {
    try {
        await storage.deleteFile(
            plantImageStorageId,
            id
        )

        return true;
    } catch (error) {
        console.error(error, "Error while deleting the plant picture");
        Alert.alert("Error while Deleting", "Unable to delete the plant picture");            
        return false;
    }
}

export const createNewDatabasePlant = async (plant: DatabasePlantType) => {

    try {
        const newPlant = await databases.createDocument(
            databaseId,
            plantsCollectionId,
            plant.plantId,
            plant,
        );

        return newPlant;
    } catch (error) {
        console.error("Error creating database user:", error);
        return null;
    }
}

const getDocumentById = async (id: string): Promise<string> => {
    const getDocument = await databases.listDocuments(
        databaseId,
        plantsCollectionId,
        [
            Query.equal('plantId', id)
        ]
    );

    const documentID = getDocument.documents[0].$id;
    return documentID;    
}

export const updatePlant = async (plant: DatabasePlantType) => {

    try {
        const documentId = await getDocumentById(plant.plantId);

        const result = databases.updateDocument(
            databaseId,
            plantsCollectionId,
            documentId,
            plant
        );
    } catch (error) {
        console.error(error,"Error while updating the Plant in database");
        Alert.alert("Error Updating the plant", "Aborting the process");
        return null
    }
}



export const deletePlant = async (plantId: string) => {

    const pictureDelete = await deletePlantPicture(plantId);
    if(!pictureDelete) {
        console.log("Picture wasn't deleted, aborting.");
        Alert.alert("Plant picture wasn't deleted", "Aborting the plant deleting process");            
        return null;
    }

    const documentID = await getDocumentById(plantId);

    try {
        const result = await databases.deleteDocument(
            databaseId,
            plantsCollectionId,
            documentID
        );

        return result;
    } catch (error) {
        console.error(error,"Error while deting the Plant from database");
        Alert.alert("Error Deleting the plant", "Aborting the process");
        return null;
    }
}

export const updateUserPushToken = async (userId: string, pushToken: string | null) => {
    try {
        await databases.updateDocument(
            databaseId,
            usersCollectionId,
            userId,
            {
                pushToken: pushToken,
                notificationsEnabled: !!pushToken
            }
        )
        console.log(`push token: ${pushToken}, updated`);
        Alert.alert("pushToken updated", `"${pushToken}"`);
    } catch (error) {
        console.error('Error updating push token:', error);
        return false;
    }
};

export interface NotificationPreferences {
  enabled: boolean;
  notificationTime?: string; // HH:mm format
  timezone?: string;
  reminderAdvanceTime?: number;
}

export async function updateNotificationPreferences(userId: string, preferences: NotificationPreferences) {
  try {
    await databases.updateDocument(
        databaseId,
        usersCollectionId,
        userId,
        {
          notificationsEnabled: preferences.enabled,
          notificationTime: preferences.notificationTime,
          timezone: preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          reminderAdvanceTime: preferences.reminderAdvanceTime || 24, // Default 24 hours before
        }
      );
      console.log("Notification settings updated");
      Alert.alert("Notification settings updated")
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
}