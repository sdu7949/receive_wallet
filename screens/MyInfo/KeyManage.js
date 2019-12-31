import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-tiny-toast";

const Image = styled.Image`
  width: 30;
  margin-left: 3%;
`;

const ArrowImage = styled.Image`
  width: 20;
  position: absolute;
  top: 9;
  right: 10;
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

const ButtonText = styled.Text`
  color: white;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

const ButtonWrapper = styled.View`
  margin-top: 2;
  background-color: ${props => props.theme.subColor};
`;

const Touchable = styled.TouchableOpacity`
  flex-direction: row;
  position: relative;
`;

export default ({ navigation }) => {
  const [mnemonicExist, setMnemonicExist] = useState(null);

  const getAsyncStorage = async () => {
    const secureData = await SecureStore.getItemAsync("secureData");
    const parseSecureData = JSON.parse(secureData);
    if (
      parseSecureData.mnemonic !== undefined &&
      parseSecureData.mnemonic !== null
    ) {
      setMnemonicExist(true);
    } else {
      setMnemonicExist(false);
    }
  };
  useEffect(() => {
    getAsyncStorage();
  }, []);

  const mnemonicNotExist = () => {
    if (mnemonicExist) {
      return (
        <ButtonWrapper>
          <Touchable
            transparent
            iconLeft
            large
            block
            onPress={() =>
              navigation.navigate("BioMetric", {
                routeName: "Backup",
                type: "Mnemonic"
              })
            }
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/mnemonic_icon.png")}
            />
            <Container>
              <ButtonText>니모닉 단어 백업</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/back_btn_icon.png")}
            />
          </Touchable>
        </ButtonWrapper>
      );
    } else if (mnemonicExist === false) {
      Toast.show("기기에 니모닉 단어가 저장되어있지 않습니다");
    }
  };

  return (
    <>
      <Wrapper>
        <HeaderText>키 관리</HeaderText>
        <ButtonWrapper>
          <Touchable
            onPress={() =>
              navigation.navigate("BioMetric", {
                routeName: "Backup",
                type: "Private"
              })
            }
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/privatekey_icon.png")}
            />
            <Container>
              <ButtonText>프라이빗 키 백업</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/back_btn_icon.png")}
            />
          </Touchable>
        </ButtonWrapper>
        {mnemonicNotExist()}
      </Wrapper>
    </>
  );
};
