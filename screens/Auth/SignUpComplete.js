import React, { useState, useEffect } from "react";
import styled from "styled-components";
import styles from "../../styles";
import constants from "../../constants";
import { useLogIn } from "../../AuthContext";
import { ScrollView } from "react-native";

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

const ImageBox = styled.View`
  width: 100%;
`;

const Image = styled.Image`
  width: ${constants.width};
  height: 245px;
`;

const TextBox = styled.View`
  padding: 13px 10px;
  width: 100%;
  align-items: flex-start;
`;

const Text = styled.Text`
  font-weight: normal;
  font-size: 14.5px;
  margin-bottom: 0;
  color: black;
  letter-spacing: 0.2;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonBox = styled.View`
  flex: 1;
  padding: 5px 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props =>
    props.backGroundColor ? props.backGroundColor : "#608cf1"};
  border: 1px solid transparent;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 12px 0;
`;

const SignUpAuth = ({ navigation }) => {
  const id = navigation.getParam("id");
  const name = navigation.getParam("name");
  const token = navigation.getParam("token");

  const logIn = useLogIn();

  const handleLaterReg = () => {
    console.log("나중에 등록!!");
    console.log("token : ", token);
    logIn(token);
  };

  const handleNowReg = () => {
    console.log("지금등록!!");
    navigation.navigate("RegPet", {
      id,
      token
    });
  };

  return (
    <ScrollView>
      <Container>
        <TopBarBox>
          <TopBarOff />
          <TopBarOn />
        </TopBarBox>
        <MainTextContainer>
          <MainTextBox>
            <MainText>{name}님</MainText>
            <MainText>반갑습니다!</MainText>
          </MainTextBox>
        </MainTextContainer>
        <ImageBox>
          <Image
            source={require("../../assets/images/join_in_complete.png")}
            resizeMode={"contain"}
          />
        </ImageBox>

        <TextBox>
          <Text fontWeight={700} marginBottom={3}>
            반려동물(비문) 등록이란?
          </Text>
          <Text fontWeight={300}>
            우리 아이들의 정보(비문)를 등록하여 생애주기(예방접종,쇼핑,그외)를
            기록하며 이 정보는 아이들의 성장과 생활을 관리하여 보다 건강한
            동반생활을 하기 위해 개발되었습니다. 그리고 앞으로 반려동물에게
            발생될 수 있는 사회적 문제(유기,불실,기타 사고 등)를 해결하기 위한
            첫 걸음이 되며 등록 절차 또한 목걸이,칩삽입이 아닌 우리 아이들을
            위한 안전한 방식으로 바꾸기 위함입니다.
          </Text>
        </TextBox>
        <ButtonContainer>
          <ButtonBox>
            <Button
              onPress={() => handleLaterReg()}
              backgroundColor={"white"}
              borderColor={"green"}
            >
              <Text color={"yellow"} fontSize={"17px"} fontWeight={400}>
                나중에 등록하기
              </Text>
            </Button>
          </ButtonBox>
          <ButtonBox>
            <Button onPress={() => handleNowReg()}>
              <Text color={"white"} fontSize={"17px"} fontWeight={400}>
                반려동물 등록하기
              </Text>
            </Button>
          </ButtonBox>
        </ButtonContainer>
      </Container>
    </ScrollView>
  );
};

export default SignUpAuth;
