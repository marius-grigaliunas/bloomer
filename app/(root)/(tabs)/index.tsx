import { Link } from "expo-router";
import { Text, View } from "react-native";
import SignIn from '../../sign-in';

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-background " >
      <Text className="text-green-700 font-semibold text-3xl">Bloomer</Text>
      <Text className="text-xl"> by </Text>
      <Text className="text-red-700 font-bold text-3xl">Marius Grigaliunas</Text> 
      <Link className="mt-10 text-3xl text-white" href={"/sign-in"}>SignIn</Link>
    </View>
  );
}
