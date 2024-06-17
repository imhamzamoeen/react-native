import COLORS from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import {TouchableOpacity, useColorScheme} from "react-native";
import useAuthStore from "@/stores/useAuthStore";
import {useRouter} from "expo-router";

interface CameraButtonProps {
  handlePress: Function;
  styles?: Object;
}

interface Styles {
  styles?: Object;
}

export default function () {
  const colorScheme = useColorScheme();
  const {logout} = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();

    router.replace("/(auth)/login");
  };

  const headerBasic = {
    title: "",
    headerBackTitle: "",
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: COLORS[colorScheme ?? "light"].background,
    },
  };

  const headerTabs = {
    headerTitle: "",
    headerBackTitle: "",
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: COLORS[colorScheme ?? "light"].background,
    },
  };

  const renderLogoutButton = ({styles}: Styles) => (
    <TouchableOpacity onPress={() => handleLogout()}>
      <Ionicons
        name="log-out"
        size={34}
        color={COLORS[colorScheme ?? "light"].navbarIcon}
      />
    </TouchableOpacity>
  );

  const renderBackButton = ({styles}: Styles) => (
    <TouchableOpacity onPress={() => router.back()} style={styles}>
      <Ionicons
        name="arrow-back-circle-sharp"
        size={34}
        color={COLORS[colorScheme ?? "light"].navbarIcon}
      />
    </TouchableOpacity>
  );

  const renderCameraButton = ({
    styles = {},
    handlePress,
  }: CameraButtonProps) => (
    <TouchableOpacity onPress={() => handlePress()} style={styles}>
      <Ionicons
        name="camera"
        color={COLORS[colorScheme ?? "light"].invert}
        size={34}
      />
    </TouchableOpacity>
  );

  return {
    headerBasic,
    headerTabs,
    renderLogoutButton,
    renderBackButton,
    renderCameraButton,
  };
}
