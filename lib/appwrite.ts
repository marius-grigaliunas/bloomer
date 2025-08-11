import { Account, Avatars, Client, Databases, ID, ImageGravity, Models, OAuthProvider, Query, Storage } from "react-native-appwrite"
import { DatabasePlantType, DatabaseUserType, Plant, User } from "@/interfaces/interfaces"
import { SplashScreen } from "expo-router"
import * as FileSystem from 'expo-file-system';
import { Alert, Image, ImageSourcePropType } from "react-native"
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export const config = {
    platform: 'com.margri.bloomer',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform)

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

// Update lastLogin and timezone for user
export const updateLoginInfo = async (userId: string) => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await databases.updateDocument(
            databaseId,
            usersCollectionId,
            userId,
            {
                lastLogin: new Date(),
                timezone: timezone
            }
        );
        // Optionally log or alert
        // console.log("Updated lastLogin and timezone for user", userId);
        return true;
    } catch (error) {
        console.error("Error updating lastLogin/timezone:", error);
        return false;
    }
};

/*export async function login() {
    try {
        const redirectUri = new URL(ExpoAuthSession.makeRedirectUri({preferLocalhost: true}));
        const scheme = `${redirectUri.protocol}://`;

        console.log("Redirect URI:", redirectUri);

        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${redirectUri}`,
            `${redirectUri}`
        );

        if (!loginUrl) throw new Error("Failed to get OAuth URL");

        const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

        console.log("WebBrowser result:", result);

        if (result.type === "success" && result.url) {
            const url = new URL(result.url);
            const secret = url.searchParams.get('secret');
            const userId = url.searchParams.get('userId');
            if (secret && userId) {
                const session = await account.createSession(userId, secret);
                if (!session) throw new Error("Failed to create session");
                const user = await account.get();
                await updateLoginInfo(userId);
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
}*/

export async function testAppwriteOAuth() {
    try {
        // Use a simple HTTP URL that will show us the response
        const testRedirectUri = 'https://httpbin.org/get';
        
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            testRedirectUri,
            testRedirectUri
        );

        console.log("Test OAuth URL:", loginUrl);
        
        // Open in browser and see what happens
        await WebBrowser.openBrowserAsync(`${loginUrl}`);
        
    } catch (error) {
        console.error("Test OAuth error:", error);
    }
}

export async function detailedLoginTest() {
    try {
        const scheme = 'appwrite-callback-67d145de00084a32d0d6';
        const redirectUri = `${scheme}://`;

        console.log("=== OAUTH DEBUG START ===");
        console.log("Scheme:", scheme);
        console.log("Redirect URI:", redirectUri);
        console.log("Project ID:", "67d145de00084a32d0d6");
        console.log("Appwrite endpoint:", "https://fra.cloud.appwrite.io/v1");

        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri,
            redirectUri
        );

        console.log("Generated OAuth URL:", loginUrl);
        console.log("=== OAUTH DEBUG END ===");

        // Try to open and see what happens
        const result = await WebBrowser.openAuthSessionAsync(
            `${loginUrl}`,
            redirectUri,
            { showInRecents: true }
        );

        console.log("WebBrowser result:", JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("Detailed login error:", error);
    }
}

export async function testBothEndpoints() {
    const testRedirect = 'https://httpbin.org/get';
    
    try {
        console.log("Testing createOAuth2Token:");
        const tokenUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            testRedirect,
            testRedirect
        );
        console.log("Token URL:", tokenUrl);
        
        console.log("Testing createOAuth2Session:");
        const sessionUrl = await account.createOAuth2Session(
            OAuthProvider.Google,
            testRedirect,
            testRedirect
        );
        console.log("Session URL:", sessionUrl);
        
    } catch (error) {
        console.error("Test error:", error);
    }
}

// Alternative approach using createOAuth2Token (recommended)
export async function login() {
    try {
        const redirectUri = AuthSession.makeRedirectUri({
            scheme: `appwrite-callback-${config.projectId}`,
        });

        console.log("AuthSession redirect URI:", redirectUri);

        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri,
            redirectUri
        );

        console.log("OAuth Token URL:", loginUrl);

        const result = await WebBrowser.openAuthSessionAsync(
            `${loginUrl}`,
            redirectUri
        );

        console.log("AuthSession result:", result);

        if (result.type === 'success' && result.url) {
            // Parse the redirect URL to extract token info
            const url = new URL(result.url);
            const userId = url.searchParams.get('userId');
            const secret = url.searchParams.get('secret');
            
            console.log("Extracted userId:", userId);
            console.log("Extracted secret:", secret);

            if (userId && secret) {
                try {
                    // Create session from the OAuth token
                    const session = await account.createSession(userId, secret);
                    console.log("Session created:", session);
                    
                    // Now get the user
                    const user = await account.get();
                    console.log("User authenticated:", user);
                    await updateLoginInfo(user.$id);
                    return true;
                } catch (sessionError) {
                    console.error("Failed to create session:", sessionError);
                    return false;
                }
            }
        }

        return false;
    } catch (error) {
        console.error("AuthSession login error:", error);
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
            const userAvatar = avatar?.getInitials ? avatar.getInitials(response.name || 'User') : 'U';

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

export const getUserDatabaseData = async (userId: string): Promise<DatabaseUserType | null> => {
    try {
        const doc = await databases.getDocument(
            databaseId,
            usersCollectionId,
            userId
        );

        if(!doc) throw new Error("Failed to get the user's data from the database");
        return {
            userId: doc.userId,
            email: doc.email,
            displayName: doc.displayName || doc.email || 'User',
            createdAt: doc.createdAt || new Date(),
            lastLogin: doc.lastLogin || new Date(),
            notificationsEnabled: doc.notificationsEnabled !== undefined ? !!doc.notificationsEnabled : true,
            pushToken: doc.pushToken,
            notificationTime: doc.notificationTime || '09:00',
            timezone: doc.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            reminderAdvanceTime: doc.reminderAdvanceTime || 24,
            profilePicture: doc.profilePicture || 'U',
            unitSystem: doc.unitSystem || 'metric',
            mondayFirstDayOfWeek: doc.mondayFirstDayOfWeek !== undefined ? !!doc.mondayFirstDayOfWeek : true,
            temperatureUnit: doc.temperatureUnit || 'celsius',
        };
    } catch (error) {
        console.error("Error getting database user:", error);
        return null;
    }
}

export const createNewDatabaseUser = async (user: User, profilePic: string, pushToken?: string | null) => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const newUser = await databases.createDocument(
            databaseId,
            usersCollectionId,
            user.$id,
            {
                userId: user.$id,
                email: user.email,
                displayName: user.name || user.email || 'User',
                createdAt: new Date(user.$createdAt),
                notificationsEnabled: true,
                pushToken: pushToken,
                timezone: timezone,
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
            plantId: document.plantId || document.$id,
            ownerId: document.ownerId || userId,
            nickname: document.nickname || 'Unknown Plant',
            scientificName: document.scientificName || 'Unknown Species',
            commonNames: document.commonNames || [],
            imageUrl: document.imageUrl || undefined, // Convert URL to photo prop format
            wateringFrequency: document.wateringFrequency || 7,
            wateringAmountMetric: document.wateringAmountMetric || 250,
            wateringAmountImperial: document.wateringAmountImperial || 8.5,
            lastWatered: document.lastWatered || new Date(),
            nextWateringDate: document.nextWateringDate || new Date(Date.now() + (document.wateringFrequency || 7) * 24 * 60 * 60 * 1000),
            lightRequirements: document.lightRequirements || 'medium',
            soilPreferences: document.soilPreferences || 'Well-draining potting mix',
            humidity: document.humidity || 'medium',
            minTemperatureCelsius: document.minTemperatureCelsius || 15,
            maxTemperatureCelsius: document.maxTemperatureCelsius || 30,
            minTemperatureFahrenheit: document.minTemperatureFahrenheit || 59,
            maxTemperatureFahrenheit: document.maxTemperatureFahrenheit || 86,
            dateAdded: document.dateAdded || new Date(),
            wateringHistory: document.wateringHistory || [],
            commonIssues: document.commonIssues || [],
            notes: document.notes || [],
            careInstructions: document.careInstructions || []
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

        // Upload the file
        await storage.createFile(
            plantImageStorageId,
            id,
            {
                name: `plant${id}`,
                type: 'image/jpg',
                size: fileInfo.size,
                uri: fileUri
            }
        );

        // Generate the URL directly using getFileView instead of getFilePreview
        const fileUrl = storage.getFileView(
            plantImageStorageId,
            id
        );

        // Create the full URL manually
        const fullUrl = `${config.endpoint}/storage/buckets/${plantImageStorageId}/files/${id}/view?project=${config.projectId}`;
        
        console.log("Generated image URL:", fullUrl);

        return fullUrl;

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
        
    } catch (error) {
        console.error('Error updating push token:', error);
        return false;
    }
};

export async function updatePreferences(userId: string, preferences: Partial<DatabaseUserType>) {
  try {
    await databases.updateDocument(
        databaseId,
        usersCollectionId,
        userId,
        preferences
      );
      console.log("Settings updated");
      Alert.alert("Settings updated")
      return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    return false;
  }
}