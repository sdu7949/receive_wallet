import React, { useState, useEffect } from "react";
import {
  ScrollView,
  FlatList,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import styled from "styled-components";

const Wrapper = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
`;

const HeaderText = styled.Text`
  color: white;
  text-align: left;
  font-weight: 600;
  margin-top: 8%;
  margin-bottom: 5%;
  margin-left: 5%;
`;

const Text = styled.Text`
  color: white;
  padding: 10px;
  font-size: 18;
  height: 44;
  background-color: ${props => props.theme.subColor};
  margin-bottom: 1;
  padding-left: 10%;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sendhistoryArr, setSendHistoryArr] = useState([]);
  const [receiveHistoryArr, setReceiveHistoryArr] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [coinHistoryArr, setCoinHistoryArr] = useState([]);
  //새로운 보내기,받기 이벤트 리슨

  // transfer history
  const pastEventSend = val => {
    // console.log("send walletAddress : ", val);
    if (val !== null) {
    } else {
      return false;
    }
  };

  const pastEventReceive = val => {
    // console.log("receive walletAddress : ", val);
    if (val !== null) {
      // transfer history
    } else {
      return false;
    }
  };

  const getWalletFunc = async () => {
    const walletStr = await AsyncStorage.getItem("WALLETS");
    const wallet = JSON.parse(walletStr);
    setWalletAddress(wallet.address);
    pastEventSend(wallet.address);
    pastEventReceive(wallet.address);
  };

  const arrayCombine = async (arrA, arrb) => {
    const sortingFiled = "blockNumber";
    let concatArr = arrb.concat(arrA);
    const sortArr = concatArr.sort((a, b) => {
      return b[sortingFiled] - a[sortingFiled];
    });
    setCoinHistoryArr(sortArr);
    setTimeout(() => {
      setIsLoading(true);
    }, 1500);
  };

  useEffect(() => {
    getWalletFunc();
  }, []);

  useEffect(() => {
    if (sendhistoryArr.length !== 0 && receiveHistoryArr.length !== 0) {
      // console.log("둘다 있음");
      arrayCombine(sendhistoryArr, receiveHistoryArr);
    } else if (sendhistoryArr.length === 0 && receiveHistoryArr.length !== 0) {
      // console.log("받은 내역만 있음");
      arrayCombine([], receiveHistoryArr);
    } else if (receiveHistoryArr.length === 0 && sendhistoryArr.length !== 0) {
      // console.log("보낸 내역만 있음");
      arrayCombine(sendhistoryArr, []);
    } else {
      // console.log("둘다 없음");
      setTimeout(() => {
        setIsLoading(true);
      }, 1500);
    }
  }, [sendhistoryArr, receiveHistoryArr]);

  return (
    <Wrapper>
      <HeaderText>코인 내역 목록</HeaderText>
      {isLoading ? (
        <ScrollView>
          {coinHistoryArr.length === 0 ? (
            <Text>코인 내역이 없습니다.</Text>
          ) : (
            <FlatList
              data={coinHistoryArr}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text>
                  {item.mark}
                  {parseFloat(item.value) / 1000} Coin
                </Text>
              )}
            />
          )}
        </ScrollView>
      ) : (
        <Container>
          <ActivityIndicator size={"large"} color={"white"} />
        </Container>
      )}
    </Wrapper>
  );
};
