import React from "react"
import styled from "styled-components"
import constants from "../constants";
import PropTypes from "prop-types"


const Touchable = styled.TouchableOpacity`
    flex:1;
    height : 40px;
`

const Container = styled.View`
    margin : 1%;
    background-color:${props => props.theme.subColor};
    padding : 10px;
    border-radius:10px;
    
`;
const Text = styled.Text`
    color:white;
    text-align:center;
    font-weight:100;
`;

const CoinButton = ({ text, onPress, loading = false }) => (
    <Touchable disabled={loading} onPress={onPress}>
        <Container>
            <Text>{text}</Text>
        </Container>
    </Touchable>
)

CoinButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
}

export default CoinButton