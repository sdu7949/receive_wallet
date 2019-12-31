import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import HoldingAssert from "../screens/MyInfo/HoldingAssert";
import KeyManage from "../screens/MyInfo/KeyManage";
import AppLock from "../screens/MyInfo/AppLock";
import Backup from "../screens/MyInfo/Backup";
import BioMetric from "../screens/Auth/BioMetric";
import TransferSecond from "../screens/Tabs/TransferSecond";
import CoinHistory from "../screens/Tabs/CoinHistory";
import PurchaseRequest from "../screens/Tabs/PurchaseRequest";
import InvestCondition from "../screens/MyInfo/InvestCondition";
import ExchangeRequest from "../screens/Tabs/ExchangeRequest";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    initialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    }
  });
const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    HoldingAssert: {
      screen: stackFactory(HoldingAssert, {
        headerTitle: "총 보유자산",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
      // 이렇게 설정하니까 header가 사라지네
      // screen: HoldingAssert,
      // navigationOptions: {

      //     headerTitle: "총 보유자산",
      //     headerTintColor: "#BBBBBB",
      //     headerStyle: {
      //         textAlign: "center",
      //         backgroundColor: '#0b081f'
      //     }
      // }
    },
    CoinHistory: {
      screen: stackFactory(CoinHistory, {
        headerTitle: "거래 내역",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    InvestCondition: {
      screen: stackFactory(InvestCondition, {
        headerTitle: "투자 현황",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    PurchaseRequest: {
      screen: stackFactory(PurchaseRequest, {
        headerTitle: "구매 신청",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    ExchangeRequest: {
      screen: stackFactory(ExchangeRequest, {
        headerTitle: "환전 신청",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    KeyManage: {
      screen: stackFactory(KeyManage, {
        headerTitle: "보안 키 관리",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    AppLock: {
      screen: stackFactory(AppLock, {
        headerTitle: "인증 비밀번호",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    BioMetric: {
      screen: BioMetric
    },
    Backup: {
      screen: stackFactory(Backup, {
        headerTitle: "보안 키 백업",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    },
    TransferSecond: {
      screen: stackFactory(TransferSecond, {
        headerTitle: "송금 주소",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      })
    }
  },
  {
    headerMode: "none",
    made: "modal"
  }
);

export default createAppContainer(MainNavigation);
