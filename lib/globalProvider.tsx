
import React, { Children, createContext, ReactNode, useContext } from "react";
import { getCurrentUser, avatar } from './appwrite';
import { useAppwrite } from "./useAppwrite";
import { Redirect } from "expo-router";

interface User {
    $id: string;
    name: string;
    email: string;
    avatar: string;
}

interface GlobalContextType {
    isLogged: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams: Record<string, string | number>) => Promise<void>}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps ) => {
    const {
        data: user = null as User | null,
        loading,
        refetch,
    } = useAppwrite({
        callFunction: getCurrentUser,
    });

    const isLogged = !!user;

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                user,
                loading,
                refetch,
            }}
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