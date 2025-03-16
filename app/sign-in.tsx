import { ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SingIn = () => {

    const handleSignIn = () => {

    }

    return (
        <SafeAreaView className="bg-background-lighter h-full">
            <ScrollView contentContainerStyle={{height: "auto"}} >
                <TouchableOpacity onPress={handleSignIn}
                    className="bg-primary shadow-emerald-50 shadow-md rounded-full
                        w-full"
                >
                    <View>
                        <Text>Continue with google</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}