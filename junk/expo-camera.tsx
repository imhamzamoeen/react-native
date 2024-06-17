import {Text} from "@/components/Themed";
import useToast from "@/libs/useToast";
import {Ionicons} from "@expo/vector-icons";
import {Camera, CameraType, FlashMode} from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import {useEffect, useRef, useState} from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import LocationCoordinates from "@/components/location/LocationCoordinates";
import useTime from "@/libs/useTime";
import {captureRef} from "react-native-view-shot";
import useLeadStore from "@/stores/useLeadsStore";
import useDopboxStore, {getHeaders} from "@/stores/useDropboxStore";
import {getExceptionMessage} from "@/libs/useHelper";
import {fileUploadEndpoint} from "@/constants/Dropbox";
import CBtn from "@/components/common/CBtn";

export default function () {
  const [photoData, setPhotoData]: any = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeStamp, setTimestamp]: any = useState({date: "", dayTime: ""});
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const {index} = useDopboxStore();
  const {selectedLead} = useLeadStore();
  const time = useTime();
  const cameraRef: any = useRef(null);
  const screenshotRef: any = useRef(null);

  const {makeToast} = useToast();

  useEffect(() => {
    setTimeDetails();
  }, []);

  const setTimeDetails = () => {
    const date = time.currentTime("L");
    const dayTime = time.currentTime("dddd, h:mm:ss a");

    setTimestamp({
      date,
      dayTime,
    });
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlashMode = () => {
    const series = [
      FlashMode.off,
      FlashMode.on,
      FlashMode.auto,
      FlashMode.torch,
    ];
    const currentIndex: any = series.findIndex((i) => i === flashMode);
    const nextIndex = (currentIndex + 1) % series.length;

    setFlashMode(series[nextIndex]);
  };

  useEffect(() => {
    if (photoData) {
      const waitTime = Platform.OS === "ios" ? 100 : 1000;

      setTimeout(() => handlePhotoUpload(), waitTime);
    }
  }, [photoData]);

  const handlePhotoUpload = async () => {
    try {
      setIsProcessing(true);

      const photo = await captureRef(screenshotRef, {
        result: "tmpfile",
        quality: 0.5,
        format: "jpg",
      });

      const headers = await getHeaders(selectedLead, photo.split("/").pop());

      await FileSystem.uploadAsync(fileUploadEndpoint, photo, {
        headers: headers,
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        fieldName: "file",
        mimeType: "image/jpeg",
        httpMethod: "POST",
      });

      makeToast({type: "success", message: "File was uploaded successfully,"});
      setPhotoData(null);
      await index(`${selectedLead.post_code} - ${selectedLead.address}`);
    } catch (e) {
      makeToast({type: "error", message: getExceptionMessage(e)});
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    setIsProcessing(true);
    setTimeDetails();

    const photo = await cameraRef.current.takePictureAsync();
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{rotate: 0}],
      {compress: 0.5, format: ImageManipulator.SaveFormat.JPEG}
    );

    setPhotoData(manipResult);
  };

  return (
    <>
      {permission === null || permission?.granted ? (
        <>
          <SafeAreaView
            edges={["right", "top", "left"]}
            className="flex-1 bg-light-background dark:bg-dark-background"
          >
            <LocationCoordinates />

            <View className="flex-1 justify-center">
              <Camera
                className="flex-1"
                type={type}
                flashMode={flashMode}
                ref={cameraRef}
              >
                <View className="flex-1 flex-row items-end justify-between px-8 py-16">
                  <TouchableOpacity
                    className="p-3 items-center rounded-full bg-[#ffffff80]"
                    onPress={toggleFlashMode}
                  >
                    <Ionicons
                      color={flashMode === FlashMode.off ? "#000" : "orange"}
                      name="flash"
                      size={24}
                    />
                    <Text className="text-xs text-dark capitalize font-MEDIUM">
                      {flashMode}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="rounded-full bg-[#ffffff2d]"
                    onPress={takePicture}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size={94} />
                    ) : (
                      <Ionicons name="ellipse" size={94} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="p-3 rounded-full bg-[#ffffff80]"
                    onPress={toggleCameraType}
                  >
                    <Ionicons name="camera-reverse" size={34} />
                  </TouchableOpacity>
                </View>
              </Camera>
            </View>
          </SafeAreaView>

          {photoData && (
            <View
              className="flex-1 w-full h-full absolute left-[1000]"
              ref={screenshotRef}
              collapsable={false}
            >
              <View className="items-end absolute z-10">
                <LocationCoordinates className="bg-white dark:bg-dark-background" />

                <Text className="mt-2 text-dark font-MEDIUM_ITALIC px-2 bg-white rounded-2xl">
                  {timeStamp.dayTime}
                </Text>
                <Text className="mt-1 text-dark font-MEDIUM_ITALIC px-2 bg-white">
                  {timeStamp.date}
                </Text>
              </View>
              <Image className="flex-1" source={{uri: photoData.uri}} />
            </View>
          )}
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-center mb-2">
            We need your permission to show the camera
          </Text>

          <View className="p-4">
            <CBtn title="Grant Permission" handlePress={requestPermission} />
          </View>
        </View>
      )}
    </>
  );
}
