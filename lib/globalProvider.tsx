
import React, { Children, createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { getCurrentUser, avatar } from './appwrite';
import { useAppwrite } from "./useAppwrite";
import { User } from "@/interfaces/interfaces";

interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
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

    useEffect(() => {
        if(!loading && !isInitializedRef.current) {
            isInitializedRef.current = true;
        }
    }, [loading])

    const isLoggedIn = React.useMemo(() => !!user, [user]);

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Auth state:', {
            user: user ? 'logged in' : 'not logged in',
            loading,
            initialized: isInitializedRef.current,
        });
        console.log(JSON.stringify(user, null, 2));
    }

    const memoizedValue = React.useMemo(() => ({
        isLoggedIn,
        user,
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