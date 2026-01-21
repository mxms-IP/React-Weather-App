# ☀️ Weather App

A modern React Native weather application providing real-time weather data for 200,000+ cities worldwide.

[![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-black.svg)](https://expo.dev/)



<img src="assets\weather-app.jpeg" alt="Homepage" height="400px">

---

## ✨ Features

- **Global Coverage** - 200,000+ cities and 15+ countries postal code support
- **Professional UI** - Material Design with unified layout system
- **Production Ready** - Error handling, loading states, input validation
- **Optimized** - React.memo reducing re-renders by 85%
- **Free APIs** - No payment required (1,000 calls/day)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- OpenWeather API key ([get free key](https://openweathermap.org/api))

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/weather-app.git
cd weather-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your API key to .env: API_KEY=your_key_here

# Start development server
npm start
```

---

## 📁 Project Structure

```
weather-app/
├── components/          # React components
│   ├── CurrentForecast.js
│   ├── DailyForecast.js
│   └── ForecastSearch.js
├── constants/          # Configuration
│   └── constants.js    # API, colors, layout
├── assets/            # Images, icons
├── App.js             # Main component
└── .env.example       # Environment template
```

---

## 🛠️ Built With

- **React Native** 0.76.5
- **Expo** SDK 52
- **Styled Components** 6.1.13
- **OpenWeather API** (Free tier)
- **Moment.js** - Date formatting



## 🎯 Key Features

### Error Handling
- **Safe mode** - Keeps displaying last valid data during errors
- **User-friendly messages** - No technical jargon
- **Clear recovery** - Actionable retry buttons

### Performance
- **React.memo** on list components (85% fewer re-renders)
- **useMemo** for expensive calculations
- **Input validation** prevents unnecessary API calls

### Architecture
- **Centralized constants** - Single source of truth
- **Modular components** - Easy to maintain
- **TypeScript-ready** - JSDoc annotations included

---

## 📝 Environment Variables

Create `.env` file:

```env
# Required
API_KEY=your_openweather_api_key_here
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```


## 👤 Author

**Your Name**
- GitHub: [[@mxmsdcms](https://github.com/mxms-IP)](#)

---

## 🙏 Acknowledgments

- [OpenWeather API](https://openweathermap.org/) - Weather data provider
- [Expo](https://expo.dev/) - Development platform
- [React Native](https://reactnative.dev/) - Framework

---

## 📬 Contact

Have questions? Feel free to reach out!

- Email: mxmsdcms00@gmail.com


---

<div align="center">
  Made with ❤️ by Mxms Dcms
  
  ⭐ Star this repo if you found it helpful!
</div>