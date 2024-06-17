import {Text, View} from "@/components/Themed";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import {useState} from "react";
import {Modal} from "react-native";
import {Picture} from "@/stores/useDropboxStore";
import {Ionicons} from "@expo/vector-icons";
import {Image as EImage} from "expo-image";

type Props = {
  pictures: Array<Picture>;
  isFetching?: boolean;
  refresh?: any;
};

const {width} = Dimensions.get("window");
const imageWidth = (width - 42) / 3;
const blurhash = "LYJTeUEY%MosI}jcWCbI%MoaM{ak";

export default function LeadImages({
  pictures,
  refresh,
  isFetching = false,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedPictures, setLoadedPictures] = useState(pictures.slice(0, 15));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleImageClick = (picture: any) => {
    const itemIndex = picture?.assetId
      ? loadedPictures.findIndex((p: any) => p.assetId === picture.assetId)
      : loadedPictures.findIndex((p: any) => p.id === picture.id);

    setSelectedImageIndex(itemIndex);
    setIsVisible(true);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const renderItem = (picture: any) => (
    <TouchableOpacity
      style={{marginRight: 5}}
      onPress={() => handleImageClick(picture)}
    >
      <EImage
        style={styles.image}
        source={picture.link}
        placeholder={blurhash}
        contentFit="cover"
        transition={100}
      />

      <View style={styles.overlay}>
        <View className="absolute top-2 left-2 rounded-2xl">
          {picture?.isLocal &&
            (picture.isSynced ? (
              <Ionicons name="checkmark-circle" color={"green"} size={16} />
            ) : (
              <Ionicons name="close-circle" color={"red"} size={16} />
            ))}
        </View>
      </View>
      <View className="justify-end" style={styles.overlay}>
        <Text style={styles.text}>{picture.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const loadMoreItems = () => {
    if (!loadingMore) {
      setLoadingMore(true);

      const nextPictures = pictures.slice(
        loadedPictures.length,
        loadedPictures.length + 15
      );

      setLoadedPictures((prevPictures) => [...prevPictures, ...nextPictures]);
      setLoadingMore(false);
    }
  };

  return (
    <>
      {isFetching && !isRefreshing ? (
        <ActivityIndicator className="flex-1" />
      ) : (
        <>
          {loadedPictures.length > 0 ? (
            <FlatList
              style={{marginTop: 20}}
              data={loadedPictures}
              renderItem={({item}) => renderItem(item)}
              keyExtractor={(item: any, index) => `${item.id}-${index}`}
              numColumns={3}
              contentContainerStyle={{
                gap: 10,
              }}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreItems}
              onEndReachedThreshold={0.1}
              {...(refresh
                ? {
                    refreshControl: (
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                      />
                    ),
                  }
                : {})}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Image
                className="w-[99%] opacity-30 dark:opacity-80 dark:rounded-lg dark:mt-10 dark:bg-dark"
                source={require("../../../assets/images/placeholder-image.png")}
              />
            </View>
          )}

          <SafeAreaView>
            <Modal
              visible={isVisible}
              transparent={true}
              onRequestClose={() => setIsVisible(false)}
            >
              <ImageViewer
                imageUrls={loadedPictures.map((p: any) => ({
                  url: p.link,
                  padding: 30,
                }))}
                index={selectedImageIndex ?? 0}
                onCancel={() => setIsVisible(false)}
                enableSwipeDown={true}
                saveToLocalByLongPress={false}
                loadingRender={() => <ActivityIndicator />}
                renderImage={(props) => <Image {...props} />}
              />
            </Modal>
          </SafeAreaView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
  text: {
    color: "#ffffff",
    fontSize: 12,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  icon: {
    padding: 15,
    color: "#fff",
  },
});
