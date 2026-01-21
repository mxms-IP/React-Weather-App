import React from "react";
import styled from "styled-components/native";
import { getIconUrl, LAYOUT, COLORS, TYPOGRAPHY } from '../constants';

const CurrentForecast = ({ currentWeather }) => {
  if (!currentWeather || !currentWeather.current) {
    return null;
  }

  const { current } = currentWeather;

  return (
    <Container>
      <CurrentTempView>
        <WeatherIcon
          source={{
            uri: getIconUrl(current.weather[0].icon, 'LARGE'),
          }}
          resizeMode={"contain"}
        />
        <Temperature>{Math.round(current.temp)}°C</Temperature>
      </CurrentTempView>
      
      <Description>{current.weather[0].description}</Description>

      <DetailsCard>
        <DetailRow>
          <DetailItem>
            <DetailLabel>FEELS</DetailLabel>
            <DetailValue>{Math.round(current.feels_like)}°C</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>LOW</DetailLabel>
            <DetailValue>
              {currentWeather.daily && currentWeather.daily[0] 
                ? `${Math.round(currentWeather.daily[0].temp.min)}°C`
                : 'N/A'}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>HIGH</DetailLabel>
            <DetailValue>
              {currentWeather.daily && currentWeather.daily[0]
                ? `${Math.round(currentWeather.daily[0].temp.max)}°C`
                : 'N/A'}
            </DetailValue>
          </DetailItem>
        </DetailRow>

        <DetailRow>
          <DetailItem>
            <DetailLabel>WIND</DetailLabel>
            <DetailValue>{current.wind_speed.toFixed(2)} M/S</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>HUMIDITY</DetailLabel>
            <DetailValue>{current.humidity}%</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>RAIN</DetailLabel>
            <DetailValue>
              {currentWeather.daily && currentWeather.daily[0] && currentWeather.daily[0].rain
                ? `${currentWeather.daily[0].rain.toFixed(1)} MM`
                : '0 MM'}
            </DetailValue>
          </DetailItem>
        </DetailRow>
      </DetailsCard>
    </Container>
  );
};

const Container = styled.View`
  padding: ${LAYOUT.VERTICAL_PADDING}px 0;
  align-items: center;
  width: 100%;
`;

const CurrentTempView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const WeatherIcon = styled.Image`
  width: 80px;
  height: 80px;
`;

const Temperature = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.HERO}px;
  font-weight: ${TYPOGRAPHY.WEIGHTS.LIGHT};
  color: ${COLORS.TEXT.WHITE};
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
`;

const Description = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.TITLE}px;
  color: ${COLORS.TEXT.WHITE};
  text-transform: capitalize;
  margin-bottom: 20px;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
`;

const DetailsCard = styled.View`
  background-color: ${COLORS.CARD_BG};
  border-radius: ${LAYOUT.BORDER_RADIUS.MEDIUM}px;
  padding: ${LAYOUT.HORIZONTAL_PADDING}px;
  width: 100%;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${LAYOUT.ELEMENT_SPACING}px;
`;

const DetailItem = styled.View`
  align-items: center;
  flex: 1;
`;

const DetailLabel = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.SMALL}px;
  color: ${COLORS.TEXT.SECONDARY};
  margin-bottom: 6px;
  font-weight: ${TYPOGRAPHY.WEIGHTS.SEMIBOLD};
  letter-spacing: 0.5px;
`;

const DetailValue = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.SUBHEADING}px;
  font-weight: ${TYPOGRAPHY.WEIGHTS.SEMIBOLD};
  color: ${COLORS.TEXT.PRIMARY};
`;

export default CurrentForecast;