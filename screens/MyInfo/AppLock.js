import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AsyncStorage, BackHandler } from "react-native";
import { Switch } from "react-native-switch";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import Toast from "react-native-tiny-toast";

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

const Container = styled.View`
  height: 55px;
  justify-content: center;
  margin-left: 3%;
`;

const HeaderText = styled.Text`
  color: white;
  text-align: left;
  font-weight: 600;
  margin-top: 8%;
  margin-bottom: 5%;
  margin-left: 5%;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-top: 2;
  background-color: ${props => props.theme.subColor};
  align-items: center;
  position: relative;
`;
const ButtonText = styled.Text`
  color: white;
`;

const SwitchWrapper = styled.View`
  position: absolute;
  right: 10;
`;

const Text = styled.Text`
  color: white;
`;

const View = styled.View`
  height: 30;
  justify-content: center;
  align-items: center;
`;

export default ({ navigation }) => {
  const [authType, setAuthType] = useState("pin");

  const getAsyncStorage = async () => {
    const authType = await AsyncStorage.getItem("authType");
    let useAuthenticationPossible = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (useAuthenticationPossible[0] !== 1) {
      Toast.show("지문인식을 지원하지 않는 기기\nPIN으로 고정됩니다.");
    }
    setAuthType(authType);
  };
  useEffect(() => {
    getAsyncStorage();
  }, []);

  const toggleSwitch = async () => {
    if (authType === "bio") {
      //true
      setAuthType("pin");
    } else {
      //false
      setAuthType("bio");
    }
  };

  //on/off 설정을 안하고 뒤로가기 누를때 그냥 tabNavigation으로 이동
  const justBackButtonHandler = async () => {
    setTimeout(() => {
      navigation.navigate("TabNavigation");
    }, 300);
  };

  //on/off 설정을 마친 후 뒤로가기 누를때 AsyncStorage authType 값을 바꿈
  const backButtonHandler = async () => {
    await AsyncStorage.setItem("authType", authType);
    Toast.show("변경 사항이 저장되었습니다");
    setTimeout(() => {
      navigation.navigate("TabNavigation");
    }, 300);
  };

  useEffect(() => {
    if (authType !== null) {
      BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
      return async () => {
        await BackHandler.removeEventListener(
          "hardwareBackPress",
          backButtonHandler
        );
      };
    } else {
      BackHandler.addEventListener("hardwareBackPress", justBackButtonHandler);
      return async () => {
        await BackHandler.removeEventListener(
          "hardwareBackPress",
          justBackButtonHandler
        );
      };
    }
  }, [authType]);

  return (
    <>
      <Wrapper>
        <HeaderText>앱 잠금 설정</HeaderText>
        <ButtonWrapper>
          <Container>
            <ButtonText>지문인증 사용하기</ButtonText>
          </Container>
          <SwitchWrapper>
            <Switch
              value={authType === "bio" ? true : false}
              onValueChange={() => {
                toggleSwitch();
              }}
              backgroundActive={"#555363"}
              backgroundInactive={"#555363"}
              renderInsideCircle={() =>
                authType === "bio" ? (
                  <LinearGradient
                    style={{ borderRadius: 100, width: 50, height: 30 }}
                    colors={["#5d4be3", "#709bff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View>
                      <Text>{authType === "bio" ? "On" : "Off"}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    style={{ borderRadius: 100, width: 50, height: 30 }}
                    colors={["#666666", "#666666"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View>
                      <Text>{authType === "bio" ? "On" : "Off"}</Text>
                    </View>
                  </LinearGradient>
                )
              }
            />
          </SwitchWrapper>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};
