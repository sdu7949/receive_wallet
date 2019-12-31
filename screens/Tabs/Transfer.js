import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import HoldingCoinBox from "../../components/HoldingCoinBox";
import CoinInputBox from "../../components/CoinInputBox";
import CoinButton from "../../components/CoinButton";
import constants from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "react-navigation-stack";
import Toast from "react-native-tiny-toast";

const Warpper = styled.View`
  width: ${constants.width};
  height: ${constants.height};
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const View = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
  /* justify-content:flex-end; */
  padding-bottom: 2%;
`;

const CoinText = styled.Text`
  color: white;
  text-align: left;
  font-weight: 600;
  margin-top: 8%;
  margin-left: 5%;
`;

const ButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const ButtonContainerWarpper = styled.View`
  align-items: center;
  position: absolute;
  top: ${constants.height - 240};
  left: 5%;
`;

const NextButtonContainer = styled.View`
  width: ${constants.width * 0.9};
`;

const Touchable = styled.TouchableOpacity`
  /* flex: 1; */
  justify-content: flex-end;
`;

export default ({ navigation }) => {
  const [coinValue, setCoinValue] = useState(""); //코인 input 값
  const [coinAlready, setCoinAlready] = useState(false); //코인 input값이 ""인지 아닌지 체크
  const [modalVisible, setModalVisible] = useState(false); //Modal 보일지 말지 정함
  const [assertCoinValue, setAssertCoinValue] = useState(null); //보유코인을 넘어선 입력값을 제한하기 위함

  const handleCoinValueCheck = value => {
    if (
      assertCoinValue !== null &&
      assertCoinValue !== undefined &&
      assertCoinValue / 1000 >= value
    ) {
      setCoinValue(value);
    } else {
      Toast.show("입력 값을 확인해주세요");
      return false;
    }
  };
  const handleCoin = value => {
    let val = 0;
    if (coinValue !== "") {
      val = parseInt(coinValue);
    }
    if (
      assertCoinValue !== null &&
      assertCoinValue !== undefined &&
      assertCoinValue / 1000 >= val + parseInt(value)
    ) {
      setCoinValue(c =>
        c == ""
          ? String(parseInt(0) + parseInt(value))
          : String(parseInt(c) + parseInt(value))
      );
    } else {
      Toast.show("보유 코인을 초과한 값을 입력할 수 없습니다");
      return false;
    }
  };

  const navigateFunc = locate => {
    setModalVisible(!modalVisible);
    if ("TransferSecond") {
      navigation.navigate(locate, {
        coinValue
      });
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (coinValue > 0) {
      setCoinAlready(true);
    } else {
      setCoinAlready(false);
    }
  }, [coinValue]);
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Header.HEIGHT + 25}
      behavior="padding"
      style={{ height: constants.height, backgroundColor: "#0b081f" }}
    >
      <ScrollView style={{ height: constants.height }}>
        <Warpper>
          <HoldingCoinBox
            assertCoinValue={assertCoinValue}
            setAssertCoinValue={setAssertCoinValue}
          ></HoldingCoinBox>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* onPress={Keyboard.dismiss} */}
            <>
              <View>
                <>
                  <CoinText>수량 입력</CoinText>
                  <CoinInputBox
                    value={coinValue}
                    onChange={value => handleCoinValueCheck(value)}
                    keyboardType="numeric"
                    returnKeyType="send"
                    autoCorrect={false}
                  ></CoinInputBox>
                  <ButtonContainer>
                    <CoinButton
                      text={"100"}
                      onPress={() => handleCoin(100)}
                    ></CoinButton>
                    <CoinButton
                      text={"500"}
                      onPress={() => handleCoin(500)}
                    ></CoinButton>
                    <CoinButton
                      text={"1000"}
                      onPress={() => handleCoin(1000)}
                    ></CoinButton>
                    <CoinButton
                      text={"5000"}
                      onPress={() => handleCoin(5000)}
                    ></CoinButton>
                  </ButtonContainer>
                </>
              </View>
              {coinAlready ? (
                <ButtonContainerWarpper>
                  <NextButtonContainer>
                    <Touchable
                      onPress={() => {
                        // setCoinAlready(false);
                        navigateFunc("TransferSecond");
                      }}
                    >
                      <LinearGradient
                        style={{ borderRadius: 10 }}
                        colors={["#5d4be3", "#709bff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Container>
                          <ButtonText>코인 입력 완료</ButtonText>
                        </Container>
                      </LinearGradient>
                    </Touchable>
                  </NextButtonContainer>
                </ButtonContainerWarpper>
              ) : (
                <></>
              )}
            </>
          </TouchableWithoutFeedback>
        </Warpper>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
