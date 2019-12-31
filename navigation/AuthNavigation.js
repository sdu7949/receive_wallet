import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Auth/Login";
import SignUp from "../screens/Auth/SignUp";
import SignUpComplete from "../screens/Auth/SignUpComplete";
import AuthPhone from "../screens/Auth/AuthPhone";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    initialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    }
  });

const AuthNavigation = createStackNavigator(
  {
    Login,
    SignUp: stackFactory(SignUp, {
      title: "회원가입",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0
      }
      // headerLeft: <BackLink />
    }),
    AuthPhone: stackFactory(AuthPhone, {
      title: "회원가입",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0
      }
    }),
    SignUpComplete: stackFactory(SignUpComplete, {
      title: "가입완료",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0
      },
      gesturesEnabled: false
    })
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AuthNavigation);
