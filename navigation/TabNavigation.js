import React, { useState } from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Transfer from "../screens/Tabs/Transfer";

import MyInfo from "../screens/Tabs/Myinfo";
import { createStackNavigator } from "react-navigation-stack";
//import MessagesLink from "../components/MessagesLink"
import AddButton from "../components/AddButton";
const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    initialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    }
  });

export default createBottomTabNavigator(
  {
    Wallet: {
      screen: stackFactory(Transfer, {
        headerTitle: "송금",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Image
            style={{ height: 25 }}
            resizeMode="contain"
            source={
              focused
                ? require("../assets/images/nav_wallet_icon.png")
                : require("../assets/images/nav_wallet_icon_off.png")
            }
          ></Image>
        )
      }
    },
    // Our plus button
    Adding: {
      screen: () => null, // Empty screen
      navigationOptions: ({ navigation }) => {
        return {
          tabBarIcon: () => <AddButton navigation={navigation} />
        };
      }
    },

    MyInfo: {
      screen: stackFactory(MyInfo, {
        headerTitle: "내 정보",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Image
            style={{ height: 25 }}
            resizeMode="contain"
            source={
              focused
                ? // ? require("../assets/images/nav_list_icon.png")
                  // : require("../assets/images/nav_list_icon_off.png")
                  require("../assets/images/nav_user_icon.png")
                : require("../assets/images/nav_user_icon.png")
            }
          ></Image>
        )
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false, // hide labels
      activeTintColor: "#F8F8F8", // active icon color
      inactiveTintColor: "#586589", // inactive icon color
      style: {
        height: 50,
        backgroundColor: "#242136" // TabBar background
      }
    }
  }
);
