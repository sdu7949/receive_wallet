import React from "react";
import RNPickerSelect from "react-native-picker-select";

const banks = [
  { label: "Football", value: "football" },
  { label: "Baseball", value: "baseball" },
  { label: "Hockey", value: "hockey" }
];
const pickerStyle = {
  inputIOS: {
    color: "black",
    backgroundColor: "white",
    paddingLeft: "5%"
  },
  inputAndroid: {
    color: "black",
    backgroundColor: "white",
    paddingLeft: "5%"
  },
  placeholderColor: "white"
};

export default ({ setSelectBank }) => {
  return (
    <RNPickerSelect
      style={pickerStyle}
      placeholder={{}}
      items={banks}
      onValueChange={value => {
        setSelectBank(value);
      }}
      InputAccessoryView={() => null}
    />
  );
};
