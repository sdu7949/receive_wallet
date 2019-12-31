import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Vibration
} from "react-native";
import CoinInputBox from "../../components/CoinInputBox";
import styled from "styled-components";
import constants from "../../constants";
import Modal from "react-native-modal";
import { Header } from "react-navigation-stack";
import Toast from "react-native-tiny-toast";
import useInput from "../../hooks/useInput";
import { LinearGradient } from "expo-linear-gradient";
import AuthInput from "../../components/AuthInput";

const Warpper = styled.View`
  margin-top: 2%;
  width: ${constants.width};
  height: ${constants.height};
  align-items: center;
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const View = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${props => props.theme.backGroundColor};
  /* justify-content:flex-end; */
  padding-bottom: 2%;
`;

const CoinText = styled.Text`
  color: white;
  text-align: left;
  font-weight: 600;
  margin-top: 3%;
  margin-left: 5%;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const ButtonContainerWarpper = styled.View`
  align-items: center;
  position: absolute;
  /* top: ${constants.height - 240}; */
  bottom : 21%;
  left: 5%;
`;

const NextButtonContainer = styled.View`
  width: ${constants.width * 0.9};
`;

const Touchable = styled.TouchableOpacity`
  /* flex: 1; */
  justify-content: flex-end;
`;

const Image = styled.Image`
  width: ${constants.width * 0.9};
  height: ${constants.width * 0.8};
  /* margin-top: 10%; */
  margin-bottom: 2%;
`;

const ButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ModalView = styled.View`
  background-color: white;
  width: ${constants.width * 0.8};
  height: ${constants.height / 3};
  align-items: center;
  border-radius: 10px;
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalImage = styled.Image`
  width: 17%;
  margin-top: 10px;
`;

const ModalText = styled.Text`
  color: black;
  text-align: center;
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.borderBottomColor};
`;

const CancelButtonText = styled.Text`
  color: black;
  text-align: center;
  font-size: 17px;
`;

export default ({ navigation }) => {
  const [coinValue, setCoinValue] = useState(""); //코인 input 값
  const [coinAlready, setCoinAlready] = useState(false); //코인 input값이 ""인지 아닌지 체크
  const [depositorAlready, setDepositorAlready] = useState(false); //코인 input값이 ""인지 아닌지 체크
  const [modalVisible, setModalVisible] = useState(false); //Modal 보일지 말지 정함
  const depositorInput = useInput("");

  const handleCoin = value => {
    // let val = 0;
    if (value == "") {
      setCoinValue("");
    } else {
      setCoinValue(String(parseInt(value)));
    }
  };

  useEffect(() => {
    if (coinValue > 0) {
      setCoinAlready(true);
    } else {
      setCoinAlready(false);
    }
  }, [coinValue]);

  const handleModal = async () => {
    setModalVisible(!modalVisible); //ModalVisible값이 현재의 반대로 바뀜
  };

  const navigateFunc = () => {
    setModalVisible(!modalVisible);
    // 일단 바이오 매트릭을 거치는 걸로 해보자 ※환전에서 어차피 써먹어야하기 때문
    setTimeout(() => {
      navigation.navigate("BioMetric", {
        routeName: "coinPurchase",
        coinValue,
        //입금자명ㄹㄹ
        nickName: depositorInput.value
      });
    }, 500);
  };

  const idCheck = async () => {
    const { value } = depositorInput;
    // console.log(value);
    const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (value === "") {
      Vibration.vibrate(150);
      Toast.show("입금자를 입력하세요");
      return false;
    } else if (!check.test(value)) {
      Vibration.vibrate(150);
      Toast.show("한글로 입력해주세요");
      return false;
    } else {
      setDepositorAlready(true);
    }
  };

  renderButton = () => {
    if (coinAlready && depositorAlready) {
      return (
        <ButtonContainerWarpper>
          <NextButtonContainer>
            <Touchable
              onPress={() => {
                // 코인 구매 Modal handle
                handleModal();
              }}
            >
              <LinearGradient
                style={{ borderRadius: 10 }}
                colors={["#5d4be3", "#709bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Container>
                  <ButtonText>구매 신청</ButtonText>
                </Container>
              </LinearGradient>
            </Touchable>
          </NextButtonContainer>
        </ButtonContainerWarpper>
      );
    } else {
      return <></>;
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Header.HEIGHT + 25}
      behavior="padding"
      style={{ height: constants.height, backgroundColor: "#0b081f" }}
    >
      <ScrollView style={{ height: constants.height }}>
        <Warpper>
          {/* Image 공간 */}
          <Image
            style={{ resizeMode: "contain" }}
            source={require("../../assets/images/wallet_creation_img.png")}
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* onPress={Keyboard.dismiss} */}
            <>
              <View>
                <>
                  <CoinText>수량 입력</CoinText>
                  <CoinInputBox
                    value={coinValue}
                    onChange={value => handleCoin(value)}
                    keyboardType="numeric"
                    returnKeyType="send"
                    autoCorrect={false}
                  ></CoinInputBox>
                  <AuthInput
                    {...depositorInput}
                    type="ID"
                    placeholder="입금자"
                    returnKeyType="next"
                    onSubmitEditing={idCheck}
                    autoCorrect={false}
                  ></AuthInput>
                  <ButtonContainer></ButtonContainer>
                </>
                <Modal
                  isVisible={modalVisible}
                  onBackdropPress={() => handleModal()}
                >
                  <ModalWarpper>
                    <ModalView>
                      <ModalImage
                        style={{ resizeMode: "contain" }}
                        source={require("../../assets/images/wallet_popup_icon.png")}
                      ></ModalImage>
                      <ModalText>{`${depositorInput.value}님\n구매하려는 코인이 ${coinValue}개가 맞나요?`}</ModalText>
                      <ModalButtonContainer>
                        <ModalTouchable onPress={() => handleModal()}>
                          <ModalContainer>
                            <CancelButtonText>아니요</CancelButtonText>
                          </ModalContainer>
                        </ModalTouchable>
                        <ModalTouchable onPress={() => navigateFunc()}>
                          <LinearGradient
                            style={{ borderBottomRightRadius: 10 }}
                            colors={["#5d4be3", "#709bff"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <ModalContainer>
                              <ButtonText>확인</ButtonText>
                            </ModalContainer>
                          </LinearGradient>
                        </ModalTouchable>
                      </ModalButtonContainer>
                    </ModalView>
                  </ModalWarpper>
                </Modal>
              </View>
              {renderButton()}
            </>
          </TouchableWithoutFeedback>
        </Warpper>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
