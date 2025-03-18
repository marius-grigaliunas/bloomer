import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCurrentUser, logout } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/globalProvider'

const profile = async () => {

  const { refetch, loading, isLoggedIn } = useGlobalContext()
  
  let user = null
  
  if(isLoggedIn) {
    user = await getCurrentUser()
  }

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
        <SafeAreaView className="bg-background-lighter h-full">
            <ScrollView contentContainerStyle={{height: "auto"}} >
              <View className='flex justify-center items-center mt-20 bg-primary-dark
              p-10 rounded-xl '>
                <Text className='text-xl text-text-secondary'>{user?.name}</Text>
                <Text className='text-xl text-text-secondary'>{user?.email}</Text>
              </View>
              <View className='flex justify-center items-center'>
                  <TouchableOpacity onPress={handleSignOut}
                      className="bg-primary shadow-emerald-50 shadow-md rounded-full
                          w-80 h-20 mt-20 border-accent-moss border-2 flex justify-center items-center"
                  >
                      <View>
                          <Text className='text-2xl text-text-primary'>Sign Out</Text>
                      </View>
                  </TouchableOpacity>
              </View>
            </ScrollView>
        </SafeAreaView>
    )
  } else{
    return (
      <SafeAreaView className="bg-background-lighter h-full">
        <ScrollView contentContainerStyle={{height: "auto"}} >
          <View className='flex justify-center items-center w-full h-full'>
            <Text className='text-5xl text-white flex justify-center items-center text-center mt-96'>Please Sign in to see the profile section </Text>
          </View>
        </ScrollView>
      </SafeAreaView>    
    )
  }
}

export default profile