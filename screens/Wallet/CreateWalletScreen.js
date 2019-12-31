import React, { useState, useEffect } from "react";
import { ActivityIndicator, Clipboard, AsyncStorage } from "react-native";
// import "../../shim";
import styled from "styled-components";
import * as Random from "expo-random";
import { createWallet, useLogIn } from "../../AuthContext";
import { _storeData } from "../../StoreData";
import constants from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import Toast from "react-native-tiny-toast";

const Text = styled.Text`
  color: #bbbbbb;
  text-align: center;
  font-size: 17px;
`;

const Texttwo = styled.Text`
  color: #bbbbbb;
  text-align: center;
  font-size: 13px;
  margin-bottom: 5%;
`;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: ${props => props.theme.backGroundColor};
`;

const MnemonicWrapperRow = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 2%;
`;

const MnemonicWrapperColumn = styled.View`
  flex: 1;
  flex-direction: column;
`;

const MnemonicBox = styled.View`
  color: white;
  justify-content: center;
  height: 18%;
  margin: 5px;
  padding: 5px 2px;
  border-radius: 10px;
  background-color: ${props => props.theme.subColor};
`;

const WrapperView = styled.View`
  width: ${constants.width * 0.95};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const Container = styled.View`
  align-items: center;
  justify-content: center;
  height: 55px;
`;

const ContainerTwo = styled.View`
  display: flex;
  height: 55px;
  background-color: ${props => props.theme.subColor};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const Image = styled.Image`
  width: ${constants.width * 0.5};
  margin: 0 auto;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 17px;
`;

const Touchable = styled.TouchableOpacity`
  margin-top: 2%;
`;

const CREATE_USER = gql`
  mutation createUser($nickName: String!, $address: String!) {
    createUser(nickName: $nickName, address: $address)
  }
`;

const CREATE_USER_TOKEN = gql`
  mutation createUserToken($id: String!) {
    createUserToken(id: $id)
  }
`;

export default ({ navigation }) => {
  const nickName = navigation.getParam("nickName");
  console.log("nickName : ", nickName);
  const createWalletComplete = createWallet();
  const login = useLogIn();
  const [mnemonicValue, setMnemoniValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mnemonicValueArr, setMnemonicValueArr] = useState([]);
  const [createUserMutation] = useMutation(CREATE_USER);
  const [createUserTokenMutation] = useMutation(CREATE_USER_TOKEN);

  const createMnemonic = async () => {
    const randomBytes = await Random.getRandomBytesAsync(16);
    const mnemonicValueArr = mnemonic.split(" ");

    setMnemonicValueArr(mnemonicValueArr);
    setMnemoniValue(mnemonic); //mnemonicValue = mnemonic
    return true;
  };

  useEffect(() => {
    createMnemonic();
  }, []);

  useEffect(() => {
    if (isLoading) {
      _createWallet();
    }
  }, [isLoading]);

  const _createWallet = async () => {
    try {
      const wallet = null;
      // console.log("wallet");
      // console.log(wallet);

      const address = await wallet.getAddress();
      const privateKey = wallet.privateKey;

      const walletData = {
        name: "이더리움",
        coinType: "ETH",
        symbol: "ETH",
        address
      };
      //context를 변경해서 navigation 전환
      await _storeData(walletData, privateKey, mnemonicValue);
      const {
        data: { createUser: userId }
      } = await createUserMutation({
        variables: {
          nickName,
          address: address
        }
        // ,fetchPolicy: "network-only" //뮤테이션 마다 cache, network(server) 데이터 호출 우선순위를 지정할수 있다 ※cache = 빠름, network = 상대적으로 느림
      });
      console.log("createUserMutation data : ", userId);
      await AsyncStorage.setItem("userId", userId);

      //여기서 로그인처리? createToken을 해줘야 하나
      const {
        data: { createUserToken }
      } = await createUserTokenMutation({
        variables: {
          id: userId
        }
      });
      console.log("createUserToken : ", createUserToken);
      if (
        createUserToken !== undefined &&
        createUserToken !== "" &&
        createUserToken !== "false" &&
        createUserToken !== false
      ) {
        setTimeout(() => {
          login(createUserToken);
          createWalletComplete();
        }, 500);
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
      Toast.show("지갑이 생성되었습니다");
    }
  };

  return (
    <Wrapper>
      <WrapperView style={{ flex: 1 }}>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("../../assets/images/write_img.png")}
        />
        <Text>{`니모닉 단어를 안전한 곳에 보관하세요`}</Text>
        <Texttwo>{`BBOOMCOIN에서는 분실 및 유출로 인한\n손해를 책임지지 않습니다`}</Texttwo>
        <MnemonicWrapperRow>
          <MnemonicWrapperColumn>
            <MnemonicBox>
              <Text>{mnemonicValueArr[0]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[3]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[6]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[9]}</Text>
            </MnemonicBox>
          </MnemonicWrapperColumn>
          <MnemonicWrapperColumn>
            <MnemonicBox>
              <Text>{mnemonicValueArr[1]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[4]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[7]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[10]}</Text>
            </MnemonicBox>
          </MnemonicWrapperColumn>
          <MnemonicWrapperColumn>
            <MnemonicBox>
              <Text>{mnemonicValueArr[2]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[5]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[8]}</Text>
            </MnemonicBox>
            <MnemonicBox>
              <Text>{mnemonicValueArr[11]}</Text>
            </MnemonicBox>
          </MnemonicWrapperColumn>
        </MnemonicWrapperRow>

        {/* <Textarea rowSpan={5} bordered disabled
                    value={mnemonicValue}
                /> */}
        <Touchable
          disabled={isLoading}
          onPress={() => {
            Clipboard.setString(mnemonicValue);
            Toast.show("니모닉 복사가 완료되었습니다");
          }}
        >
          <LinearGradient
            style={{ borderRadius: 10 }}
            colors={["#5d4be3", "#709bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Container>
              <ButtonText>복사하기</ButtonText>
            </Container>
          </LinearGradient>
        </Touchable>
        <Touchable disabled={isLoading} onPress={() => setIsLoading(true)}>
          <ContainerTwo>
            {isLoading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <ButtonText>생성하기</ButtonText>
            )}
          </ContainerTwo>
        </Touchable>
      </WrapperView>
    </Wrapper>
  );
};
