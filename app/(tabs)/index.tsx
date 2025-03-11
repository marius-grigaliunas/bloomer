import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center" >
      <Text className="text-green-700 font-semibold">Bloomer</Text>
      <Text className=""> by </Text>
      <Text className="text-red-700 font-bold">Marius Grigaliunas</Text> 
    </View>
  );
}
