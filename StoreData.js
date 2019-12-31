import { AsyncStorage } from "react-native";
import * as SecureStore from "expo-secure-store";
export const _storeData = async (wallet, privateKey, mnemonic) => {
  try {
    // 지갑 목록 정보 저장하기
    await AsyncStorage.setItem("WALLETS", JSON.stringify(wallet));
    // 개인키를 안전한 영역에 저장하기
    const secureData = {
      address: wallet.address,
      privateKey,
      mnemonic: mnemonic
    };
    const jsonSecureData = JSON.stringify(secureData);
    // console.log("jsonSecureData")
    // console.log(jsonSecureData)
    await SecureStore.setItemAsync("secureData", jsonSecureData);
  } catch (error) {
    // Error saving data
    console.log(error);
  }
};
