import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants';
import { Image } from 'react-native';

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
          placeholderTextColor={COLORS.PLACEHOLDER}
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
          <Image  
            style={{ width: 20, height: 20 }} 
            source={{ uri: 'https://img.icons8.com' }} 
          />
        </SearchIconButton>

      </SearchBarContainer>
    </Container>
  );
};

const Container = styled.View`
  padding: ${LAYOUT.VERTICAL_PADDING+10}px 0 10px 0;
  width: 100%;
`;

const ToggleContainer = styled.View`
  flex-direction: row;
  background-color: ${COLORS.TOGGLE_BG};
  border-radius: ${LAYOUT.BORDER_RADIUS.LARGE}px;
  padding: 4px;
  margin-bottom: ${LAYOUT.ELEMENT_SPACING}px;
  align-self: center;
`;

const ToggleButton = styled.TouchableOpacity`
  padding: 10px 24px;
  border-radius: 22px;
  background-color: ${props => props.active ? COLORS.TEXT.WHITE : 'transparent'};
`;

const ToggleText = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.LABEL}px;
  font-weight: ${props => props.active ? TYPOGRAPHY.WEIGHTS.SEMIBOLD : TYPOGRAPHY.WEIGHTS.MEDIUM};
  color: ${props => props.active ? COLORS.PRIMARY : 'rgba(255, 255, 255, 0.9)'};
`;

const SearchBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.TEXT.WHITE};
  border-radius: ${LAYOUT.BORDER_RADIUS.LARGE}px;
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
  padding: 12px ${LAYOUT.HORIZONTAL_PADDING}px;
  font-size: ${TYPOGRAPHY.SIZES.BODY}px;
  color: ${COLORS.TEXT.PRIMARY};
  border-width: 0;
  outline-width: 0;
  outline-style: none;
`;

const SearchIconButton = styled.TouchableOpacity`
  background-color: ${COLORS.SECONDARY};
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