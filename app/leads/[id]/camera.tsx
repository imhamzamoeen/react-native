import {Text} from "@/components/Themed";
import {useCallback, useEffect, useRef, useState} from "react";
import {useIsFocused} from "@react-navigation/core";
import {captureRef} from "react-native-view-shot";
import {
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  CameraProps,
  useCameraFormat,
} from "react-native-vision-camera";
import Reanimated, {
  Extrapolate,
  FadeIn,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import {
  PinchGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import {Ionicons} from "@expo/vector-icons";
import LocationCoordinates from "@/components/location/LocationCoordinates";
import {SafeAreaView} from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import useTime from "@/libs/useTime";
import useLeadStore from "@/stores/useLeadsStore";
import Animated from "react-native-reanimated";
import {Image} from "react-native";

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const MAX_ZOOM_FACTOR = 10;
const SCALE_FULL_ZOOM = 3;

enum CameraType {
  BACK = "back",
  FRONT = "front",
}

enum Flash {
  ON = "on",
  OFF = "off",
}

export default function () {
  const [cameraPermission, setCameraPermission]: any = useState();
  const [mediaLibraryPermission, setMediaLibraryPermission]: any = useState();
  const [photoData, setPhotoData]: any = useState(null);
  const [isProcessing, setIsProcessing]: any = useState(false);
  const [album, setAlbum]: any = useState();
  const [timeStamp, setTimestamp]: any = useState({date: "", dayTime: ""});
  const [showFocusImage, setShowFocusImage]: any = useState(false);
  const [focusCoordinates, setFocusCoordinates]: any = useState({
    x: 0,
    y: 0,
  });

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    CameraType.BACK
  );
  const [flash, setFlash] = useState<"off" | "on">(Flash.OFF);

  const device: any = useCameraDevice(cameraPosition, {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });

  const camera = useRef<Camera>(null);
  const screenshotRef: any = useRef(null);
  const time = useTime();
  const {selectedLead} = useLeadStore();
  const isFocussed = useIsFocused();
  const zoom = useSharedValue(device.neutralZoom);
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  useEffect(() => {
    async function runEffect() {
      const cameraPermissions = await Camera.requestCameraPermission();
      const libraryPermissions = await MediaLibrary.requestPermissionsAsync();

      setCameraPermission(cameraPermissions);
      setMediaLibraryPermission(libraryPermissions);
    }

    setTimeDetails();
    runEffect();
  }, []);

  useEffect(() => {
    setAlbum(`${selectedLead.post_code} - ${selectedLead.address}`);
  }, [selectedLead]);

  const onPinchGesture = useAnimatedGestureHandler({
    onStart: (_: any, context: any) => {
      context.startZoom = zoom.value;
    },
    onActive: (event: any, context: any) => {
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP
      );
    },
  });

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);

    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  const screen = Dimensions.get("screen");
  const format = useCameraFormat(device, [
    {photoAspectRatio: screen.height / screen.width},
    {photoResolution: "max"},
    {iso: "max"},
    {autoFocusSystem: "phase-detection"},
    {fps: "max"},
    {pixelFormat: "native"},
  ]);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = format?.supportsPhotoHdr;
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  const onToggleCameraType = useCallback(() => {
    setCameraPosition((current) =>
      current === CameraType.BACK ? CameraType.FRONT : CameraType.BACK
    );
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === Flash.OFF ? Flash.ON : Flash.OFF));
  }, []);

  const onFocusTap = useCallback(
    ({nativeEvent: event}: GestureResponderEvent) => {
      if (!device?.supportsFocus) return;
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });

      setFocusCoordinates({x: event.locationX - 20, y: event.locationY + 100});
      setShowFocusImage(true);
    },
    [device?.supportsFocus]
  );

  useEffect(() => {
    if (showFocusImage) {
      setTimeout(() => setShowFocusImage(false), 2000);
    }
  }, [showFocusImage]);

  const onDoubleTap = useCallback(() => {
    onToggleCameraType();
  }, [onToggleCameraType]);

  const onTakePhoto = useCallback(async () => {
    try {
      setTimeDetails();
      setIsProcessing(true);

      if (camera.current == null) throw new Error("Camera ref is null!");

      const photo = await camera.current.takePhoto({flash: flash});
      setPhotoData(photo);
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  }, [camera, flash]);

  const setTimeDetails = () => {
    const date = time.currentTime("L");
    const dayTime = time.currentTime("dddd, h:mm:ss a");

    setTimestamp({
      date,
      dayTime,
    });
  };

  const handlePhotoSave = async () => {
    try {
      const photo = await captureRef(screenshotRef, {
        result: "tmpfile",
      });

      const cachedAsset = await MediaLibrary.createAssetAsync(photo);
      const existingAlbum = await MediaLibrary.getAlbumAsync(album);

      if (existingAlbum) {
        await MediaLibrary.addAssetsToAlbumAsync(
          [cachedAsset],
          existingAlbum,
          false
        );
      } else {
        await MediaLibrary.createAlbumAsync(album, cachedAsset);
      }
    } catch (e) {
      console.error("Failed to save photo!", e);
    } finally {
      setIsProcessing(false);
      setPhotoData(null);
    }
  };

  useEffect(() => {
    zoom.value = device?.neutralZoom ?? 1;
  }, [zoom, device]);

  useEffect(() => {
    if (photoData) {
      const waitTime = Platform.OS === "ios" ? 500 : 1000;

      setTimeout(() => handlePhotoSave(), waitTime);
    }
  }, [photoData]);

  if (device == null) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No camera device detected.</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView
        edges={["right", "top", "left"]}
        className="flex-1 flex-col bg-dark-background"
      >
        {showFocusImage && (
          <Animated.Image
            entering={FadeIn.delay(100).duration(500)}
            source={require("../../../assets/images/focus.png")}
            className="flex-1 absolute w-[40px] h-[40px] z-50 bg-transparent"
            style={[{left: focusCoordinates.x, top: focusCoordinates.y}]}
          />
        )}

        <View className="flex-[0.08]"></View>
        <View className="flex-[0.7]">
          <LocationCoordinates className="z-10" />

          {device != null && isFocussed && (
            <PinchGestureHandler
              onGestureEvent={onPinchGesture}
              enabled={isFocussed}
            >
              <Reanimated.View
                entering={FadeIn.duration(1500)}
                className="flex-1"
                onTouchEnd={onFocusTap}
              >
                <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
                  <ReanimatedCamera
                    className="flex-1"
                    device={device}
                    isActive={isFocussed}
                    ref={camera}
                    animatedProps={cameraAnimatedProps}
                    photo={true}
                    format={format}
                    exposure={0}
                    orientation="portrait"
                  />
                </TapGestureHandler>
              </Reanimated.View>
            </PinchGestureHandler>
          )}
        </View>

        <View className="flex-[0.2] mt-4">
          <View
            className="flex-row items-center justify-between px-8 py-16"
            style={{position: "absolute", bottom: 0, left: 0, right: 0}}
          >
            {supportsFlash ? (
              <TouchableOpacity
                className="p-3 rounded-full bg-[#ffffff80]"
                onPress={onFlashPressed}
              >
                <Ionicons
                  name={flash === Flash.ON ? "flash" : "flash-off"}
                  color={flash === Flash.ON ? "orange" : "black"}
                  size={28}
                />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}

            <TouchableOpacity
              className="rounded-full bg-[#ffffff2d]"
              onPress={onTakePhoto}
            >
              {isProcessing ? (
                <ActivityIndicator size={94} />
              ) : (
                <Ionicons name="ellipse" size={94} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="p-3 rounded-full bg-[#ffffff80]"
              onPress={onToggleCameraType}
            >
              <Ionicons name="camera-reverse" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {photoData && (
        <View
          ref={screenshotRef}
          collapsable={false}
          className="flex-1 absolute left-[1000] w-full h-full"
        >
          <View className="flex-[0.2]"></View>
          <View className="flex-[0.62]">
            <LocationCoordinates className="z-10" />

            <Image
              className="flex-1"
              resizeMode="cover"
              source={{uri: photoData.path}}
            />
          </View>
          <View className="flex-[0.15]"></View>
        </View>
      )}
    </>
  );
}
