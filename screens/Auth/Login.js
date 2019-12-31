import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard, Vibration } from "react-native";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import constants from "../../constants";
import { gql } from "apollo-boost";
import { useLogIn } from "../../AuthContext";
import Toast from "react-native-tiny-toast";

const LOG_IN = gql`
  mutation createToken($email: String!, $password: String!) {
    createToken(email: $email, password: $password)
  }
`;

const Image = styled.Image`
  width: ${constants.width * 0.6};
  margin-top: 15%;
  /* margin-bottom : 10%; */
`;

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

export default () => {
  const emailInput = useInput("");
  const passwordInput = useInput("");
  const login = useLogIn();
  const [loading, setLoading] = useState(false);
  const [createTokenMutation] = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value,
      password: passwordInput.value
    }
  });

  const idCheck = async () => {
    const { value } = emailInput;
    console.log(value);
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      Vibration.vibrate(150);
      Toast.show("이메일을 입력하세요");
      return false;
    } else if (!value.includes("@") || !value.includes(".")) {
      Vibration.vibrate(150);
      Toast.show("이메일 형식을 맞춰주세요");
      return false;
    } else if (!emailRegex.test(value)) {
      Vibration.vibrate(150);
      Toast.show("이메일 형식을 맞춰주세요");
      return false;
    }
  };

  const pwCheck = async () => {
    const { value } = passwordInput;
    console.log(value);
    if (value === "") {
      Vibration.vibrate(150);
      Toast.show("비밀번호를 입력하세요");
    }
    return false;
  };

  const loginTry = async () => {
    try {
      setLoading(true);
      const {
        data: { createToken }
      } = await createTokenMutation();
      if (
        createToken !== undefined &&
        createToken !== "" &&
        createToken !== "false" &&
        createToken !== false
      ) {
        Toast.show("로그인 성공");
        setTimeout(() => {
          login(createToken);
        }, 1000);
      } else {
        Vibration.vibrate(150);
        Toast.show("계정 정보가 올바르지 않습니다");
      }
    } catch (error) {
      Vibration.vibrate(150);
      Toast.show("로그인 실패");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("../../assets/images/bboomcoin_login_logo.png")}
        />
        <AuthInput
          {...emailInput}
          type="ID"
          placeholder="ID"
          returnKeyType="next"
          onSubmitEditing={idCheck}
          autoCorrect={false}
        ></AuthInput>
        <AuthInput
          {...passwordInput}
          type="PW"
          placeholder="PW"
          returnKeyType="next"
          onSubmitEditing={pwCheck}
          autoCorrect={false}
        ></AuthInput>
        <AuthButton
          onPress={() => loginTry()}
          loading={loading}
          text={"로그인"}
        ></AuthButton>
      </View>
    </TouchableWithoutFeedback>
  );
};
