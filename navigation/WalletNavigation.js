import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import WalletsScreen from "../screens/Wallet/WalletsScreen";
import CreateWalletScreen from "../screens/Wallet/CreateWalletScreen";
import ImportWalletScreen from "../screens/Wallet/ImportWalletScreen";

const WalletNavigation = createStackNavigator(
  {
    WalletsScreen: {
      screen: WalletsScreen,
      navigationOptions: {
        headerTitle: "최초 지갑 생성",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      }
    },
    CreateWalletScreen: {
      screen: CreateWalletScreen,
      navigationOptions: {
        headerTitle: "지갑 생성",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      }
    },
    ImportWalletScreen: {
      screen: ImportWalletScreen,
      navigationOptions: {
        headerTitle: "지갑 불러오기",
        headerTintColor: "#BBBBBB",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#0b081f"
        }
      }
    }
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(WalletNavigation);
