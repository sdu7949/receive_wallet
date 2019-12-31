import React, { useState } from "react";
import { Clipboard, ActivityIndicator } from "react-native";
import styled from "styled-components";
import constants from "../constants";
import PropTypes from "prop-types";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-tiny-toast";
import { NavigationActions, withNavigation } from "react-navigation";

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  width: ${constants.width};
  height: ${constants.height * 0.3};
`;

const Warpper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Image = styled.Image`
  height: 40px;
`;

const TextInput = styled.Text`
  color: white;
  font-size: 32px;
  padding-bottom: 1%;
`;

const Text = styled.Text`
  align-items: flex-end;
  color: #ffffff;
  font-size: 30px;
  font-weight: 100;
`;

const CoinTextInput = styled.Text`
  color: white;
  font-size: 20px;
`;

const AddressTextInput = styled.Text`
  color: white;
  font-size: 20px;
  margin-top: 15%;
  margin-bottom: 5%;
`;

const CoinText = styled.Text`
  align-items: flex-end;
  color: #ffffff;
  font-size: 16px;
  font-weight: 100;
`;

const AddressWarpper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
`;

const AddressText = styled.Text`
  flex: 1;
  text-align: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 100;
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 2%;
`;

const TouchableContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const WrapperView = styled.View`
  width: ${constants.width * 0.95};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const HoldingAssertBox = ({
  navigation,
  text,
  holdingCoin = 0,
  address,
  PET_price,
  isLoading
}) => {
  let KRWAssert = null;
  if (holdingCoin > 0) {
    KRWAssert = parseFloat(holdingCoin) * PET_price;
  } else {
    KRWAssert = 0;
  }
  const [isCopy, setIsCopy] = useState(false);

  const { navigate } = NavigationActions;
  return (
    <>
      <LinearGradient
        colors={["#5d4be3", "#709bff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ImageBackground
          style={{ resizeMode: "contain" }}
          source={require("../assets/images/money_coin_bg.png")}
        >
          <Container>
            {isLoading ? (
              <>
                <Warpper>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={require("../assets/images/w_icon.png")}
                  />
                  <TextInput>{KRWAssert}</TextInput>
                  <Text> KRW</Text>
                </Warpper>
                <Warpper>
                  <CoinTextInput>{holdingCoin}</CoinTextInput>
                  <CoinText> Coin</CoinText>
                </Warpper>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="white" />
              </>
            )}
          </Container>
        </ImageBackground>
      </LinearGradient>
      <AddressTextInput>내 지갑 주소</AddressTextInput>
      <AddressWarpper
        style={
          isCopy
            ? {
                borderBottomColor: "#5d4ce3"
              }
            : {
                borderBottomColor: "#555363"
              }
        }
      >
        <AddressText>{address}</AddressText>
      </AddressWarpper>
      <WrapperView>
        <Touchable
          onPress={() => {
            Toast.show("주소가 복사되었습니다");
            Clipboard.setString(address);
            setIsCopy(true);
          }}
        >
          <LinearGradient
            style={{ borderRadius: 10 }}
            colors={["#5d4be3", "#709bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableContainer>
              <CoinText>복사하기</CoinText>
            </TouchableContainer>
          </LinearGradient>
        </Touchable>
        <Touchable
          onPress={() => {
            //환전 신청 tab으로 이동
            navigation.navigate({
              routeName: "ExchangeRequest"
            });
          }}
        >
          <LinearGradient
            style={{ borderRadius: 10 }}
            colors={["#5d4be3", "#709bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableContainer>
              <CoinText>환전신청</CoinText>
            </TouchableContainer>
          </LinearGradient>
        </Touchable>
      </WrapperView>
    </>
  );
};

HoldingAssertBox.propTypes = {
  text: PropTypes.string.isRequired,
  holdingCoin: PropTypes.number.isRequired,
  address: PropTypes.string,
  PET_price: PropTypes.number,
  isLoading: PropTypes.bool.isRequired
};

export default withNavigation(HoldingAssertBox);
