import React, { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCurrentUser, avatar, updateUserPushToken, getUserDatabaseData } from './appwrite';
import { useAppwrite } from "./useAppwrite";
import { DatabaseUserType, User } from "@/interfaces/interfaces";
import { router, SplashScreen } from "expo-router";
import { registerForPushNotificationsAsync } from "./services/notificationsService";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlantStore } from '@/interfaces/plantStore';

interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    databaseUser: DatabaseUserType | null;
    loading: boolean;
    isDeletingAccount: boolean;
    setDeletingAccount: (deleting: boolean) => void;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}


export const GlobalProvider = ({ children }: GlobalProviderProps ) => {
    const { clearStore } = usePlantStore();

    const getCurrentUserCallback = React.useCallback(async () => {
        return getCurrentUser();
    }, []);

    const emptyParams = React.useMemo(() => ({}), []);

    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite<User | null, Record<string, string | number>>({
        callFunction: getCurrentUserCallback,
        params: emptyParams,
        skip: false,
    });

    const [ databaseUser, setDatabaseUser ] = useState<DatabaseUserType | null>(null);
    const [ isDeletingAccount, setIsDeletingAccount ] = useState<boolean>(false);
    const setDeletingAccountCallback = React.useCallback((deleting: boolean) => {
        setIsDeletingAccount(deleting);
    }, []);
    const isLoggedIn = React.useMemo(() => !!user, [user]);


    useEffect(() => {
        const getDatabaseUser = async () => {
            if(user?.$id) {
                try {
                    const dbUser = await getUserDatabaseData(user.$id);
                    setDatabaseUser(dbUser);
                } catch (error) {
                    console.error("Error fetching database user:", error);
                    setDatabaseUser(null);
                }
            } else {
                setDatabaseUser(null);
                // Clear plant store when user logs out
                clearStore();
                // Reset deleting account state when user is logged out
                setIsDeletingAccount(false);
            }
        };
        getDatabaseUser();
    }, [user?.$id])
    
    useEffect(() => {
        if(user) {
            const setupPushNotifications = async () => {
                try {
                    // Check if we already have a token
                    const existingToken = await AsyncStorage.getItem('pushToken');
                    if (existingToken) {
                        await updateUserPushToken(user.$id, existingToken);
                        return;
                    }
                    
                    const token = await registerForPushNotificationsAsync();
                    if (token) {
                        await AsyncStorage.setItem('pushToken', token);
                        await updateUserPushToken(user.$id, token);
                    }
                } catch (err) {
                    console.error("Error in setupPushNotifications:", err);
                }
            };
            setupPushNotifications();
        }
    }, [user])

    useEffect(() => {
        // Handle notifications when app is in foreground
        const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Received notification in foreground:', notification);
        });

        // Handle notification response when app is in background
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            console.log('Notification response:', data);
            
            if (data?.plantId) {
                router.push(`/(root)/plants/${data.plantId}`);
            }
        });

        return () => {
            foregroundSubscription.remove();
            backgroundSubscription.remove();
        };
    }, [])

    const handleRefetch = React.useCallback(async (newParams?: Record<string, string | number>) => {
        await refetch(newParams);
        // Get the updated user after refetch
        const updatedUser = await getCurrentUser();
        // Only fetch database user data if we have a valid user
        if (updatedUser?.$id) {
            const dbUser = await getUserDatabaseData(updatedUser.$id);
            setDatabaseUser(dbUser);
        } else {
            // Clear database user when logged out
            setDatabaseUser(null);
            // Reset deleting account state when user is logged out
            setIsDeletingAccount(false);
        }
    }, [refetch]);

    const contextValue = React.useMemo(() => {
        return {
            isLoggedIn,
            user,
            databaseUser,
            loading,
            isDeletingAccount,
            setDeletingAccount: setDeletingAccountCallback,
            refetch: handleRefetch,
        };
    }, [isLoggedIn, user, databaseUser, loading, isDeletingAccount, setDeletingAccountCallback, handleRefetch]);

    return (
        <GlobalContext.Provider
            value={contextValue}
        >
            {children}
        </GlobalContext.Provider>
    )
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);

    if(!context) 
        throw new Error("useGlobalContext must be used within GlobalProvider")

    return context
};

export default GlobalProvider;