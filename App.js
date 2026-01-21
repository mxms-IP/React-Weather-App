import React, { useEffect, useState } from "react";
import { ScrollView, ImageBackground, Alert, ActivityIndicator } from "react-native";
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
  const [errorState, setErrorState] = useState({
    hasError: false,
    message: "",
    type: "", // 'network', 'not_found', 'api_key', 'unknown'
    canRetry: true
  });

  const controller = new AbortController();
  const signal = controller.signal;

  /**
   * Unified error handler - single source of truth for errors
   * Prevents duplicate error displays
   * Categorizes errors for appropriate user messaging
   */
  const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    
    let errorInfo = {
      hasError: true,
      message: "",
      type: "unknown",
      canRetry: true
    };

    // Categorize error type
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
        canRetry: false // Don't let user retry if API key is wrong
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
      // Unknown error - use safe mode
      errorInfo = {
        hasError: true,
        message: "Something went wrong. Please try again or search for a different location.",
        type: "unknown",
        canRetry: true
      };
    }

    // Update error state (this shows in UI, not alert)
    setErrorState(errorInfo);
    setLoading(false);
    
    // DO NOT show Alert.alert - error is already displayed in UI
  };

  /**
   * Clear error state when user tries new search
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
   * Validates city input before making API call
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
   * Validates postal code input before making API call
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
   * Fetches latitude and longitude by city name
   * Handles all errors gracefully without alerts
   */
  const fetchLatLongHandler = () => {
    // Validate input first
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
   * Fetches latitude and longitude by postal code
   * Handles all errors gracefully without alerts
   */
  const fetchByPostalHandler = () => {
    // Validate input first
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
   * Fetches weather data using FREE OpenWeather APIs
   * Implements safe mode - continues showing last good data on errors
   */
  useEffect(() => {
    const fetchWeather = async () => {
      // Validate coordinates
      if (!lat || !long || isNaN(lat) || isNaN(long)) {
        return; // Silently skip invalid coordinates
      }

      setLoading(true);

      try {
        // Fetch current weather
        const currentRes = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.CURRENT_WEATHER}?lat=${lat}&lon=${long}&units=${API.PARAMS.UNITS}&appid=${config.API_KEY}`
        );

        if (currentRes.status === 401) throw new Error("INVALID_API_KEY");
        if (!currentRes.ok) throw new Error("WEATHER_FETCH_ERROR");

        const currentData = await currentRes.json();

        if (!currentData.main || !currentData.weather) {
          throw new Error("INVALID_WEATHER_DATA");
        }

        // Fetch 5-day forecast
        const forecastRes = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.FORECAST_5DAY}?lat=${lat}&lon=${long}&units=${API.PARAMS.UNITS}&appid=${config.API_KEY}`
        );

        if (!forecastRes.ok) throw new Error("FORECAST_FETCH_ERROR");

        const forecastData = await forecastRes.json();

        if (!forecastData.list || forecastData.list.length === 0) {
          throw new Error("INVALID_FORECAST_DATA");
        }

        // Transform data
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

        // Success - update weather and clear any errors
        setWeather(transformed);
        clearError();
      } catch (err) {
        // Don't clear existing weather data - keep showing last good data
        // Just show error message
        handleError(err, "weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, [lat, long]);

  /**
   * Transforms 5-day forecast data to daily format
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
            
            {/* Error Display - Single Source of Truth */}
            {errorState.hasError && (
              <ErrorCard>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorMessage>{errorState.message}</ErrorMessage>
                {errorState.canRetry && (
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

            {/* Loading Indicator */}
            {loading && (
              <LoadingContainer>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <LoadingText>Loading weather data...</LoadingText>
              </LoadingContainer>
            )}

            {/* Weather Content - Show even if there's an error (safe mode) */}
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

            {/* Empty State - Only show if no weather data at all */}
            {!loading && !weather.current && !errorState.hasError && (
              <EmptyState>
                <EmptyIcon>🌤️</EmptyIcon>
                <EmptyText>Search for a city to see weather forecast</EmptyText>
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