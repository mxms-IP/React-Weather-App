import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground } from "react-native";
import ForecastSearch from "./components/ForecastSearch";
import CurrentForecast from "./components/CurrentForecast";
import DailyForecast from "./components/DailyForecast";
import styled from "styled-components/native";
import config from "./config";
import bgImg from "./assets/4.png";

const App = () => {
  const [toggleSearch, setToggleSearch] = useState("city");
  const [city, setCity] = useState("Toronto");
  const [postalCode, setPostalCode] = useState("L4W1S9");
  const [lat, setLat] = useState(43.6532);
  const [long, setLong] = useState(-79.3832);
  const [weather, setWeather] = useState({});

  const controller = new AbortController();
  const signal = controller.signal;

  const fetchLatLongHandler = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.coord) {
          setLat(data.coord.lat);
          setLong(data.coord.lon);
        }
      })
      .catch((err) => {
        console.log("Error fetching city:", err);
      });
  };

  const fetchByPostalHandler = () => {
    const cleanPostalCode = postalCode.replace(/\s/g, "");
    let countryCode = "US";
    
    if (/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(cleanPostalCode)) {
      countryCode = "CA";
    } else if (/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/.test(postalCode)) {
      countryCode = "GB";
    } else if (/^\d{4}$/.test(cleanPostalCode)) {
      countryCode = "AU";
    }
    
    fetch(
      `http://api.openweathermap.org/geo/1.0/zip?zip=${cleanPostalCode},${countryCode}&appid=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.lat && data.lon) {
          setLat(data.lat);
          setLong(data.lon);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${config.API_KEY}`
        );
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${config.API_KEY}`
        );
        const forecastData = await forecastRes.json();

        const transformed = {
          lat: lat,
          lon: long,
          timezone: currentData.timezone,
          timezone_offset: currentData.timezone,
          current: {
            dt: currentData.dt,
            sunrise: currentData.sys?.sunrise || 0,
            sunset: currentData.sys?.sunset || 0,
            temp: currentData.main?.temp || 0,
            feels_like: currentData.main?.feels_like || 0,
            pressure: currentData.main?.pressure || 0,
            humidity: currentData.main?.humidity || 0,
            dew_point: 0,
            uvi: 0,
            clouds: currentData.clouds?.all || 0,
            visibility: currentData.visibility || 0,
            wind_speed: currentData.wind?.speed || 0,
            wind_deg: currentData.wind?.deg || 0,
            weather: currentData.weather || [],
          },
          daily: transformToDailyForecast(forecastData.list),
        };

        setWeather(transformed);
      } catch (err) {
        console.log("Error fetching weather:", err);
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, [lat, long]);

  const transformToDailyForecast = (forecastList) => {
    if (!forecastList || forecastList.length === 0) return [];

    const dailyMap = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      if (!dailyMap[date]) {
        dailyMap[date] = {
          dt: item.dt,
          sunrise: 0,
          sunset: 0,
          moonrise: 0,
          moonset: 0,
          moon_phase: 0,
          temp: {
            day: item.main.temp,
            min: item.main.temp_min,
            max: item.main.temp_max,
            night: item.main.temp,
            eve: item.main.temp,
            morn: item.main.temp,
          },
          feels_like: {
            day: item.main.feels_like,
            night: item.main.feels_like,
            eve: item.main.feels_like,
            morn: item.main.feels_like,
          },
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          dew_point: 0,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          wind_gust: item.wind.gust || 0,
          weather: item.weather,
          clouds: item.clouds.all,
          pop: item.pop || 0,
          rain: item.rain ? item.rain["3h"] || 0 : 0,
          uvi: 0,
        };
      } else {
        dailyMap[date].temp.min = Math.min(
          dailyMap[date].temp.min,
          item.main.temp_min
        );
        dailyMap[date].temp.max = Math.max(
          dailyMap[date].temp.max,
          item.main.temp_max
        );
        
        dailyMap[date].feels_like.day = 
          (dailyMap[date].feels_like.day + item.main.feels_like) / 2;
      }
    });

    return Object.values(dailyMap).slice(0, 7);
  };

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Unified Container for ALL content - ensures consistent width */}
          <ContentContainer>
            <ForecastSearch
              city={city}
              setCity={setCity}
              fetchLatLongHandler={fetchLatLongHandler}
              toggleSearch={toggleSearch}
              setToggleSearch={setToggleSearch}
              fetchByPostalHandler={fetchByPostalHandler}
              setPostalCode={setPostalCode}
              postalCode={postalCode}
            />
            
            <CurrentForecast currentWeather={weather} timezone={weather.timezone} />
            
            {weather.daily && weather.daily.length > 0 ? (
              weather.daily.map((day, index) => {
                if (index !== 0) {
                  return <DailyForecast key={day.dt} day={day} index={index} />;
                }
                return null;
              })
            ) : null}
          </ContentContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #4a90e2;
`;

// CRITICAL: This container enforces consistent width for ALL children
const ContentContainer = styled.View`
  width: 100%;
  max-width: 600px;
  align-self: center;
  padding: 0 20px;
`;

export default App;