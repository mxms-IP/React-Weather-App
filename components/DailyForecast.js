import React from "react";
import styled from "styled-components/native";
import moment from "moment";

const DailyForecast = ({ day, index }) => {
  return (
    <DayContainer>
      <LeftSection>
        <DayName>{moment(day.dt * 1000).format("ddd")}</DayName>
        <DateText>{moment(day.dt * 1000).format("MMM D")}</DateText>
      </LeftSection>

      <MiddleSection>
        <WeatherIcon
          source={{
            uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          }}
          resizeMode={"contain"}
        />
        <Description>{day.weather[0].description}</Description>
      </MiddleSection>

      <RightSection>
        <TempRange>
          <HighTemp>{Math.round(day.temp.max)}°</HighTemp>
          <TempDivider>/</TempDivider>
          <LowTemp>{Math.round(day.temp.min)}°</LowTemp>
        </TempRange>
        <FeelsLike>Feels {Math.round(day.feels_like.day)}°</FeelsLike>
      </RightSection>
    </DayContainer>
  );
};

// CRITICAL: No max-width, no margins - parent container controls width
const DayContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 8px;
  width: 100%;
`;

const LeftSection = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const DayName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 0.3px;
`;

const DateText = styled.Text`
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 2px;
`;

const MiddleSection = styled.View`
  flex: 1.5;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 8px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #34495e;
  text-transform: capitalize;
  flex-shrink: 1;
`;

const RightSection = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const TempRange = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

const HighTemp = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
`;

const TempDivider = styled.Text`
  font-size: 16px;
  color: #95a5a6;
  margin: 0 4px;
`;

const LowTemp = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #7f8c8d;
`;

const FeelsLike = styled.Text`
  font-size: 12px;
  color: #95a5a6;
  margin-top: 4px;
`;

export default DailyForecast;