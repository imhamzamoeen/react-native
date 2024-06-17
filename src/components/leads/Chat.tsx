import {useState, useCallback, useEffect} from "react";
import {
  GiftedChat,
  Send,
  Composer,
  InputToolbar,
} from "react-native-gifted-chat";
import {View} from "@/components/Themed";
import {formattedLeadComments} from "@/libs/useHelper";
import useAuthStore from "@/stores/useAuthStore";
import useLeadStore from "@/stores/useLeadsStore";
import {KeyboardAvoidingView, Platform} from "react-native";
import {Lead} from "@/types/Lead";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import {STYLES} from "@/constants/Styles";

type Props = {
  lead: Lead;
};

export default function ({lead}: Props) {
  const store = useLeadStore();
  const user = useAuthStore.getState().user;

  const [messages, setMessages]: any = useState([]);

  const runEffect = async () => {
    const messages = await formattedLeadComments(lead);
    setMessages(messages);
  };

  useEffect(() => {
    runEffect();
  }, []);

  const onSend = useCallback((messages: any = []) => {
    try {
      setMessages((previousMessages: any) =>
        GiftedChat.append(
          previousMessages,
          messages.map((message: any) => ({
            ...message,
            pending: true,
          }))
        )
      );

      // Make the API call
      store
        .storeComments(lead.id, messages[0].text)
        .then(() => {
          setMessages((previousMessages: any) =>
            previousMessages.map((message: any) => ({
              ...message,
              pending: false,
              sent: true,
            }))
          );
        })
        .catch(() => {
          setMessages((previousMessages: any) =>
            previousMessages.map((message: any) => ({
              ...message,
              pending: false,
              success: false,
            }))
          );
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          marginRight: 8,
        }}
      >
        <MaterialCommunityIcons
          name="send-circle"
          color={"#F80102"}
          size={32}
        />
      </Send>
    );
  };

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      composerHeight={32}
      textInputStyle={{
        fontFamily: STYLES.FONTS.REGULAR,
        fontSize: 14,
        marginTop: 10,
        marginBottom: 0,
        paddingBottom: 0,
      }}
    />
  );

  const renderInput = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 0,
        marginBottom: 0,
        paddingBottom: 0,
      }}
    />
  );

  const renderScrollToBottom = () => (
    <View className="bg-transparent">
      <Ionicons
        name="arrow-down-circle"
        color={COLORS["light"].color}
        size={40}
      />
    </View>
  );

  return (
    <View className="flex-1">
      <GiftedChat
        scrollToBottom={true}
        renderAvatarOnTop={true}
        messages={messages}
        onSend={(messages) => onSend(messages as any)}
        user={{
          _id: user.id,
        }}
        renderInputToolbar={renderInput}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderUsernameOnMessage={true}
        scrollToBottomComponent={renderScrollToBottom}
        scrollToBottomStyle={{backgroundColor: "transparent"}}
      />
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
}
