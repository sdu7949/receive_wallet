import React, { useState, useEffect } from "react";
import { ActivityIndicator, Vibration, StyleSheet } from "react-native";
import { createWallet } from "../../AuthContext";
import { _storeData } from "../../StoreData";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import constants from "../../constants";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import Toast from "react-native-tiny-toast";

const styles = StyleSheet.create({
  absoluteActive: {
    width: constants.width * 0.42,
    left: 40,
    position: "absolute",
    zIndex: 9999
  },
  absoluteInActive: {
    width: constants.width * 0.42,
    right: 40,
    position: "absolute",
    zIndex: 0
  },
  absoluteActiveTwo: {
    width: constants.width * 0.42,
    right: 40,
    position: "absolute",
    zIndex: 9999
  },
  absoluteInActiveTwo: {
    width: constants.width * 0.42,
    left: 40,
    position: "absolute",
    zIndex: 0
  }
});

const WrapperView = styled.View`
  width: ${constants.width * 0.95};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const TextInput = styled.TextInput`
  color: white;
  width: ${constants.width * 0.95};
  flex: 1;
  background-color: ${props => props.theme.subColor};
  margin-bottom: 5%;
  font-size: 20;
`;

const Text = styled.Text`
  color: #bbbbbb;
  text-align: center;
  font-size: 17px;
  margin-top: 10%;
  margin-bottom: 10%;
`;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: ${props => props.theme.backGroundColor};
`;

const Container = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const ContainerTwo = styled.View`
  align-items: center;
  justify-content: center;
  height: 45px;
`;

const SwitchBox = styled.View`
  position: relative;
  flex-direction: row;
  /* flex: 1; */
  align-items: center;
  margin-top: 20%;
  margin-bottom: 5%;
`;

const ToggleSwitch = styled.View`
  /* position : absolute; */
  /* flex : 1; */
`;

const SwitchContainer = styled.View`
  border-radius: 100;
  align-items: center;
  justify-content: center;
  height: 45px;
  background-color: ${props => props.theme.subColor};
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 2%;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const BIND_WALLET = gql`
  mutation bindWallet($walletAddress: String!) {
    bindWallet(walletAddress: $walletAddress) {
      email
      walletAddress
    }
  }
`;

export default () => {
  const createWalletComplete = createWallet();
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bindWalletMutation] = useMutation(BIND_WALLET);

  useEffect(() => {
    if (isLoading) {
      recoveryWallet();
    }
  }, [isLoading]);

  const toggleSwitch = async clickedSwitch => {
    if (clickedSwitch === 0) {
      setInputValue("");
      setActiveIndex(clickedSwitch);
    } else {
      setInputValue("");
      setActiveIndex(clickedSwitch);
    }
  };

  renderButton = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <ToggleSwitch style={styles.absoluteActive}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(0)}>
                <LinearGradient
                  style={{ borderRadius: 100 }}
                  colors={["#5d4be3", "#709bff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <ContainerTwo>
                    <ButtonText>니모닉</ButtonText>
                  </ContainerTwo>
                </LinearGradient>
              </Touchable>
            </ToggleSwitch>
            <ToggleSwitch style={styles.absoluteInActive}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(1)}>
                <SwitchContainer>
                  <ButtonText>개인키</ButtonText>
                </SwitchContainer>
              </Touchable>
            </ToggleSwitch>
          </>
        );
      default:
        return (
          <>
            <ToggleSwitch style={styles.absoluteInActiveTwo}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(0)}>
                <SwitchContainer>
                  <ButtonText>니모닉</ButtonText>
                </SwitchContainer>
              </Touchable>
            </ToggleSwitch>
            <ToggleSwitch style={styles.absoluteActiveTwo}>
              <Touchable disabled={isLoading} onPress={() => toggleSwitch(1)}>
                <LinearGradient
                  style={{ borderRadius: 100 }}
                  colors={["#5d4be3", "#709bff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <ContainerTwo>
                    <ButtonText>개인키</ButtonText>
                  </ContainerTwo>
                </LinearGradient>
              </Touchable>
            </ToggleSwitch>
          </>
        );
    }
  };
  renderSection = () => {
    switch (activeIndex) {
      case 0:
        return (
          <>
            <Text>니모닉 단어를 입력해주세요</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              keyboardType="email-address"
              value={inputValue}
              onChangeText={v => setInputValue(v)}
            />
          </>
        );
      default:
        return (
          <>
            <Text>개인키를 입력해주세요(0x 제외)</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              keyboardType="email-address"
              value={inputValue}
              onChangeText={v => setInputValue(v)}
            />
          </>
        );
    }
  };

  recoveryWallet = async () => {
    if (activeIndex === 0) {
      //니모닉 지갑 복구
      try {
        const wallet = null;
        const address = await wallet.getAddress();
        const privateKey = wallet.privateKey;
        const walletData = {
          name: "이더리움",
          coinType: "ETH",
          symbol: "ETH",
          address
        };
        await _storeData(walletData, privateKey, inputValue);
        const { data } = await bindWalletMutation({
          variables: {
            walletAddress: address
          }
          // ,fetchPolicy: "network-only" //뮤테이션 마다 cache, network(server) 데이터 호출 우선순위를 지정할수 있다 ※cache = 빠름, network = 상대적으로 느림
        });
        console.log("니모닉 import : ", data);
        Toast.show("지갑 가져오기 성공(니모닉)");

        createWalletComplete();
      } catch (error) {
        //니모닉 형식 오류는 ethers.wallet가 잡아주네
        Vibration.vibrate(200);
        Toast.show("니모닉 형식에 맞지않습니다");

        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      //개인키 지갑 복구
      try {
        const hexRegex = /^[a-fA-F0-9]{64}$/g;
        if (inputValue === "") {
          Vibration.vibrate(200);
          Toast.show("개인키를 입력해주세요");

          return false;
        } else if (!hexRegex.test(inputValue)) {
          Vibration.vibrate(200);
          Toast.show("개인키 형식에 맞지 않습니다");
          return false;
        } else {
          const address = await wallet.getAddress();
          const privateKey = wallet.privateKey;
          console.log(`address : `, address);
          console.log(`privateKey : `, privateKey);
          const walletData = {
            name: "이더리움",
            coinType: "ETH",
            symbol: "ETH",
            address
          };
          await _storeData(walletData, privateKey, null);
          const { data } = await bindWalletMutation({
            variables: {
              walletAddress: address
            }
            // ,fetchPolicy: "network-only" //뮤테이션 마다 cache, network(server) 데이터 호출 우선순위를 지정할수 있다 ※cache = 빠름, network = 상대적으로 느림
          });
          console.log("개인키 import : ", data);
          createWalletComplete();
          Toast.show("지갑 가져오기 성공(개인키)");
        }
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      <WrapperView>
        <SwitchBox>{renderButton()}</SwitchBox>
        {renderSection()}

        <Touchable
          disabled={isLoading}
          onPress={() => {
            setIsLoading(true);
          }}
        >
          <LinearGradient
            style={{ borderRadius: 10 }}
            colors={["#5d4be3", "#709bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Container>
              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <ButtonText>가져오기</ButtonText>
              )}
            </Container>
          </LinearGradient>
        </Touchable>
      </WrapperView>
    </Wrapper>
  );
};
