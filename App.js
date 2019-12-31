// import "./global";
import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import options from "./apollo";
import { ThemeProvider } from "styled-components";
import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [loaded, setloaded] = useState(false);
  const [client, setClient] = useState(null);

  //지문/PIN 자동로그인 들어가기 전  ※앱 스토리지에 로그인 데이터 남겼을때
  //const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletExist, setWalletExist] = useState(false);
  const [beginning, setBeginning] = useState(false);
  const preLoad = async () => {
    //await AsyncStorage.clear()  테스트용 스토리지 초기화
    try {
      await Font.loadAsync({
        "NotoSansKR-Regular": require("./assets/fonts/NotoSansKR-Regular.ttf"),
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font
      });
      //await Asset.loadAsync([require("./assets/logo.png")])
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage
      });
      // await AsyncStorage.removeItem("jwt");
      const token = await AsyncStorage.getItem("jwt"); //앱이 실행될 때, jwt를 체크
      const client = new ApolloClient({
        cache,
        request: async operation => {
          const token = await AsyncStorage.getItem("jwt"); //apolloClient가 새 request를 보낼 때, jwt체크(재실행 하지 않아도 바로 token적용을 확인하는 역할)
          //request header에
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` }
          });
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        ...options
      });

      // 얘는 뭔지 모르겠다
      client.defaultOptions = {
        watchQuery: {
          fetchPolicy: "network-only",
          errorPolicy: "all"
        },
        query: {
          fetchPolicy: "network-only",
          errorPolicy: "all"
        },
        mutate: {
          errorPolicy: "all"
        }
      };

      // 지문/PIN 자동로그인 들어가기 전  ※앱 스토리지에 로그인 데이터 남겼을때
      // await AsyncStorage.removeItem("isLoggedIn");
      // const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      // if (!isLoggedIn || isLoggedIn === "false") {
      //   setIsLoggedIn(false);
      // } else {
      //   setIsLoggedIn(true);
      // }

      //load wallet data
      const walletExist = await AsyncStorage.getItem("walletExist");
      if (!walletExist || walletExist === "false" || walletExist === null) {
        setWalletExist(false);
      } else {
        setWalletExist(true);
      }

      // beginning check

      const beginning = await AsyncStorage.getItem("beginning");
      if (!beginning || beginning === "false" || beginning === null) {
        setBeginning(false);
      } else {
        setBeginning(true);
      }

      const useAuthenticationPossible = await LocalAuthentication.supportedAuthenticationTypesAsync(); //기기가 지문인식 가능한지 여부 [1,2] 1 : 지문인식 2: 홍채인식
      const alreadyAuthenticatie = await LocalAuthentication.isEnrolledAsync(); //기기에 저장된 지문이 있는지 확인 true,false
      await AsyncStorage.setItem(
        "useAuthenticationPossible",
        useAuthenticationPossible[0] + ""
      );
      await AsyncStorage.setItem(
        "alreadyAuthenticatie",
        alreadyAuthenticatie + ""
      );
      // done
      setloaded(true);
      setClient(client);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        {/* AuthProvider 에 AsyncStorage에서 get해온 state를 props로 보낸다*/}
        {/* AuthProvider 의  */}
        <AuthProvider
          isLoggedIn={isLoggedIn}
          walletExist={walletExist}
          beginning={beginning}
        >
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
