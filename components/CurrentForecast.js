import React from "react";
import styled from "styled-components/native";

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
            uri: `http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`,
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

// CRITICAL: No max-width - parent container controls width
const Container = styled.View`
  padding: 20px 0;
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
  font-size: 72px;
  font-weight: 300;
  color: white;
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
`;

const Description = styled.Text`
  font-size: 24px;
  color: white;
  text-transform: capitalize;
  margin-bottom: 20px;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
`;

const DetailsCard = styled.View`
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 15px;
`;

const DetailItem = styled.View`
  align-items: center;
  flex: 1;
`;

const DetailLabel = styled.Text`
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 6px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

export default CurrentForecast;