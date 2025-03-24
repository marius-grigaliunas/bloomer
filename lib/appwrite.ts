import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite"
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { User } from "@/interfaces/interfaces"
import { SplashScreen } from "expo-router"

export const config = {
    platform: 'com.margri.bloomer',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

export const avatar = new Avatars(client)
export const account = new Account(client)

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