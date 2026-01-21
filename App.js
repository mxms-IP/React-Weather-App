import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground, Alert } from "react-native";
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

  //fetch lat long by city (works worldwide)
  const fetchLatLongHandler = () => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.coord) {
          setLat(data.coord.lat);
          setLong(data.coord.lon);
        } else {
          console.log("City not found");
          Alert.alert("Error", "City not found. Please try again.");
        }
      })
      .catch((err) => {
        console.log("Error fetching city:", err);
        Alert.alert("Error", "Failed to fetch location. Please check your city name.");
      });
  };

  //fetch lat long by postal code using OpenWeather's FREE Geocoding API
  //NO GOOGLE API NEEDED! Works for many countries worldwide
  const fetchByPostalHandler = () => {
    // Auto-detect country based on postal code format
    const cleanPostalCode = postalCode.replace(/\s/g, ""); // Remove spaces
    let countryCode = "US"; // Default to US
    
    // Detect country based on postal code format
    if (/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(cleanPostalCode)) {
      // Canadian postal code (e.g., L4W1S9)
      countryCode = "CA";
    } else if (/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/.test(postalCode)) {
      // UK postal code (e.g., E14, SW1A 1AA)
      countryCode = "GB";
    } else if (/^\d{4}$/.test(cleanPostalCode)) {
      // Could be Australia (4 digits) or other countries
      countryCode = "AU";
    } else if (/^\d{5}$/.test(cleanPostalCode)) {
      // US zip code (5 digits)
      countryCode = "US";
    }
    
    console.log(`Searching for postal code: ${cleanPostalCode}, Country: ${countryCode}`);
    
    fetch(
      `http://api.openweathermap.org/geo/1.0/zip?zip=${cleanPostalCode},${countryCode}&appid=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.lat && data.lon) {
          setLat(data.lat);
          setLong(data.lon);
          console.log(`Found location: ${data.name}`);
        } else if (data.cod === "404") {
          console.log("Postal code not found");
          Alert.alert(
            "Not Found", 
            `Postal code not found in ${countryCode}. Try entering the city name instead.`
          );
        } else {
          console.log("Invalid postal code response:", data);
          Alert.alert("Error", "Could not find location. Try entering the city name instead.");
        }
      })
      .catch((err) => {
        console.log("Error fetching postal code:", err);
        Alert.alert("Error", "Failed to fetch location. Please try entering the city name instead.");
      });
  };

  //updates the weather when lat long changes
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${config.API_KEY}`,
      { signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    return () => controller.abort();
  }, [lat, long]);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <FutureForecastContainer>
            {weather.daily ? (
              weather.daily.map((day, index) => {
                if (index !== 0) {
                  return <DailyForecast key={day.dt} day={day} index={index} />;
                }
              })
            ) : (
              <NoWeather>No Weather to show</NoWeather>
            )}
          </FutureForecastContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const NoWeather = styled.Text`
  text-align: center;
  color: white;
`;

const FutureForecastContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default App;