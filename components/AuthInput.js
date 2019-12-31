import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";
import styles from "../styles";

const Image = styled.Image`
  width: 10%;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
`;

const Container = styled.View`
  flex-direction: row;
  width: ${constants.width * 0.8};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.borderBottomColor};
`;
const TextInput = styled.TextInput`
  width: 80%;
  height: 40px;
  font-family: "NotoSansKR-Regular";
  color: white;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const AuthInput = ({
  type,
  placeholder,
  value,
  autoCapitalize = "none",
  returnKeyType = "done",
  onChange,
  onSubmitEditing = () => null,
  autoCorrect = true
}) => (
  <Container>
    {type === "ID" ? (
      <>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("../assets/images/login_id_icon.png")}
        ></Image>
        <TextInput
          secureTextEntry={false}
          placeholderTextColor="white"
          onChangeText={onChange}
          keyboardType="email-address"
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          value={value}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          autoCorrect={autoCorrect}
        />
      </>
    ) : (
      <>
        <Image
          style={{ resizeMode: "contain" }}
          source={require("../assets/images/login_pw_icon.png")}
        ></Image>
        <TextInput
          secureTextEntry={true}
          keyboardType="default"
          placeholderTextColor="white"
          onChangeText={onChange}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          value={value}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          autoCorrect={autoCorrect}
        />
      </>
    )}
  </Container>
);

AuthInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
  onEndEditing: PropTypes.func,
  autoCorrect: PropTypes.bool
};

export default AuthInput;
