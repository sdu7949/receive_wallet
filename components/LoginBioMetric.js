import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as LocalAuthentication from "expo-local-authentication";
import { ActivityIndicator, Vibration, AsyncStorage } from "react-native";
import BioMetricComponent from "../components/BioMetricComponent";
import constants from "../constants";
import PinView from "react-native-pin-view";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-tiny-toast";
import { useLogIn } from "../AuthContext";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";

const PINWarpper = styled.View`
  width: ${constants.width};
  height: ${constants.height};
  background-color: ${props => props.theme.backGroundColor};
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

const CREATE_USER_TOKEN = gql`
  mutation createUserToken($id: String!) {
    createUserToken(id: $id)
  }
`;

export default () => {
  const [bioCheckPossible, setBioCheckPossible] = useState(null); //생체인증 가능 여부 (null : 로딩, false : 2차비밀번호 input, true : 지문인식)
  const [bioCheck, setBioCheck] = useState(null); //생체인증 성공 여부
  const [PINnumValue, setPINnumValue] = useState(null); //PINcode 값 가져오기 (PIN 존재 여부도 확인)
  const [fingerCheck, setFingerCheck] = useState(0); //첫번째 입력실패 진동 막기
  const [createUserTokenMutation] = useMutation(CREATE_USER_TOKEN);
  const login = useLogIn();
  const getAsyncStorage = async () => {
    const PINnumValue = await SecureStore.getItemAsync("PINcode");
    setPINnumValue(PINnumValue);
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
    console.log(
      "useAuthenticationPossible : ",
      useAuthenticationPossible,
      typeof useAuthenticationPossible
    );
    console.log(
      "alreadyAuthenticatie : ",
      alreadyAuthenticatie,
      typeof alreadyAuthenticatie
    );
    setBioCheckPossible(true);
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
      bioCheckDone();
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
    //console.log("result : ", result.success);
    if (result.success) {
      Vibration.vibrate(200);
      setBioCheck(true);
      bioCheckDone();
    } else if (result.success === false) {
      //지문인식 재실행
      if (fingerCheck > 0) {
        Vibration.vibrate(200);
        setFingerCheck(1);
      }
      setBioCheck(false);
    }
  };

  useEffect(() => {
    getAsyncStorage();
  }, []);

  const bioCheckDone = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const {
      data: { createUserToken }
    } = await createUserTokenMutation({
      variables: {
        id: userId
      }
    });
    console.log("createUserToken : ", createUserToken);
    if (
      createUserToken !== undefined &&
      createUserToken !== "" &&
      createUserToken !== "false" &&
      createUserToken !== false
    ) {
      Toast.show("로그인 성공");
      setTimeout(() => {
        login(createUserToken);
      }, 500);
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
          <Text>PIN 로그인</Text>
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

  return (
    <Wrapper>
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
              text={`로그인을 위해\n등록된 손가락을 올려주세요`}
              type={false}
            ></BioMetricComponent>
          </FingerPrintView>
        </>
      ) : bioCheck ? ( //지문인식 성공
        <>
          <FingerPrintView>
            <BioMetricComponent
              text={`지문인식 로그인`}
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
