import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCurrentUser, logout } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/globalProvider'
import { testChutesConnection } from "@/lib/services/chutesService/testChutesConnection";



const Profile = () => {

  const { refetch, loading, isLoggedIn, user: contextUser } = useGlobalContext();
  const [ currentUser, setCurrentUser ] = useState(contextUser);

  useEffect(() => {
    if(isLoggedIn) {
      getCurrentUser().then(userData => {
        setCurrentUser(userData)
      })
    }
  }, [isLoggedIn])

  const handleSignOut = async () => {
    const result = await logout();

    if(result) {
      console.log("SignOut Successful")
      refetch();
    } else {
      console.log("SignOut Failed")
    }
  }


  if(isLoggedIn) { return (
        <SafeAreaView className="bg-background-primary h-full">
            <ScrollView contentContainerStyle={{height: "auto"}} >
              <View className='flex justify-center items-center mt-20 bg-primary-dark
              p-10 rounded-xl '>
                <Text className='text-xl text-text-secondary'>{currentUser?.name ? currentUser?.name : "Guest"}</Text>
                <Text className='text-xl text-text-secondary'>{currentUser?.email}</Text>
              </View>
              <View className='flex justify-center items-center'>
                  <TouchableOpacity onPress={handleSignOut}
                      className="bg-primary shadow-emerald-50 shadow-md rounded-full
                          w-80 h-20 mt-20 border-accent border-2 flex justify-center items-center"
                  >
                      <View>
                          <Text className='text-2xl text-text-primary'>Sign Out</Text>
                      </View>
                  </TouchableOpacity>
              </View>
              <View className='flex justify-center items-center'>
                  <TouchableOpacity onPress={testChutesConnection}
                      className="bg-primary shadow-emerald-50 shadow-md rounded-full
                          w-80 h-20 mt-20 border-accent border-2 flex justify-center items-center"
                  >
                      <View>
                          <Text className='text-2xl text-text-primary'>Test</Text>
                      </View>
                  </TouchableOpacity>
              </View>
            </ScrollView>
        </SafeAreaView>
    )
  } else{
    return (
      <SafeAreaView className="bg-background-primary h-full">
        <ScrollView contentContainerStyle={{height: "auto"}} >
          <View className='flex justify-center items-center w-full h-full'>
            <Text className='text-5xl text-white flex justify-center items-center text-center mt-96'>Please Sign in to see the profile section </Text>
          </View>
        </ScrollView>
      </SafeAreaView>    
    )
  }
}

export default Profile