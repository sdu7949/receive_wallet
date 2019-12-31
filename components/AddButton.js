import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Animated, TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import constants from "../constants";
import { useButtonActive, buttonActiveToggle } from "../AuthContext";

const SIZE = 80;

const MainImageWarpper = styled.View`
  flex: 1;
  margin-bottom: 30;
`;

const View = styled.View`
    /* width : ${constants.width};
    height : ${constants.height}; */
`;

const Image = styled.Image`
  width: 23;
`;

export default ({ navigation }) => {
  const buttonActiveValue = useButtonActive();
  const buttonActiveFunc = buttonActiveToggle();

  mode = new Animated.Value(buttonActiveValue); //context 0 or 1
  const toggleView = async type => {
    //type : 토글버튼 자체를 누름 = 0 / 다른 메뉴를 누름(스크린 이동) = 1
    if (type === "button") {
      //토글은 펼쳤다 접었다
      Animated.timing(this.mode, {
        toValue: this.mode._value == 0 ? 1 : 0,
        duration: 300
      }).start();
      setTimeout(() => buttonActiveFunc(), 300); // context값 변경
    } else {
      //메뉴는 무조건 접힘
      Animated.timing(this.mode, {
        toValue: this.mode._value === 0 ? 1 : 0,
        duration: 300
      }).start();
    }
  };

  // if (buttonActiveValue === 1) {    //context
  //     toggleView("menu");
  // }

  const firstX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -40]
  });
  const firstY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30]
  });
  const secondX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 20]
  });
  const secondY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -55]
  });
  const thirdX = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 80]
  });
  const thirdY = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30]
  });
  const opacity = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  const rotation = this.mode.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });
  return (
    <View
      style={{
        position: "absolute",
        alignItems: "center"
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: firstX,
          top: firstY,
          opacity
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: "#ffae00"
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              toggleView("menu");
              setTimeout(() => {
                buttonActiveFunc();
                navigation.navigate("PurchaseRequest");
              }, 270);
            }}
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../assets/images/nav_coin_icon.png")}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          left: secondX,
          top: secondY,
          opacity
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: "#ff6565"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              toggleView("menu");
              setTimeout(() => {
                buttonActiveFunc();
                navigation.navigate("HoldingAssert");
              }, 270);
            }}
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../assets/images/nav_coin_icon.png")}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          left: thirdX,
          top: thirdY,
          opacity
        }}
      >
        <TouchableHighlight
          onPress={() => {}}
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: "#703eff"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              toggleView("menu");
              setTimeout(() => {
                buttonActiveFunc();
                navigation.navigate("CoinHistory");
              }, 270);
            }}
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../assets/images/nav_list_icon.png")}
            />
          </TouchableOpacity>
        </TouchableHighlight>
      </Animated.View>
      <MainImageWarpper>
        <LinearGradient
          style={{ borderRadius: 100 }}
          colors={["#5d4be3", "#709bff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableHighlight
            onPress={() => toggleView("button")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2
            }}
          >
            <Animated.View
              style={{
                transform: [{ rotate: rotation }]
              }}
            >
              <Image
                style={{ resizeMode: "contain" }}
                source={require("../assets/images/nav_list_icon.png")}
              />
            </Animated.View>
          </TouchableHighlight>
        </LinearGradient>
      </MainImageWarpper>
    </View>
  );
};
