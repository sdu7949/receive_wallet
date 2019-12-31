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
  return (
    <>
      <Wrapper>
        <HeaderText>내 정보</HeaderText>
        <ButtonWrapper>
          <Touchable
            onPress={() =>
              navigation.navigate("BioMetric", {
                routeName: "InvestCondition"
              })
            }
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/nav_coin_icon.png")}
            />
            <Container>
              <ButtonText>투자 현황</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/back_btn_icon.png")}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable onPress={() => navigation.navigate("KeyManage")}>
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/privatekey_icon.png")}
            />
            <Container>
              <ButtonText>키 관리</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/back_btn_icon.png")}
            />
          </Touchable>
        </ButtonWrapper>
        <ButtonWrapper>
          <Touchable
            onPress={() =>
              navigation.navigate("BioMetric", {
                routeName: "AppLock"
              })
            }
          >
            <Image
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/nav_locking_icon.png")}
            />
            <Container>
              <ButtonText>앱 잠금</ButtonText>
            </Container>
            <ArrowImage
              style={{ resizeMode: "contain" }}
              source={require("../../assets/images/back_btn_icon.png")}
            />
          </Touchable>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};
