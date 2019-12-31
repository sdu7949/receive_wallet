import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";

const Container = styled.View`
  margin-top: 15px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  /* border: 1px solid red; */
`;

const Text = styled.Text`
  flex: 1;
  color: white;
`;

const TextInput = styled.TextInput`
  flex: 4;
  height: auto;
  /* border: 1px solid blue;0 */
  padding-right: 2%;
  color: white;
  text-align: right;
`;

const CoinInputBox = ({
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Container
      style={
        isFocus
          ? {
              borderBottomColor: "#5d4ce3"
            }
          : {
              borderBottomColor: "#555363"
            }
      }
    >
      <TextInput
        onFocus={() => setIsFocus(true)}
        onChangeText={onChange}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        value={value}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={autoCorrect}
      />
      <Text>Coin</Text>
    </Container>
  );
};

CoinInputBox.propTypes = {
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    "default",
    "number-pad",
    "decimal-pad",
    "numeric",
    "email-address",
    "phone-pad"
  ]),
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
  onEndEditing: PropTypes.func,
  autoCorrect: PropTypes.bool
};

export default CoinInputBox;
