import React from "react";
import { Vibration } from "react-native";
import styled from "styled-components";
import constants from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import Toast from "react-native-tiny-toast";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";

const View = styled.View`
  justify-content: center;
  width: ${constants.width * 0.9};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: ${props => props.theme.backGroundColor};
`;

const Image = styled.Image`
  width: ${constants.width * 0.7};
  /* margin-top: 10%; */
  margin-bottom: 5%;
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 2%;
`;

const Container = styled.View`
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const ContainerTwo = styled.View`
  height: 55px;
  background-color: ${props => props.theme.subColor};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  height: 70px;
  color: #bbbbbb;
  text-align: center;
  font-size: 17px;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const NICKNAME_CONFIRM = gql`
  mutation createToken($nickName: String!) {
    nickNameConfirm(nickName: $nickName)
  }
`;

export default ({ navigation, loading = false }) => {
  const nickNameInput = useInput("");
  const [nickNameConfirmMutation] = useMutation(NICKNAME_CONFIRM, {
    variables: {
      nickName: nickNameInput.value
    }
  });
  const idCheck = async val => {
    const { value } = nickNameInput;
    console.log(value);
    const {
      data: { nickNameConfirm }
    } = await nickNameConfirmMutation();
    console.log("nickNameConfirm : ", nickNameConfirm);
    if (value === "") {
      Vibration.vibrate(150);
      Toast.show("닉네임을 입력하세요");
      return false;
    } else if (nickNameConfirm) {
      Vibration.vibrate(150);
      Toast.show("이미 사용중인 닉네임입니다");
      return false;
    } else {
      navigation.navigate(val, {
        nickName: nickNameInput.value
      });
    }
  };

  return (
    <Wrapper>
      <Image
        style={{ resizeMode: "contain" }}
        source={require("../../assets/images/wallet_creation_img.png")}
      />
      <Text>{`보유하신 지갑 또는\n코인을 보관할 새로운 지갑을 생성해 주세요`}</Text>
      <AuthInput
        {...nickNameInput}
        type="ID"
        placeholder="닉네임"
        returnKeyType="next"
        onSubmitEditing={idCheck}
        autoCorrect={false}
      ></AuthInput>
      <View>
        <Touchable
          disabled={loading}
          onPress={() => {
            idCheck("CreateWalletScreen");
          }}
        >
          <LinearGradient
            style={{ borderRadius: 10 }}
            colors={["#5d4be3", "#709bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Container>
              <ButtonText>지갑 생성</ButtonText>
            </Container>
          </LinearGradient>
        </Touchable>
        <Touchable
          disabled={loading}
          onPress={() => {
            idCheck("ImportWalletScreen");
          }}
        >
          <ContainerTwo>
            <ButtonText>지갑 불러오기</ButtonText>
          </ContainerTwo>
        </Touchable>
      </View>
    </Wrapper>
  );
};
