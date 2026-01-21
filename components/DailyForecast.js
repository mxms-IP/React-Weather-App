import React from "react";
import styled from "styled-components/native";
import moment from "moment";
import { getIconUrl, COLORS, LAYOUT, TYPOGRAPHY } from '../constants';

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
            uri: getIconUrl(day.weather[0].icon, 'SMALL'),
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

const DayContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.CARD_BG};
  border-radius: ${LAYOUT.BORDER_RADIUS.MEDIUM}px;
  padding: 16px ${LAYOUT.HORIZONTAL_PADDING}px;
  margin-bottom: ${LAYOUT.CARD_SPACING}px;
  width: 100%;
`;

const LeftSection = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const DayName = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.SUBHEADING}px;
  font-weight: ${TYPOGRAPHY.WEIGHTS.BOLD};
  color: ${COLORS.TEXT.PRIMARY};
  letter-spacing: 0.3px;
`;

const DateText = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.CAPTION}px;
  color: ${COLORS.TEXT.SECONDARY};
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
  font-size: ${TYPOGRAPHY.SIZES.LABEL}px;
  color: ${COLORS.TEXT.LIGHT};
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
  font-size: ${TYPOGRAPHY.SIZES.HEADING}px;
  font-weight: ${TYPOGRAPHY.WEIGHTS.BOLD};
  color: ${COLORS.TEXT.PRIMARY};
`;

const TempDivider = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.BODY}px;
  color: ${COLORS.TEXT.TERTIARY};
  margin: 0 4px;
`;

const LowTemp = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.SUBHEADING}px;
  font-weight: ${TYPOGRAPHY.WEIGHTS.MEDIUM};
  color: ${COLORS.TEXT.SECONDARY};
`;

const FeelsLike = styled.Text`
  font-size: ${TYPOGRAPHY.SIZES.SMALL}px;
  color: ${COLORS.TEXT.TERTIARY};
  margin-top: 4px;
`;

export default React.memo(DailyForecast);
