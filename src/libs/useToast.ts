import Toast from "react-native-toast-message";

interface Props {
  type: "success" | "error" | "info";
  message?: string;
}

export default function () {
  const makeToast = async ({type, message}: Props) => {
    Toast.show({
      topOffset: 60,
      type: type,
      text1: getTitle(type),
      text2: message,
    });
  };

  const getTitle = (type: string) => {
    let title = "Success";

    switch (type) {
      case "error":
        title = "Failed";
        break;
      case "info":
        title = "Information";
        break;
      default:
    }

    return title;
  };

  return {
    makeToast,
  };
}
