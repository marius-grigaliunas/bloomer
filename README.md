# Bloomer

## AI-powered plant care assistant, with plant identification and personalized care guides

**[Download on Google Play](https://play.google.com/store/apps/details?id=com.grimar.bloomer&pcampaignid=web_share)** | **[Report Bug](https://bloomerapp.info/contact/)**

---

## Overview

Bloomer is a production-ready Android application made for people who want plants in their life, but don't have the actual interest in taking care of them. It's for people like me, my main problem is forgetting to water the plants for a long time, and I created this app as tool for me, and people like me, to care of the green friends.

### Achievements

- **Published on Google Play Store** with production-ready quality
- **Plant identification** using PlantNet API integration
- **AI integration** using DeepSeek-V3-0324 LLM to get personalized plant care guides
- **Smart care scheduling** with calendar visualization and notifications
- **Multi-language support** (English, Romanian, Lithuanian)
- **Cloud-native architecture** with Appwrite backend
- **Modern UI/UX** responsive and attractive UI built with NativeWind (Tailwind CSS for React Native)

---

## Features

### AI-Powered Plant Identification

- **Camera integration** with real-time image capture and size compression
- **PlantNet API** integration for accurate plant species recognition
- **DeepSeek AI** using DeepSeek-V3-0324 LLM to get personalized plant care guides

### Intelligent Care Management

- **Automated watering schedules** based on plant-specific needs
- **Visual calendar** with weekly/monthly views
- **Overdue care alerts** with priority indicators
- **Care history tracking** for each plant
- **Customizable reminders** with timezone support

### Environmental Monitoring

- **Real-time weather integration** via OpenWeatherMap API
- **Location-based** weather data with user permissions

### User Authentication & Management

- **Google OAuth 2.0** integration via Appwrite
- **Secure session management**
- **User preferences** (language, units, calendar settings)
- **Profile customization**
- **Account deletion** with data cleanup

### Smart Notifications

- **Push notifications** using Expo Notifications
- **Customizable notification times**

### Localization

- **Multi-language support** (English, Romanian, Lithuanian)
- **Dynamic language switching**
- **Regional unit preferences** (metric/imperial)

### Modern UI/UX

- **NativeWind styling** for consistent design
- **Smooth animations** using React Native Reanimated
- **Responsive layouts** for various screen sizes

---

## Technology Stack

### Frontend

- **React Native 0.81** - Cross-platform mobile framework
- **Expo 54** - Development and build toolchain
- **TypeScript 5.3** - Type-safe development
- **Expo Router** - File-based navigation system
- **NativeWind 4.2** - Tailwind CSS for React Native
- **Zustand** - Lightweight state management
- **React Native Reanimated** - Advanced animations

### Backend & Services

- **Appwrite** - Backend-as-a-Service (BaaS)
  - Authentication (OAuth 2.0)
  - Database (NoSQL)
  - Storage (image hosting)
  - Cloud Functions (serverless)
- **PlantNet API** - Plant identification
- **DeepSeek AI** - Care information generation
- **OpenWeatherMap API** - Weather data

### Development Tools

- **ESLint** - Code quality
- **Babel** - JavaScript transpilation
- **Metro** - React Native bundler

---

## Architecture

### Design Patterns

- **Component-based architecture** with reusable UI components
- **Custom hooks** for shared logic (`useWateringDays`, `useAppwrite`)
- **Service layer** for API integrations and business logic
- **Store pattern** with Zustand for global state
- **Context API** for user session management

### Project Structure

```bash

bloomer/
├── app/                    # Expo Router screens
│   ├── (root)/
│   │   └── (tabs)/        # Tab navigation screens
│   └── plants/            # Plant detail screens
├── components/            # Reusable UI components
├── lib/
│   ├── services/          # API integrations
│   ├── hooks/             # Custom React hooks
│   └── i18n/             # Localization config
├── interfaces/            # TypeScript type definitions
├── constants/             # App-wide constants
└── locales/              # Translation files

```

## Contributing

This is a showcase project and is not actively seeking contributions. However, feel free to fork and adapt for your own use!

---

## Author

**Marius Grigaliūnas** - [GitHub](https://github.com/marius-grigaliunas) | [LinkedIn](https://www.linkedin.com/in/marius-grigaliunas-2808b91b9/)

---

## Acknowledgments

- **PlantNet** for plant identification API
- **Appwrite** for backend infrastructure
- **Expo** for development framework
- **OpenWeatherMap** for weather data

---

## Screenshots

### Home Screen

![Home screen screenshot](/assets/images/home.jpg?raw=true "Home screen")

- Quick actions for plant identification and care schedule
- Weather widget with location data
- Today's care tasks with urgent alerts
- Plant gallery overview

### Care Calendar

![Schedule screenshot with tasks](/assets/images/schedule.jpg?raw=true "Schedule")

- Monthly calendar view with watering indicators
- Day selection with task details
- Color-coded priorities (red for overdue, green for scheduled)

### Plant Identification

![Identification screenshot](/assets/images/identify.jpg?raw=true "Identification")

- Camera interface with flash support
- Multi-image capture (up to 5 photos)

### Plant view

![Plant view 1, showing the header, name and species](/assets/images/plantview1.jpg?raw=true "Plant view 1")

![Plant view 2, showing the temperature, humidity, light preferences](/assets/images/plantview2.jpg?raw=true "Plant view 2")

![Plant view 3, showing common issues, tips and history](/assets/images/plantview3.jpg?raw=true "Plant view 3")

- AI-powered identification results
- Detailed care information

---

## Future Enhancements

- [ ] iOS version
- [ ] Plant disease detection
- [ ] Social features (share plants with friends)
- [ ] Integration with smart home devices
- [ ] Offline mode with local database sync
- [ ] Plant growth tracking with photo timeline
- [ ] Community plant database
- [ ] In-app plant care guides
