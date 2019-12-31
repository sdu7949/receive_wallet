import React from "react";
import { View, AsyncStorage } from "react-native";
import {
  useIsLoggedIn,
  useWalletExist,
  removeWallet,
  useLogOut,
  userIntroSliderCheck
} from "../AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";
import WalletNavigation from "../navigation/WalletNavigation";
import IntroSlider from "../components/AppIntroSlider";
import * as SecureStore from "expo-secure-store";
import LoginBioMetric from "../components/LoginBioMetric";

export default () => {
  // const logout = useLogOut(); //login 상태 변경
  // logout();
  // const removeWalletFunc = removeWallet(); //wallet exist 상태 변경
  // removeWalletFunc();
  // AsyncStorage.removeItem("beginning");
  // SecureStore.deleteItemAsync("PINcode");

  const introSliderDone = userIntroSliderCheck();
  // const isLoggedIn = useIsLoggedIn();
  const isLoggedIn = true;
  const walletExist = useWalletExist();

  // console.log("NavController introSliderDone : ", introSliderDone);
  // console.log("NavController isLoggedIn : ", isLoggedIn);
  // console.log('NavController walletExist : ', walletExist)

  return (
    <View style={{ flex: 1 }}>
      {!introSliderDone ? ( //앱 인트로 슬라이더 실행여부
        <IntroSlider />
      ) : walletExist ? ( //walletExist
        isLoggedIn ? ( //true,false
          <MainNavigation /> //로그인O 지갑 O
        ) : (
          <LoginBioMetric /> //로그인X 지갑 O
        )
      ) : (
        <WalletNavigation /> //지갑 X
      )}
    </View>

    // 예전꺼 (로그인 있던 시절)
    // <View style={{ flex: 1 }}>
    //   {!introSliderDone ? ( //앱 인트로 슬라이더 실행여부
    //     <IntroSlider /> //<></>에 인트로 슬라이더 컴포넌트를 넣자
    //   ) : !isLoggedIn ? ( //로그인 X !isLoggedIn
    //     <AuthNavigation />
    //   ) : //로그인 O
    //   walletExist ? ( //walletExist
    //     <MainNavigation /> //지갑 O
    //   ) : (
    //     <WalletNavigation /> //지갑 X
    //   )}
    // </View>
  );
};
