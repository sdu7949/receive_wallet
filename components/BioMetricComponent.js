import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Animated } from "react-native";
import { useLogOut } from "../AuthContext";

const View = styled.View`
  flex: 1;
  background-color: ${props => props.theme.backGroundColor};
  justify-content: center;
  align-items: center;
`;

const Touchable = styled.TouchableOpacity`
  width: 30%;
  align-items: center;
  justify-content: center;
`;

const FingerPrintImage = styled.Image`
  width: 30%;
`;

const TouchFingerPrintImage = styled.Image`
  width: 100%;
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  margin-bottom: 10%;
`;

const BioMetricComponent = ({
  text,
  type,
  setBioCheck = null,
  bioMetric = null
}) => {
  const [size] = useState(new Animated.Value(75));

  useEffect(() => {
    if (type) {
      Animated.loop(
        Animated.timing(
          size, // The value to drive
          {
            toValue: 100,
            duration: 1000
          }
        )
      ).start();
    }
  }, [type]);
  return (
    <>
      <View>
        {!type ? (
          <>
            <FingerPrintImage
              style={{ resizeMode: "contain" }}
              source={require("../assets/images/Fingerprint_Recognition_icon.png")}
            />
            <Text>{text}</Text>
            <FingerPrintImage
              style={{ resizeMode: "contain" }}
              source={require("../assets/images/Fingerprint_Recognition_loading_icon.png")}
            />
          </>
        ) : (
          <>
            <Touchable
              onPress={() => {
                setBioCheck(null);
                bioMetric();
              }}
            >
              <Animated.Image
                style={{ width: size, resizeMode: "contain" }}
                source={require("../assets/images/Fingerprint_Recognition_icon.png")}
              />
            </Touchable>
            <Text>{text}</Text>
            <FingerPrintImage
              style={{ resizeMode: "contain" }}
              source={require("../assets/images/Fingerprint_Recognition_loading_icon.png")}
            />
          </>
        )}
      </View>
    </>
  );
};

BioMetricComponent.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

export default BioMetricComponent;
