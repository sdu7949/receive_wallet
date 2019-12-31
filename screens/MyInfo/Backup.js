import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ActivityIndicator, Clipboard, BackHandler } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TextInput } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import constants from "../../constants";
import Toast from "react-native-tiny-toast";

const ActivityIndicatorWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.View`
  position: relative;
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
  color: white;
`;

const AddressWrapper = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.subColor};
  align-items: center;
`;

const ExplainWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5;
`;

const ExplainText = styled.Text`
  color: #666666;
  margin-left: 3%;
  font-size: 14px;
`;

const AddressText = styled.Text`
  color: white;
  margin-left: 3%;
  font-size: 12px;
`;

const Touchable = styled.TouchableOpacity`
  width: ${constants.width * 0.95};
`;

const MiniTouchable = styled.TouchableOpacity`
  position: absolute;
  right: 5;
  top: -5;
`;

const MiniContainer = styled.View`
  width: 50;
  height: 30;
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const ButtonText = styled.Text`
  color: white;
`;

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const Text = styled.Text`
  color: white;
`;

const KeyWrapper = styled.View`
  margin-top: 10%;
  margin-left: 40;
  margin-right: 15;
`;

const KeyButtonWrapper = styled.View`
  flex-direction: row;
  position: relative;
  margin-bottom: 15;
`;

const KeyValueWrapper = styled.View`
  height: ${constants.height * 0.25};
  border-top-width: 1px;
  border-top-color: ${props => props.theme.subColor};
`;

const ButtonWrapper = styled.View`
  width: ${constants.width};
  position: absolute;
  bottom: 2%;
  align-items: center;
`;

export default ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [secureDataValue, setSecureDataValue] = useState(null);
  const type = navigation.getParam("type");
  const getAsyncStorage = async () => {
    const secureData = await SecureStore.getItemAsync("secureData");
    const parseSecureData = JSON.parse(secureData);
    // console.log(parseSecureData.mnemonic);
    setSecureDataValue(parseSecureData);
  };
  useEffect(() => {
    getAsyncStorage();
    BackHandler.addEventListener("hardwareBackPress", justBackButtonHandler);
    return async () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        justBackButtonHandler
      );
    };
  }, []);
  const justBackButtonHandler = async () => {
    setTimeout(() => {
      navigation.navigate("TabNavigation");
    }, 300);
  };
  return (
    <>
      {secureDataValue === null ? (
        <>
          <ActivityIndicatorWrapper>
            <ActivityIndicator size="large" color="white" />
          </ActivityIndicatorWrapper>
        </>
      ) : (
        <>
          {type === "Private" ? (
            <>
              <Wrapper>
                <AddressWrapper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/backup_wallet_icon.png")}
                  />
                  <AddressText>{secureDataValue.address}</AddressText>
                </AddressWrapper>
                <KeyWrapper>
                  <KeyButtonWrapper>
                    <Text>KEY 정보</Text>
                    <MiniTouchable
                      onPress={() => {
                        setIsVisible(!isVisible);
                      }}
                    >
                      <LinearGradient
                        style={{ borderRadius: 10 }}
                        colors={["#5d4be3", "#709bff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <MiniContainer>
                          <ButtonText>보기</ButtonText>
                        </MiniContainer>
                      </LinearGradient>
                    </MiniTouchable>
                  </KeyButtonWrapper>
                  <KeyValueWrapper>
                    <TextInput
                      editable={false}
                      multiline={true}
                      style={
                        isVisible
                          ? { color: "white", fontSize: 20 }
                          : { color: "#666666", fontSize: 30 }
                      }
                      secureTextEntry={!isVisible}
                    >
                      {secureDataValue.privateKey}
                    </TextInput>
                  </KeyValueWrapper>
                </KeyWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/backup_camera_icon.png")}
                  />
                  <ExplainText>{`프라이빗 키 정보를 캡쳐해서 보관하는 것은 안전하지\n않습니다. 생성된 프라이빗 키 정보를 안전하게 보관하는\n것을 권장합니다`}</ExplainText>
                </ExplainWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/backup_shield_icon.png")}
                  />
                  <ExplainText>{`BBOOMCOIN은 유저의 프라이빗 키 정보를 절대\n 수집하지 앖습니다`}</ExplainText>
                </ExplainWrapper>
                <ButtonWrapper>
                  <Touchable
                    onPress={() => {
                      Clipboard.setString(secureDataValue.privateKey);
                      setToastMsg("클립보드에 복사되었습니다");
                      setToastVisible(true);
                      setTimeout(() => setToastVisible(false), 2500);
                    }}
                  >
                    <LinearGradient
                      style={{ borderRadius: 10 }}
                      colors={["#5d4be3", "#709bff"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Container>
                        <ButtonText>KEY 정보 백업</ButtonText>
                      </Container>
                    </LinearGradient>
                  </Touchable>
                </ButtonWrapper>
              </Wrapper>
            </>
          ) : (
            <>
              <Wrapper>
                <AddressWrapper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/backup_wallet_icon.png")}
                  />
                  <AddressText>{secureDataValue.address}</AddressText>
                </AddressWrapper>
                <KeyWrapper>
                  <KeyButtonWrapper>
                    <Text>니모닉 단어 정보</Text>
                    <MiniTouchable
                      onPress={() => {
                        setIsVisible(!isVisible);
                      }}
                    >
                      <LinearGradient
                        style={{ borderRadius: 10 }}
                        colors={["#5d4be3", "#709bff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <MiniContainer>
                          <ButtonText>보기</ButtonText>
                        </MiniContainer>
                      </LinearGradient>
                    </MiniTouchable>
                  </KeyButtonWrapper>
                  <KeyValueWrapper>
                    <TextInput
                      editable={false}
                      multiline={true}
                      style={
                        isVisible
                          ? { color: "white", fontSize: 20 }
                          : { color: "#666666", fontSize: 30 }
                      }
                      secureTextEntry={!isVisible}
                    >
                      {secureDataValue.mnemonic}
                    </TextInput>
                  </KeyValueWrapper>
                </KeyWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/backup_camera_icon.png")}
                  />
                  <ExplainText>{`니모닉 단어 정보를 캡쳐해서 보관하는 것은 안전하지\n 않습니다. 생성된 니모닉 단어 정보를 안전하게 보관하는\n것을 권장합니다`}</ExplainText>
                </ExplainWrapper>
                <ExplainWrapper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../../assets/images/backup_shield_icon.png")}
                  />
                  <ExplainText>{`BBOOMCOIN은 유저의 니모닉 단어 정보를 절대\n 수집하지 앖습니다`}</ExplainText>
                </ExplainWrapper>
                <ButtonWrapper>
                  <Touchable
                    onPress={() => {
                      Clipboard.setString(secureDataValue.mnemonic);
                      // Toast.show("클립보드에 복사되었습니다");
                    }}
                  >
                    <LinearGradient
                      style={{ borderRadius: 10 }}
                      colors={["#5d4be3", "#709bff"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Container>
                        <ButtonText>니모닉 단어 백업</ButtonText>
                      </Container>
                    </LinearGradient>
                  </Touchable>
                </ButtonWrapper>
              </Wrapper>
            </>
          )}
        </>
      )}
    </>
  );
};
