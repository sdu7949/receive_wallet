import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SignUpInput from "../../components/SignUpInput";
import CheckBox from "react-native-check-box";
import constants from "../../constants";
import { Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { Header } from "react-navigation-stack";

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const TopBarBox = styled.View`
  flex-direction: row;
`;

const TopBarOn = styled.View`
  flex: 1;
  background-color: #608cf1;
  padding: 2px;
`;
const TopBarOff = styled.View`
  flex: 2;
  background-color: ${props => props.theme.backGroundColor};
`;

const MainTextContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  width: 100%;
`;

const MainTextBox = styled.View`
  justify-content: center;
  align-items: center;
`;

const MainText = styled.Text`
  font-size: 17px;
  font-weight: 300;
`;

const SubmitBtn = styled.TouchableOpacity`
  background-color: #608cf1;
  width: ${constants.width / 1.05};
  justify-content: center;
  align-items: center;
  padding: 13px;
  margin-top: 16px;
  border-radius: 5px;
`;

const SubmitText = styled.Text`
  color: white;
  font-size: 17px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-left: 6px;
  font-size: 12px;
  width: ${props => (props.width ? props.width : "auto")};
`;

const HorizonBox = styled.View`
  flex-direction: row;
  width: 100%;
  margin-left: 15;
  margin-top: 15;
`;

const CONFIRM_EMAIL = gql`
  mutation confirmEmail($email: String!) {
    confirmEmail(email: $email)
  }
`;

const SignUp = ({ navigation }) => {
  // ------------ email ------------
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  // ------------ password ------------
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  // ------------ passwordConfirm ------------
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);

  // ------------ name ------------
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [generalPolicy, setGeneralPolicy] = useState(false);
  const [generalPolicyError, setGeneralPolicyError] = useState(null);
  const [privatePolicy, setPrivatePolicy] = useState(false);
  const [privatePolicyError, setPrivatePolicyError] = useState(null);
  const [agreeLocation, setAgreeLocation] = useState(false);
  const [agreeLocationError, setAgreeLocationError] = useState(false);

  const isEmail = email => {
    const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return emailRegex.test(email);
  };

  const isPassword = password => {
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    return pwdRegex.test(password);
  };

  const isName = name => {
    const textRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$/;
    return textRegex.test(name);
  };

  const [confirmEmailMutation] = useMutation(CONFIRM_EMAIL);

  const onValidateEmail = async () => {
    const isExistsEmail = await confirmEmailMutation({
      variables: {
        email
      }
    });
    if (isExistsEmail && isExistsEmail.data) {
      if (isExistsEmail.data.confirmEmail) {
        setEmailError("이미 존재하는 이메일입니다");
        return false;
      }
    } else {
      setEmailError("이메일 중복확인 오류, 관리자 문의");
      return false;
    }

    if (!isEmail(email)) {
      setEmailError("올바른 이메일 형식으로 입력하세요");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const onValidatePassword = () => {
    if (!isPassword(password)) {
      setPasswordError("비밀번호는 8~16자리 영문,특수문자,숫자를 포함하세요");
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  };

  const onValidatePasswordConfirm = () => {
    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 서로 일치하지 않습니다 ");
      return false;
    } else if (!isPassword(passwordConfirm)) {
      setPasswordConfirmError(
        "비밀번호는 8~16자리 영문,특수문자,숫자를 포함하세요"
      );
      return false;
    } else {
      setPasswordConfirmError(null);
      return true;
    }
  };

  const onValidateName = () => {
    if (!isName(name)) {
      setNameError("올바른 이름을 입력하세요");
      return false;
    } else {
      setNameError(null);
      return true;
    }
  };

  const onValidateGeneralPolicy = () => {
    if (!generalPolicy) {
      setGeneralPolicyError("필수 체크사항입니다");
      return false;
    } else {
      setGeneralPolicyError(null);
      return true;
    }
  };

  const onValidatePrivatePolicy = () => {
    if (!privatePolicy) {
      setPrivatePolicyError("필수 체크사항입니다");
      return false;
    } else {
      setPrivatePolicyError(null);
      return true;
    }
  };

  const onValidateTotal = () => {
    const vEmail = onValidateEmail();
    const vPassword = onValidatePassword();
    const vPasswordConfirm = onValidatePasswordConfirm();
    const vName = onValidateName();
    const vGeneralPolicy = onValidateGeneralPolicy();
    const vPrivatePolicy = onValidatePrivatePolicy();

    if (
      vEmail &&
      vPassword &&
      vPasswordConfirm &&
      vName &&
      vGeneralPolicy &&
      vPrivatePolicy
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    const result = onValidateTotal();
    if (result) {
      navigation.navigate("AuthPhone", {
        email,
        password,
        name
      });
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Header.HEIGHT + 50}
      behavior="padding"
      style={{ flex: 1 }}
    >
      <ScrollView>
        <Container>
          <MainTextContainer>
            <MainTextBox>
              <MainText>뿜펫 아이디로 사용 할</MainText>
              <MainText>사용자 정보를 입력해주세요</MainText>
            </MainTextBox>
          </MainTextContainer>

          <SignUpInput
            title={"이메일"}
            placeholder={"이메일을 입력하세요"}
            value={email}
            onChange={value => setEmail(value)}
            error={emailError}
            onBlur={() => onValidateEmail()}
          />
          <SignUpInput
            title={"비밀번호"}
            placeholder={"비밀번호를 입력하세요"}
            value={password}
            secureTextEntry={true}
            onChange={value => setPassword(value)}
            error={passwordError}
            onBlur={() => onValidatePassword()}
          />
          <SignUpInput
            title={"비밀번호 재확인"}
            placeholder={"비밀번호 재확인을 입력하세요"}
            value={passwordConfirm}
            secureTextEntry={true}
            onChange={value => setPasswordConfirm(value)}
            error={passwordConfirmError}
            onBlur={() => onValidatePasswordConfirm()}
            errorFlex={2}
          />
          <SignUpInput
            title={"사용자명"}
            placeholder={"사용자명을 입력하세요"}
            value={name}
            onChange={value => setName(value)}
            error={nameError}
            onBlur={() => onValidateName()}
          />
          <HorizonBox>
            <CheckBox
              onClick={() => setGeneralPolicy(c => !c)}
              isChecked={generalPolicy}
              rightText={"이용약관(필수)"}
              style={{
                width: 120
              }}
              checkedImage={
                <Image
                  source={require("../../assets/images/checkbox_on.png")}
                  style={{ width: 16, height: 16 }}
                />
              }
              unCheckedImage={
                <Image
                  source={require("../../assets/images/checkbox_off.png")}
                  style={{ width: 16, height: 16 }}
                />
              }
            />
            {generalPolicyError && <ErrorText>{generalPolicyError}</ErrorText>}
          </HorizonBox>
          <HorizonBox>
            <CheckBox
              onClick={() => setPrivatePolicy(c => !c)}
              isChecked={privatePolicy}
              rightText={"개인정보 처리 방침(필수)"}
              style={{
                width: 170
              }}
              checkedImage={
                <Image
                  source={require("../../assets/images/checkbox_on.png")}
                  style={{ width: 16, height: 16 }}
                />
              }
              unCheckedImage={
                <Image
                  source={require("../../assets/images/checkbox_off.png")}
                  style={{ width: 16, height: 16 }}
                />
              }
            />
            {privatePolicyError && <ErrorText>{privatePolicyError}</ErrorText>}
          </HorizonBox>
          <CheckBox
            onClick={() => setAgreeLocation(c => !c)}
            isChecked={agreeLocation}
            rightText={"위치 조회 서비스 동의(선택)"}
            style={{
              marginLeft: 15,
              marginTop: 15,
              width: "100%",
              flexDirection: "row",
              alignItems: "center"
            }}
            checkedImage={
              <Image
                source={require("../../assets/images/checkbox_on.png")}
                style={{ width: 16, height: 16 }}
              />
            }
            unCheckedImage={
              <Image
                source={require("../../assets/images/checkbox_off.png")}
                style={{ width: 16, height: 16 }}
              />
            }
          />

          <SubmitBtn onPress={() => handleSubmit()}>
            <SubmitText>회원가입</SubmitText>
          </SubmitBtn>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
