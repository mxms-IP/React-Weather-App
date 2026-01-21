import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground, ActivityIndicator, Platform } from "react-native";
import * as Location from 'expo-location';
import ForecastSearch from "./components/ForecastSearch";
import CurrentForecast from "./components/CurrentForecast";
import DailyForecast from "./components/DailyForecast";
import styled from "styled-components/native";
import config from "./config";
import bgImg from "./assets/4.png";
import { 
  API, 
  DEFAULTS, 
  COLORS, 
  LAYOUT,
  detectCountryFromPostal 
} from './constants';

const App = () => {
  const [toggleSearch, setToggleSearch] = useState(DEFAULTS.SEARCH_MODE);
  const [city, setCity] = useState(DEFAULTS.LOCATION.CITY);
  const [postalCode, setPostalCode] = useState(DEFAULTS.LOCATION.POSTAL_CODE);
  const [lat, setLat] = useState(DEFAULTS.LOCATION.LATITUDE);
  const [long, setLong] = useState(DEFAULTS.LOCATION.LONGITUDE);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState(""); // Store detected location name
  const [errorState, setErrorState] = useState({
    hasError: false,
    message: "",
    type: "",
    canRetry: true
  });

  const controller = new AbortController();
  const signal = controller.signal;

  /**
   * Request location permission and get current location
   * Called automatically on app load
   */
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorState({
          hasError: true,
          message: "Location permission denied. Please enable location access in settings or search manually.",
          type: "permission_denied",
          canRetry: false
        });
        setLoading(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get city name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.district || address.region || "Your Location";
        setLocationName(cityName);
        setCity(cityName);
      }

      // Update coordinates
      setLat(latitude);
      setLong(longitude);
      
      clearError();
      
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorState({
        hasError: true,
        message: "Unable to get your location. You can search manually instead.",
        type: "location_error",
        canRetry: true
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-detect location on app load
   */
  useEffect(() => {
    getCurrentLocation();
  }, []);

  /**
   * Unified error handler
   */
  const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    
    let errorInfo = {
      hasError: true,
      message: "",
      type: "unknown",
      canRetry: true
    };

    if (error.message === "CITY_NOT_FOUND" || error.message === "POSTAL_NOT_FOUND") {
      errorInfo = {
        hasError: true,
        message: context === "city" 
          ? `We couldn't find "${city}". Please check the spelling or try a different city.`
          : `We couldn't find postal code "${postalCode}". Please verify the code or try searching by city name.`,
        type: "not_found",
        canRetry: true
      };
    } else if (error.message === "INVALID_API_KEY") {
      errorInfo = {
        hasError: true,
        message: "Service configuration error. Please contact support.",
        type: "api_key",
        canRetry: false
      };
    } else if (error.message === "Failed to fetch" || error.message === "Network request failed") {
      errorInfo = {
        hasError: true,
        message: "Unable to connect to the weather service. Please check your internet connection.",
        type: "network",
        canRetry: true
      };
    } else if (error.message.includes("WEATHER") || error.message.includes("FORECAST")) {
      errorInfo = {
        hasError: true,
        message: "Unable to load weather data for this location. Please try a different location.",
        type: "data_error",
        canRetry: true
      };
    } else {
      errorInfo = {
        hasError: true,
        message: "Something went wrong. Please try again or search for a different location.",
        type: "unknown",
        canRetry: true
      };
    }

    setErrorState(errorInfo);
    setLoading(false);
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setErrorState({
      hasError: false,
      message: "",
      type: "",
      canRetry: true
    });
  };

  /**
   * Validates city input
   */
  const validateCityInput = () => {
    if (!city || city.trim().length === 0) {
      setErrorState({
        hasError: true,
        message: "Please enter a city name.",
        type: "validation",
        canRetry: true
      });
      return false;
    }

    if (city.trim().length < 2) {
      setErrorState({
        hasError: true,
        message: "City name must be at least 2 characters long.",
        type: "validation",
        canRetry: true
      });
      return false;
    }

    return true;
  };

  /**
   * Validates postal code input
   */
  const validatePostalInput = () => {
    if (!postalCode || postalCode.trim().length === 0) {
      setErrorState({
        hasError: true,
        message: "Please enter a postal code.",
        type: "validation",
        canRetry: true
      });
      return false;
    }

    const cleanPostalCode = postalCode.replace(/\s/g, '');
    if (cleanPostalCode.length < 3) {
      setErrorState({
        hasError: true,
        message: "Postal code is too short. Please enter a valid postal code.",
        type: "validation",
        canRetry: true
      });
      return false;
    }

    return true;
  };

  /**
   * Fetches coordinates by city name
   */
  const fetchLatLongHandler = () => {
    if (!validateCityInput()) return;

    clearError();
    setLoading(true);

    fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CURRENT_WEATHER}?q=${city.trim()}&units=${API.PARAMS.UNITS}&appid=${config.API_KEY}`
    )
      .then((res) => {
        if (res.status === 401) throw new Error("INVALID_API_KEY");
        if (res.status === 404) throw new Error("CITY_NOT_FOUND");
        if (!res.ok) throw new Error("NETWORK_ERROR");
        return res.json();
      })
      .then((data) => {
        if (data.coord && data.coord.lat && data.coord.lon) {
          setLat(data.coord.lat);
          setLong(data.coord.lon);
          setLocationName(data.name); // Update location name from API
          clearError();
        } else {
          throw new Error("CITY_NOT_FOUND");
        }
      })
      .catch((err) => {
        handleError(err, "city");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Fetches coordinates by postal code
   */
  const fetchByPostalHandler = () => {
    if (!validatePostalInput()) return;

    clearError();
    setLoading(true);

    const cleanPostalCode = postalCode.replace(/\s/g, '');
    const countryCode = detectCountryFromPostal(postalCode);
    
    fetch(
      `${API.GEO_BASE_URL}${API.ENDPOINTS.GEO_ZIP}?zip=${cleanPostalCode},${countryCode}&appid=${config.API_KEY}`
    )
      .then((res) => {
        if (res.status === 401) throw new Error("INVALID_API_KEY");
        if (res.status === 404) throw new Error("POSTAL_NOT_FOUND");
        if (!res.ok) throw new Error("NETWORK_ERROR");
        return res.json();
      })
      .then((data) => {
        if (data.lat && data.lon) {
          setLat(data.lat);
          setLong(data.lon);
          setLocationName(data.name || postalCode); // Update location name
          clearError();
        } else {
          throw new Error("POSTAL_NOT_FOUND");
        }
      })
      .catch((err) => {
        handleError(err, "postal");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Fetches weather data
   */
  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !long || isNaN(lat) || isNaN(long)) {
        return;
      }

      setLoading(true);

      try {
        const currentRes = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.CURRENT_WEATHER}?lat=${lat}&lon=${long}&units=${API.PARAMS.UNITS}&appid=${config.API_KEY}`
        );

        if (currentRes.status === 401) throw new Error("INVALID_API_KEY");
        if (!currentRes.ok) throw new Error("WEATHER_FETCH_ERROR");

        const currentData = await currentRes.json();

        if (!currentData.main || !currentData.weather) {
          throw new Error("INVALID_WEATHER_DATA");
        }

        const forecastRes = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.FORECAST_5DAY}?lat=${lat}&lon=${long}&units=${API.PARAMS.UNITS}&appid=${config.API_KEY}`
        );

        if (!forecastRes.ok) throw new Error("FORECAST_FETCH_ERROR");

        const forecastData = await forecastRes.json();

        if (!forecastData.list || forecastData.list.length === 0) {
          throw new Error("INVALID_FORECAST_DATA");
        }

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
        clearError();
      } catch (err) {
        handleError(err, "weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, [lat, long]);

  /**
   * Transforms forecast data to daily format
   */
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
          <ContentContainer>
            {/* Location Button */}
            <LocationButtonContainer>
              <LocationButton onPress={getCurrentLocation} activeOpacity={0.7}>
                <LocationIcon>📍</LocationIcon>
                <LocationText>Use My Location</LocationText>
              </LocationButton>
              {locationName && (
                <CurrentLocationText>Showing: {locationName}</CurrentLocationText>
              )}
            </LocationButtonContainer>

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
            
            {errorState.hasError && (
              <ErrorCard>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorMessage>{errorState.message}</ErrorMessage>
                {errorState.canRetry && errorState.type !== "permission_denied" && (
                  <RetryButton 
                    onPress={() => {
                      clearError();
                      if (toggleSearch === "city") {
                        fetchLatLongHandler();
                      } else {
                        fetchByPostalHandler();
                      }
                    }}
                  >
                    <RetryButtonText>Try Again</RetryButtonText>
                  </RetryButton>
                )}
                {errorState.type === "not_found" && toggleSearch === "postal" && (
                  <SecondaryButton onPress={() => {
                    clearError();
                    setToggleSearch("city");
                  }}>
                    <SecondaryButtonText>Search by City Instead</SecondaryButtonText>
                  </SecondaryButton>
                )}
              </ErrorCard>
            )}

            {loading && (
              <LoadingContainer>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <LoadingText>
                  {errorState.type === "permission_denied" ? "Waiting for permission..." : "Loading weather data..."}
                </LoadingText>
              </LoadingContainer>
            )}

            {!loading && weather.current && (
              <>
                <CurrentForecast currentWeather={weather} timezone={weather.timezone} />
                
                {weather.daily && weather.daily.length > 0 && (
                  weather.daily.map((day, index) => {
                    if (index !== 0) {
                      return <DailyForecast key={day.dt} day={day} index={index} />;
                    }
                    return null;
                  })
                )}
              </>
            )}

            {!loading && !weather.current && !errorState.hasError && (
              <EmptyState>
                <EmptyIcon>🌤️</EmptyIcon>
                <EmptyText>Tap "Use My Location" or search for a city</EmptyText>
              </EmptyState>
            )}
          </ContentContainer>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.BACKGROUND};
`;

const ContentContainer = styled.View`
  width: 100%;
  max-width: ${LAYOUT.MAX_WIDTH}px;
  align-self: center;
  padding: 0 ${LAYOUT.HORIZONTAL_PADDING}px;
`;

const LocationButtonContainer = styled.View`
  margin-top: ${LAYOUT.VERTICAL_PADDING}px;
  margin-bottom: ${LAYOUT.SECTION_SPACING}px;
  align-items: center;
`;

const LocationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: ${LAYOUT.BORDER_RADIUS.LARGE}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const LocationIcon = styled.Text`
  font-size: 20px;
  margin-right: 8px;
`;

const LocationText = styled.Text`
  color: white;
  font-size: 15px;
  font-weight: 600;
`;

const CurrentLocationText = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin-top: 8px;
  font-style: italic;
`;

const ErrorCard = styled.View`
  background-color: rgba(255, 107, 107, 0.95);
  border-radius: ${LAYOUT.BORDER_RADIUS.MEDIUM}px;
  padding: ${LAYOUT.HORIZONTAL_PADDING}px;
  margin: ${LAYOUT.SECTION_SPACING}px 0;
  align-items: center;
`;

const ErrorIcon = styled.Text`
  font-size: 32px;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.Text`
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 22px;
  margin-bottom: 12px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: white;
  padding: 10px 24px;
  border-radius: 20px;
  margin-top: 8px;
`;

const RetryButtonText = styled.Text`
  color: #ff6b6b;
  font-weight: 600;
  font-size: 14px;
`;

const SecondaryButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  margin-top: 8px;
`;

const SecondaryButtonText = styled.Text`
  color: white;
  font-weight: 500;
  font-size: 13px;
`;

const LoadingContainer = styled.View`
  padding: ${LAYOUT.VERTICAL_PADDING * 2}px 0;
  align-items: center;
`;

const LoadingText = styled.Text`
  color: ${COLORS.TEXT.WHITE};
  font-size: 16px;
  margin-top: 12px;
  font-style: italic;
`;

const EmptyState = styled.View`
  padding: ${LAYOUT.VERTICAL_PADDING * 3}px ${LAYOUT.HORIZONTAL_PADDING}px;
  align-items: center;
`;

const EmptyIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.Text`
  color: ${COLORS.TEXT.WHITE};
  font-size: 18px;
  text-align: center;
  opacity: 0.9;
`;

export default App;