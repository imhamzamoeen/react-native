import CInput from "@/components/common/CInput";
import {ScrollView, View} from "react-native";
import useAuthStore from "@/stores/useAuthStore";
import {useRouter} from "expo-router";
import {useState} from "react";
import {Image} from "react-native";
import CBtn from "@/components/common/CBtn";
import Animated, {FadeInUp} from "react-native-reanimated";
import {Text} from "@/components/Themed";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {isFetching, login, fetchStatistics, errors} = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({email, password});
      await fetchStatistics();

      router.replace("/leads/");
    } catch (e) {
      //
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Image
        className="h-full w-full absolute top-[-150]"
        source={require("../../assets/images/bg.png")}
      />

      <View className="flex-row w-full justify-around absolute">
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          className="h-[190] w-[75]"
          source={require("../../assets/images/light.png")}
        />

        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify()}
          className="h-[150] w-[60]"
          source={require("../../assets/images/light.png")}
        />
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-4xl">Login</Text>
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        className="flex-1 gap-4 px-4 justify-center"
      >
        <CInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          errors={errors.email}
        />

        <CInput
          className="mb-4"
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
          errors={errors.password}
        />

        <CBtn
          className="items-center"
          handlePress={handleLogin}
          isFetching={isFetching}
        />
      </Animated.View>
    </ScrollView>
  );
}
