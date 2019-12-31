import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { useIntroSliderDone } from "../AuthContext";
import Toast from "react-native-tiny-toast";

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 320,
    height: 320
  }
});

const slides = [
  {
    key: "somethun",
    title: "Title 1",
    image: require("../assets/images/write_img.png"),
    backgroundColor: "#ff0033"
  },
  {
    key: "somethun-dos",
    title: "Title 2",
    image: require("../assets/images/wallet_creation_img.png"),
    backgroundColor: "#ff9933"
  },
  {
    key: "somethun-three",
    title: "Title 3",
    image: require("../assets/images/write_img.png"),
    backgroundColor: "#ffcc33"
  },
  {
    key: "somethun-four",
    title: "Title 4",
    image: require("../assets/images/wallet_creation_img.png"),
    backgroundColor: "#00cc33"
  },
  {
    key: "somethun-five",
    title: "Title 5",
    image: require("../assets/images/write_img.png"),
    backgroundColor: "#0033cc"
  },
  {
    key: "somethun1",
    title: "Title 6",
    image: require("../assets/images/wallet_creation_img.png"),
    backgroundColor: "#9900ff"
  }
];

export default () => {
  const introSliderDoneFunc = useIntroSliderDone(); //wallet exist 상태 변경
  const onPressDone = () => {
    Toast.show("리시브에 오신 것을 환영합니다!");
    introSliderDoneFunc();
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    );
  };
  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: "transparent" }}
          onPress={() => onPressDone()}
        />
      </View>
    );
  };
  return (
    <AppIntroSlider
      slides={slides}
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
    />
  );
};
