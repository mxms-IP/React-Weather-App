import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const ForecastSearch = ({
  city,
  setCity,
  fetchLatLongHandler,
  toggleSearch,
  setToggleSearch,
  fetchByPostalHandler,
  setPostalCode,
  postalCode,
}) => {
  const handleSearch = () => {
    if (toggleSearch === "city") {
      fetchLatLongHandler();
    } else {
      fetchByPostalHandler();
    }
  };

  return (
    <Container>
      <ToggleContainer>
        <ToggleButton
          active={toggleSearch === "city"}
          onPress={() => setToggleSearch("city")}
          activeOpacity={0.7}
        >
          <ToggleText active={toggleSearch === "city"}>City</ToggleText>
        </ToggleButton>
        
        <ToggleButton
          active={toggleSearch === "postal"}
          onPress={() => setToggleSearch("postal")}
          activeOpacity={0.7}
        >
          <ToggleText active={toggleSearch === "postal"}>Postal Code</ToggleText>
        </ToggleButton>
      </ToggleContainer>

      <SearchBarContainer>
        <StyledInput
          placeholder={
            toggleSearch === "city" ? "Enter city name" : "Enter postal code"
          }
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={toggleSearch === "city" ? city : postalCode}
          onChangeText={(text) => {
            if (toggleSearch === "city") {
              setCity(text);
            } else {
              setPostalCode(text);
            }
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        
        <SearchIconButton onPress={handleSearch} activeOpacity={0.7}>
          <SearchIcon><img width="20" height="20" src="https://img.icons8.com/ios/50/search--v1.png" alt="search--v1"/></SearchIcon>
        </SearchIconButton>
      </SearchBarContainer>
    </Container>
  );
};

const Container = styled.View`
  padding: 20px 0 10px 0;
  width: 100%;
`;

const ToggleContainer = styled.View`
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 25px;
  padding: 4px;
  margin-bottom: 15px;
  align-self: center;
`;

const ToggleButton = styled.TouchableOpacity`
  padding: 10px 24px;
  border-radius: 22px;
  background-color: ${props => props.active ? 'white' : 'transparent'};
`;

const ToggleText = styled.Text`
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? '#4a90e2' : 'rgba(255, 255, 255, 0.9)'};
`;

const SearchBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 25px;
  padding: 4px;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  padding: 12px 20px;
  font-size: 16px;
  color: #2c3e50;
  border-width: 0;
  outline-width: 0;
  outline-style: none;
`;

const SearchIconButton = styled.TouchableOpacity`
  background-color: #6a9bb3;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
`;

const SearchIcon = styled.Text`
  font-size: 20px;
`;

export default ForecastSearch;