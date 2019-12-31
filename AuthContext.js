import React, { createContext, useContext, useState } from "react";
import { AsyncStorage } from "react-native";

//react에서 제공하는 Context생성 함수(context 인스턴스)
export const AuthContext = createContext();

//AuthProvider안에 return된 state와 함수들만 네비게이션,스크린,컴포넌트 안에서 사용 가능하다
// 추가 설명 : AuthProvider 컴포넌트는 AuthContextprovider를 리턴하고, AuthContext의 Value로 담긴 함수/state들이 우리가 생각하는 context인것
export const AuthProvider = ({
  isLoggedIn: isLoggedInProp,
  walletExist: isExist,
  beginning: beginning,
  children
}) => {
  //props로 받은 애들을 state default로 선언
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp); //로그인 여부를 체크하는 state 선언
  const [walletExist, setWalletExist] = useState(isExist);
  const [introSliderDone, setIntroSliderDone] = useState(beginning);
  const [buttonActive, setButtonActive] = useState(0); //지문인식 사용여부 토글 state

  // 스토리지와 state를 변경하는 함수(외부호출)
  const doneIntroSlider = async () => {
    try {
      await AsyncStorage.setItem("beginning", "true");
      setIntroSliderDone(true);
      // console.log("setIntroSliderDone : ", introSliderDone);
    } catch (error) {
      console.log(error);
    }
  };

  const logUserIn = async token => {
    //AsyncStorage의 로그인 여부값을 true로 변경 === App.js에서 getAsyncStorage할 때 prop이 바뀌게 됨
    try {
      await AsyncStorage.setItem("isLoggedIn", "true"); //※AsyncStorage는 string만 보내지는듯
      await AsyncStorage.setItem("jwt", token);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const logUserOut = async () => {
    //로그인 여부 변경하는 함수
    try {
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const walletCreate = async () => {
    // AsyncStorage의 지갑보유값을 저장 => 변경
    try {
      await AsyncStorage.setItem("walletExist", "true");
      setWalletExist(true);
      console.log("setWalletExist : ", walletExist);
    } catch (error) {
      console.log(error);
    }
  };

  const walletRemove = async () => {
    try {
      await AsyncStorage.setItem("walletExist", "false");
      setWalletExist(false);
    } catch (error) {
      console.log(error);
    }
  };

  const activeButton = async () => {
    try {
      if (buttonActive === 0) {
        setButtonActive(1);
      } else {
        setButtonActive(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //state, state변경함수를 provider에 담고, 담긴 value들은 전역에서 함수로 호출 및 변경이 가능하다
  return (
    //state      , func     , func      , state      , func        , func        , state       , func
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logUserIn,
        logUserOut,
        walletExist,
        walletCreate,
        walletRemove,
        buttonActive,
        activeButton,
        doneIntroSlider, //introSliderDone값을 false에서 true로 변경하는 함수
        introSliderDone //외부에서 introSliderDone값을 호출하는 함수(context)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export해서 외부에서 사용하는 함수들 ※함수안에 useContext(AuthContext)의 value들 중 함수/state를 구조분해로 가져와 return
export const useIntroSliderDone = () => {
  // 1. 전역에서 사용할 userInroSliderDone이라는 함수는
  const { doneIntroSlider } = useContext(AuthContext); // 2. AuthProvider 컴포넌트에서 return할 AuthContext를 useContext라는 react 제공 함수로 실행해서
  return doneIntroSlider; // 3. AuthContext에 value로 선언한 func/state중에 doneIntroSlider라는 함수를 리턴한다
  // 4. 그럼 외부에서 doneIntroSlider 함수를 사용해서 Context의 storage/state를 변경할 수 있겠죠?
};

export const useIsLoggedIn = () => {
  //
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const useLogIn = () => {
  const { logUserIn } = useContext(AuthContext);
  return logUserIn;
};

export const useLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  return logUserOut;
};

export const userIntroSliderCheck = () => {
  const { introSliderDone } = useContext(AuthContext);
  return introSliderDone;
};

export const useWalletExist = () => {
  //
  const { walletExist } = useContext(AuthContext);
  return walletExist;
};

export const createWallet = () => {
  const { walletCreate } = useContext(AuthContext);
  return walletCreate;
};

export const removeWallet = () => {
  //AuthProvider안에 선언된 walletRemove 함수를 리턴한다(이 함수는 AsyncStorage값을 변경하여 저장함)
  const { walletRemove } = useContext(AuthContext);
  return walletRemove;
};

export const useButtonActive = () => {
  //토글 버튼 활성화 여부를 리턴하는 함수
  const { buttonActive } = useContext(AuthContext);
  return buttonActive;
};

export const buttonActiveToggle = () => {
  //토글 버튼 활성화 여부를 변경하는 함수
  const { activeButton } = useContext(AuthContext);
  return activeButton;
};
