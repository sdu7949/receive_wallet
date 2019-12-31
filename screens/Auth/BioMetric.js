import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as LocalAuthentication from "expo-local-authentication";
import { ActivityIndicator, Vibration, AsyncStorage } from "react-native";
import BioMetricComponent from "../../components/BioMetricComponent";
import constants from "../../constants";
import Modal from "react-native-modal";
import { NavigationActions, StackActions } from "react-navigation";
import PinView from "react-native-pin-view";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import Toast from "react-native-tiny-toast";

const PINWarpper = styled.View`
  width: ${constants.width};
  height: ${constants.height};
  background-color: ${props => props.theme.backGroundColor};
`;

const ModalView = styled.View`
  background-color: white;
  width: ${constants.width * 0.8};
  height: ${constants.height * 0.4};
  align-items: center;
  border-radius: 10px;
`;

const ModalButtonContainer = styled.View`
  justify-content: flex-end;
  flex: 1;
  flex-direction: row;
`;

const ModalTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const ModalWarpper = styled.View`
  align-items: center;
`;

const ModalImage = styled.Image`
  width: 20%;
`;

const ModalTextHeader = styled.Text`
  color: black;
  text-align: center;
  font-size: 17px;
`;

const ModalText = styled.Text`
  color: black;
  text-align: center;
  font-size: 14px;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const FingerPrintView = styled.View`
  flex: 1;
`;

const IndicatorWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.backGroundColor};
`;

const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;

const View = styled.View`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-size: 20;
  margin-top: 20%;
  margin-bottom: 10%;
`;

const TRANSFER = gql`
  mutation transfer($sender: String!, $receiver: String!, $value: String!) {
    transfer(sender: $sender, receiver: $receiver, value: $value)
  }
`;

const CREATE_PURCHASE = gql`
  mutation createPurchase(
    $id: String!
    $requestAmount: Int!
    $account: String!
  ) {
    createPurchase(id: $id, requestAmount: $requestAmount, account: $account) {
      id
    }
  }
`;

const CREATE_EXCHANGE = gql`
  mutation createExchange(
    $id: String!
    $requestAmount: Int!
    $bank: String!
    $account: String!
    $creditNumber: String!
  ) {
    createExchange(
      id: $id
      requestAmount: $requestAmount
      bank: $bank
      account: $account
      creditNumber: $creditNumber
    ) {
      id
    }
  }
`;

export default ({ navigation }) => {
  let routeName = navigation.getParam("routeName");
  let addressValue = "";
  let coinValue = "";
  let type = "";
  if (routeName === "Transfer") {
    addressValue = navigation.getParam("addressValue");
    coinValue = navigation.getParam("coinValue");
  } else if (routeName === "Backup") {
    type = navigation.getParam("type");
  } else if (routeName === "coinPurchase") {
    coinValue = navigation.getParam("coinValue");
    nickName = navigation.getParam("nickName");
  } else if (routeName === "coinExchange") {
    coinValue = navigation.getParam("coinValue");
    withdrawal = navigation.getParam("withdrawal");
    creditNumber = navigation.getParam("creditNumber");
    bank = navigation.getParam("bank");
  }
  const [bioCheckPossible, setBioCheckPossible] = useState(null); //생체인증 가능 여부 (null : 로딩, false : 2차비밀번호 input, true : 지문인식)
  const [bioCheck, setBioCheck] = useState(null); //생체인증 성공 여부
  const [modalVisible, setModalVisible] = useState(false); //Modal 보일지 말지 정함
  const [PINnumValue, setPINnumValue] = useState(null); //PINcode 값 가져오기 (PIN 존재 여부도 확인)
  const [fingerCheck, setFingerCheck] = useState(0); //첫번째 입력실패 진동 막기
  const [walletAddress, setWalletAddress] = useState("");
  const [userId, setUserId] = useState(null);
  const [transferMutation] = useMutation(TRANSFER);
  const [createPurchaseMutation] = useMutation(CREATE_PURCHASE);
  const [createExchangeMutation] = useMutation(CREATE_EXCHANGE);

  const getAsyncStorage = async () => {
    const PINnumValue = await SecureStore.getItemAsync("PINcode");
    const walletStr = await AsyncStorage.getItem("WALLETS");
    const userId = await AsyncStorage.getItem("userId");
    const wallet = JSON.parse(walletStr);
    setWalletAddress(wallet.address);
    setPINnumValue(PINnumValue);
    setUserId(userId);
    await bioMetricStart();
  };

  const bioMetricStart = async () => {
    const useAuthenticationPossible = await AsyncStorage.getItem(
      "useAuthenticationPossible"
    );
    const alreadyAuthenticatie = await AsyncStorage.getItem(
      "alreadyAuthenticatie"
    );
    const authType = await AsyncStorage.getItem("authType");

    if (useAuthenticationPossible[0] === "1") {
      if (alreadyAuthenticatie === "true") {
        if (authType === "bio") {
          setBioCheckPossible(true);
          bioMetric();
        } else {
          // 지문인식 Off
          setBioCheckPossible(false);
        }
      } else {
        //저장된 지문 없음
        setBioCheckPossible(false);
        Toast.show("저장된 지문이 없습니다 \n PIN을 입력해 주세요");
      }
    } else {
      //지문 인식 미지원
      setBioCheckPossible(false);
    }
  };

  const pinComplete = async (inputtedPin, clear) => {
    //console.log(inputtedPin)
    if (inputtedPin !== PINnumValue) {
      //console.log("Pin is not correct")
      Vibration.vibrate(200);
      Toast.show("PIN 입력 실패");
      clear();
    } else {
      //console.log("Pin is correct")
      Vibration.vibrate(200);
      clear();
      handleModal();
    }
  };

  const pinCreate = async (inputtedPin, clear) => {
    //console.log(inputtedPin)
    //console.log("Pin create start")\
    Toast.show("다음으로 진행하기위해 PIN을 입력해주세요");
    await SecureStore.setItemAsync("PINcode", inputtedPin);
    setPINnumValue(inputtedPin);
    clear();
  };

  const bioMetric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Touch ID를 인식합니다"
    });
    // console.log("result : ", result.success);
    if (result.success) {
      Vibration.vibrate(200);
      setBioCheck(true);
      //송금 스마트 컨트랙트 사용, 모달 생성 => 모달확인 후 코인내역 screen 이동
    } else if (result.success === false) {
      //지문인식 재실행
      if (fingerCheck > 0) {
        Vibration.vibrate(200);
        setFingerCheck(1);
      }
      setBioCheck(false);
    }
    LocalAuthentication.cancelAuthenticate();
  };

  const handleModal = () => {
    if (addressValue === "" && coinValue === "") {
      //Transfer에서 건나온게 아닌경우
      bioCheckDone();
    } else {
      setModalVisible(!modalVisible); //ModalVisible값이 현재의 반대로 바뀜
    }
  };
  useEffect(() => {
    getAsyncStorage();
  }, []);

  useEffect(() => {
    if (bioCheck) {
      //송금 컨트랙트 완료, 구매신청 완료, 환전신청 완료 모달 생성
      handleModal();
    }
  }, [bioCheck]);

  const bioCheckDone = async () => {
    if (routeName === "Transfer") {
      // 송금 트랜잭션을 해보쟈
      if (walletAddress !== "") {
        transferMutation({
          variables: {
            sender: walletAddress,
            receiver: addressValue,
            value: coinValue
          }
        });
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "TabNavigation" })]
        });
        navigation.dispatch(resetAction);
      } else {
        Toast.show("잠시후 다시 시도해야 합니다");
        return false;
      }
    } else if (routeName === "Backup") {
      navigation.navigate(routeName, {
        type: type
      });
    } else if (routeName === "AppLock") {
      navigation.navigate(routeName);
    } else if (routeName === "InvestCondition") {
      navigation.navigate(routeName);
    } else if (routeName === "coinPurchase") {
      //구매신청 내역 추가 gql
      const {
        data: { id }
      } = await createPurchaseMutation({
        variables: {
          id: userId,
          requestAmount: parseInt(coinValue),
          account: nickName
        }
      });
      console.log("createPurchase : ", id);
      handleModal();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "TabNavigation" })]
      });
      navigation.dispatch(resetAction);
    } else if (routeName === "coinExchange") {
      const { data } = await createExchangeMutation({
        variables: {
          id: userId,
          requestAmount: parseInt(coinValue),
          account: withdrawal,
          creditNumber,
          bank
        }
      });
      console.log("createExchange : ", data);
      handleModal();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "TabNavigation" })]
      });
      navigation.dispatch(resetAction);
    }
  };

  renderSection = () => {
    if (PINnumValue === null) {
      setTimeout(() => {
        Toast.show("등록된 PIN이 없습니다. PIN을 생성해주세요");
      }, 2500);
      return (
        <PINWarpper>
          <Text>PIN 번호 생성</Text>
          <PinView
            buttonBgColor="#242136"
            buttonTextColor="white"
            inputBgColor="white"
            inputActiveBgColor="white"
            onComplete={pinCreate}
            pinLength={6}
          />
        </PINWarpper>
      );
    } else {
      return (
        <PINWarpper>
          <Text>PIN 번호 확인</Text>
          <PinView
            buttonBgColor="#242136"
            buttonTextColor="white"
            inputBgColor="white"
            inputActiveBgColor="white"
            onComplete={pinComplete}
            pinLength={6}
          />
        </PINWarpper>
      );
    }
  };

  renderModal = () => {
    if (routeName === "Transfer") {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView>
              <ModalImage
                style={{ resizeMode: "contain" }}
                source={require("../../assets/images/transmission_popup_icon.png")}
              ></ModalImage>
              <ModalTextHeader>{`전송요청`}</ModalTextHeader>
              <ModalText>{`(${addressValue})\n${coinValue}Coin 전송 요청`}</ModalText>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <LinearGradient
                    style={{
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10
                    }}
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
      );
    } else if (routeName === "coinPurchase") {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView>
              <ModalImage
                style={{ resizeMode: "contain" }}
                source={require("../../assets/images/transmission_popup_icon.png")}
              ></ModalImage>
              <ModalTextHeader>{`구매 신청 완료`}</ModalTextHeader>
              <ModalText>{`로디언즈 계좌 \n 000-00000-0000으로\n${coinValue}원을 입금하세요`}</ModalText>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <LinearGradient
                    style={{
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10
                    }}
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
      );
    } else if (routeName === "coinExchange") {
      return (
        <Modal isVisible={modalVisible}>
          <ModalWarpper>
            <ModalView>
              <ModalImage
                style={{ resizeMode: "contain" }}
                source={require("../../assets/images/transmission_popup_icon.png")}
              ></ModalImage>
              <ModalTextHeader>{`환저 신청 완료`}</ModalTextHeader>
              <ModalText>{`로디언즈에서 코인 송금을 확인 후, 출금해드립니다.`}</ModalText>
              <ModalButtonContainer>
                <ModalTouchable onPress={() => bioCheckDone()}>
                  <LinearGradient
                    style={{
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10
                    }}
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
      );
    } else {
      return <></>;
    }
  };

  return (
    <Wrapper>
      {renderModal()}
      {bioCheckPossible === null ? ( //  지문인식 가능한지 로딩
        <>
          <IndicatorWrapper>
            <Touchable disabled={false}>
              <ActivityIndicator size={"large"} color={"white"} />
            </Touchable>
          </IndicatorWrapper>
        </>
      ) : !bioCheckPossible ? ( //  지문인식 불가 (PIN화면)
        <View
          style={{
            flex: 1,
            backgroundColor: "#f1f1f1",
            justifyContent: "center"
          }}
        >
          {renderSection()}
        </View>
      ) : bioCheck === null ? ( //지문인식 체크화면
        <>
          <FingerPrintView>
            <BioMetricComponent
              text={`지문 인식을 위해\n등록된 손가락을 올려주세요`}
              type={false}
            ></BioMetricComponent>
          </FingerPrintView>
        </>
      ) : bioCheck ? ( //지문인식 성공
        <>
          <FingerPrintView>
            <BioMetricComponent
              text={`지문인식\n성공`}
              type={false}
            ></BioMetricComponent>
          </FingerPrintView>
        </>
      ) : (
        //재입력 버튼
        <>
          <FingerPrintView>
            <BioMetricComponent
              text={`인증 실패\n지문 아이콘을 터치하고 다시 인식하세요`}
              type={true}
              setBioCheck={setBioCheck}
              bioMetric={bioMetric}
            ></BioMetricComponent>
          </FingerPrintView>
        </>
      )}
    </Wrapper>
  );
};
