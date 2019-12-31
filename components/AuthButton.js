import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";
import constants from "../constants";
import PropTypes from "prop-types";
import { LinearGradient } from "expo-linear-gradient";

const View = styled.View`
  width: ${constants.width * 0.9};
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 2%;
`;

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  justify-content: center;
  height: 55px;
`;

const Text = styled.Text`
  flex: 1;
  color: white;
  top: 30%;
  text-align: center;
  font-size: 17px;
`;

const AuthButton = ({ text, onPress, loading = false }) => (
  <View>
    <Touchable disabled={loading} onPress={onPress}>
      <LinearGradient
        style={{ borderRadius: 10 }}
        colors={["#5d4be3", "#709bff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Container>
          {loading ? (
            <ActivityIndicator size={"large"} color={"white"} />
          ) : (
            <Text>{text}</Text>
          )}
        </Container>
      </LinearGradient>
    </Touchable>
  </View>
);

AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default AuthButton;
