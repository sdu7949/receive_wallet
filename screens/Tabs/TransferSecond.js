import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Vibration,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import HoldingCoinBox from "../../components/HoldingCoinBox";
import constants from "../../constants";
import AddressInputBox from "../../components/AddressInputBox";
import useInput from "../../hooks/useInput";
import Modal from "react-native-modal";
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

const CancelButtonText = styled.Text`
  color: black;
  text-align: center;
  font-size: 17px;
`;

const ButtonContainerWarpper = styled.View`
  align-items: center;
  position: absolute;
  top: ${constants.height - 200};
  left: 5%;
`;

const NextButtonContainer = styled.View`
  width: ${constants.width * 0.9};
`;

const Touchable = styled.TouchableOpacity`
  /* flex: 1; */
  justify-content: flex-end;
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

export default ({ navigation }) => {
  const addressValue = useInput(""); //주소 input 값
  const coinValue = navigation.getParam("coinValue");
  const [addressAlready, setAddressAlready] = useState(false); //두번째 "다음" 버튼을 눌렀는지 체크
  const [modalVisible, setModalVisible] = useState(false); //Modal 보일지 말지 정함
  const [assertCoinValue, setAssertCoinValue] = useState(null); //보유코인을 넘어선 입력값을 제한하기 위함

  const handleAddress = async () => {
    const { value } = addressValue;
    const hexRegex = /^0x[a-fA-F0-9]{40}$/g;
    if (value === "") {
      Vibration.vibrate(200);
      Toast.show("지갑 주소를 입력하세요");
      setAddressAlready(false);
      return false;
    } else if (!hexRegex.test(value)) {
      Vibration.vibrate(200);
      Toast.show("지갑 주소 형식이 아닙니다");
      setAddressAlready(false);
      return false;
    } else {
      //console.log('올바른 주소 입력');
      setAddressAlready(true);
      return true;
    }
  };

  const handleModal = async () => {
    const checkResult = await handleAddress();
    if (checkResult) {
      setModalVisible(!modalVisible); //ModalVisible값이 현재의 반대로 바뀜
    }
  };

  const navigateFunc = () => {
    setModalVisible(!modalVisible);
    setTimeout(() => {
      navigation.navigate("BioMetric", {
        routeName: "Transfer",
        addressValue: addressValue.value,
        coinValue
      });
    }, 500);
  };

  useEffect(() => {}, []);

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
                  <CoinText>주소 입력</CoinText>
                  <AddressInputBox
                    {...addressValue}
                    keyboardType="email-address"
                    returnKeyType="send" //props? 같은 느낌인가
                    autoCorrect={false} //맞춤법
                    onSubmitEditing={handleAddress}
                  ></AddressInputBox>
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
                      <ModalText>{`받는 계정이 맞나요?\n(${addressValue.value})`}</ModalText>
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
              {addressAlready ? (
                <ButtonContainerWarpper>
                  <NextButtonContainer>
                    <Touchable onPress={() => handleModal()}>
                      <LinearGradient
                        style={{ borderRadius: 10 }}
                        colors={["#5d4be3", "#709bff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Container>
                          <ButtonText>주소 입력 완료</ButtonText>
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
