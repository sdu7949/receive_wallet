import React, { useState, useEffect } from "react";
import styled from "styled-components";
import constants from "../constants";
import { ImageBackground, AsyncStorage, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
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
  font-size: 40px;
  padding-bottom: 1%;
`;

const Text = styled.Text`
  align-items: flex-end;
  color: #ffffff;
  font-size: 30px;
  font-weight: 100;
`;

export default HoldingCoinBox = ({ assertCoinValue, setAssertCoinValue }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getWalletFunc = async () => {
    const walletStr = await AsyncStorage.getItem("WALLETS");
    const wallet = JSON.parse(walletStr);
    console.log(wallet.address);
    setWalletAddress(wallet.address);
  };

  const getUserBalanceFunc = async () => {
    const result = await getUserBalance(walletAddress);
    if (result !== undefined) {
      //새로 받아온값이 undefined가 아닐때만 새로 setState한다
      const resultStr = String(result);
      // console.log("getUserBalance : ", result);
      setAssertCoinValue(resultStr);
      if (!isLoading) {
        setIsLoading(true);
      }
    }
  };

  useEffect(() => {
    getWalletFunc();
  }, []);

  useEffect(() => {
    getUserBalanceFunc();
  }, [walletAddress]);

  // 이벤트 리스너는 함수형이 아니라 상시 열어둬야 정상작동 (실시간 적용 떄문인듯?)

  return (
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
          <Warpper>
            {isLoading ? (
              <>
                <Image
                  style={{ resizeMode: "contain" }}
                  source={require("../assets/images/c_icon.png")}
                />
                <TextInput>
                  {assertCoinValue > 0 ? assertCoinValue / 1000 : 0}
                </TextInput>
                <Text> Coin</Text>
              </>
            ) : (
              <>
                <ActivityIndicator size={"large"} color={"white"} />
              </>
            )}
          </Warpper>
        </Container>
      </ImageBackground>
    </LinearGradient>
  );
};
