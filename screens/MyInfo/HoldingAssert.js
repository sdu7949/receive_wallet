import React, { useState, useEffect } from "react";
import { AsyncStorage, ActivityIndicator } from "react-native";
import styled from "styled-components";
import HoldingAssertBox from "../../components/HoldingAssertBox";
import axios from "axios";

const Warpper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
  align-items: center;
  justify-content: center;
`;

export default () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [assertCoinValue, setAssertCoinValue] = useState(null); //보유코인을 넘어선 입력값을 제한하기 위함
  const [PET_price, setPET_price] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const getAsyncStorage = async () => {
    // await axios
    //   .get(`https://irm.bboompet.com/PET_price`)
    //   .then(({ data: { PET_price } }) => {
    //     setPET_price(PET_price);
    //   });
    const wallet = await AsyncStorage.getItem("WALLETS");
    const parseWallet = JSON.parse(wallet);
    setWalletAddress(parseWallet.address);
  };

  const getUserBalanceFunc = async () => {
    const result = await getUserBalance(walletAddress);
    if (result !== undefined) {
      //새로 받아온값이 undefined가 아닐때만 새로 setState한다
      const resultStr = String(result);
      // console.log("getUserBalance : ", result);
      setAssertCoinValue(resultStr);
    }
  };

  useEffect(() => {
    getAsyncStorage();
  }, []);

  useEffect(() => {
    getUserBalanceFunc();
  }, [walletAddress]);

  useEffect(() => {
    if (
      PET_price !== null &&
      assertCoinValue !== null &&
      walletAddress !== null
    ) {
      setIsLoading(true);
    }
  }, [assertCoinValue, PET_price]);

  return (
    <>
      <Warpper>
        <HoldingAssertBox
          text="총 보유자산"
          holdingCoin={assertCoinValue > 0 ? assertCoinValue / 1000 : 0}
          PET_price={PET_price}
          address={walletAddress}
          isLoading={isLoading}
        ></HoldingAssertBox>
      </Warpper>
    </>
  );
};
