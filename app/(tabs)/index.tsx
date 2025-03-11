import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-background " >
      <Text className="text-green-700 font-semibold text-3xl">Bloomer</Text>
      <Text className="text-xl"> by </Text>
      <Text className="text-red-700 font-bold text-3xl">Marius Grigaliunas</Text> 
    </View>
  );
}
