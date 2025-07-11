import React, { Children, createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { getCurrentUser, avatar, updateUserPushToken, getUserDatabaseData } from './appwrite';
import { useAppwrite } from "./useAppwrite";
import { DatabaseUserType, User } from "@/interfaces/interfaces";
import { router, SplashScreen } from "expo-router";
import { registerForPushNotificationsAsync } from "./services/notificationsService";
import * as Notifications from 'expo-notifications';

interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    databaseUser: DatabaseUserType | null;
    loading: boolean;
    refetch: (newParams?: Record<string, string | number>) => Promise<void>}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}


export const GlobalProvider = ({ children }: GlobalProviderProps ) => {
    const isInitializedRef = useRef(false);

    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite<User | null, Record<string, string | number>>({
        callFunction: async () => getCurrentUser(),
        params: {},
        skip: isInitializedRef.current,
    });

    const [ databaseUser, setDatabaseUser ] = useState<DatabaseUserType | null>(null); 
    const isLoggedIn = React.useMemo(() => !!user, [user]);

    useEffect(() => {
        if (!loading && !isInitializedRef.current) {
            isInitializedRef.current = true;
        }
    }, [loading]);

    useEffect(() => {
        const getDatabaseUser = async () => {
            if(user?.$id) {
                const dbUser = await getUserDatabaseData(user?.$id);
                setDatabaseUser(dbUser);
            } else {
                setDatabaseUser(null);
            }
        };
        getDatabaseUser();
    }, [user])
    
    console.log(user, loading, isLoggedIn);
    useEffect(() => {
        if(user) {
            console.log("Push notification effect running for user:", user.$id);
            const setupPushNotifications = async () => {
                try {
                    const token = await registerForPushNotificationsAsync();
                    console.log("registerForPushNotificationsAsync returned:", token);
                    if (token) {
                        await updateUserPushToken(user.$id, token);
                        console.log('Push token registered:', token);
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

    const memoizedValue = React.useMemo(() => ({
        isLoggedIn,
        user,
        databaseUser,
        loading,
        refetch,
    }), [isLoggedIn, user, loading, refetch]);

    return (
        <GlobalContext.Provider
            value={memoizedValue}
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