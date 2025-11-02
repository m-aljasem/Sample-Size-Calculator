# 📱 Sample Size Calculator - Mobile App

A professional Ionic Vue mobile application for calculating sample sizes in medical and healthcare research studies. This mobile app provides comprehensive statistical calculators optimized for mobile devices with native-like performance.

## ✨ Features

### 📊 Statistical Calculators
- **Estimation Studies**: Single Proportion, Single Mean, Difference Between 2 Proportions, Odds Ratio, Relative Risk, Correlation Coefficient
- **Hypothesis Testing**: Single Proportion Test, Two Proportions Test, Two Means Test, Two Correlation Coefficients Test
- **Rates & Survival Analysis**: Two Incidence Rates Test

### 🌍 Multi-Language Support
- **English** (Default) - LTR
- **فارسی (Farsi)** - RTL
- **العربية (Arabic)** - RTL  
- **Français (French)** - LTR
- Automatic RTL/LTR layout switching
- Persistent language preference

### 🌙 Dark Mode
- User-controlled dark/light theme toggle
- Persistent theme preference
- Smooth transitions and optimized colors

### 📱 Mobile Optimized
- Native-like performance with Ionic Framework
- Touch-optimized interface
- Responsive design for all screen sizes
- Capacitor integration for native features

### 🎨 Modern UI/UX
- Ionic Material Design components
- Smooth animations and transitions
- Intuitive navigation
- Professional appearance

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Ionic CLI (installed globally)

### Installation

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
# Build for web
npm run build

# The built files will be in the 'dist' directory
```

### Native Mobile Development

To build for iOS or Android:

```bash
# Add iOS platform
ionic capacitor add ios

# Add Android platform
ionic capacitor add android

# Build and sync
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android
```

## 📁 Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Vue components
│   │   └── SettingsModal.vue
│   ├── data/                # Calculator definitions
│   │   └── calculators.ts
│   ├── i18n/                # Internationalization
│   │   └── index.ts
│   ├── locales/             # Translation files
│   │   ├── en.json
│   │   ├── fa.json
│   │   ├── ar.json
│   │   └── fr.json
│   ├── router/              # Vue Router
│   │   └── index.ts
│   ├── theme/                # Ionic theme variables
│   │   └── variables.css
│   ├── utils/                # Utility functions
│   │   └── calculators.ts
│   ├── views/                # Page components
│   │   ├── HomePage.vue
│   │   ├── CalculatorListPage.vue
│   │   └── CalculatorPage.vue
│   ├── App.vue               # Main app component
│   └── main.ts               # Application entry point
├── capacitor.config.ts       # Capacitor configuration
├── ionic.config.json         # Ionic configuration
└── package.json
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint checking
```

### Adding New Calculators

1. Add calculator definition to `src/data/calculators.ts`
2. Implement calculation function in `src/utils/calculators.ts`
3. Add route case to `CalculatorPage.vue` if needed
4. Update translations in locale files

### Customization

#### Theme Colors
Edit `src/theme/variables.css` to customize the app's color scheme.

#### Language Support
1. Create new translation file in `src/locales/`
2. Add language to `src/i18n/index.ts`
3. Add language option to `SettingsModal.vue`

## 📱 Platform Support

- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **iOS**: iOS 13+
- **Android**: Android 6+ (API level 23+)

## 🔧 Configuration

### Capacitor Configuration
Edit `capacitor.config.ts` to configure:
- App ID
- App name
- Web assets directory
- Native plugins

### Ionic Configuration
Edit `ionic.config.json` to configure:
- App name
- Type (vue)
- Integration (capacitor)

## 📦 Dependencies

### Core
- `@ionic/vue`: Ionic Framework for Vue
- `vue`: Vue.js framework
- `vue-router`: Routing for Vue
- `vue-i18n`: Internationalization

### Utilities
- `@capacitor/core`: Capacitor core
- `@capacitor/app`: App plugin
- `@capacitor/haptics`: Haptic feedback
- `@capacitor/keyboard`: Keyboard plugin
- `@capacitor/status-bar`: Status bar plugin

## 🤝 Contributing

This mobile app is part of the Sample Size Calculator project. Please refer to the main project README for contribution guidelines.

## 📄 License

MIT License - see main project LICENSE file for details

## 👥 Team & Authors

**Mohammad AlJasem** - MD, MPH, MSc | Digital Health Specialist
- Medical doctor and public health specialist
- Advanced degrees in public health and digital health
- Expertise in AI, digital health, and full-stack development

**Prof. Alipasha Meysamie** - MD, MPH | Full Professor & Project Supervisor
- Full Professor at Tehran University of Medical Sciences
- Department of Community Medicine
- Supervisor of this project

---

**Made with ❤️ for the medical and healthcare research community**

*Optimized for mobile devices - ensuring accurate, reliable, and accessible statistical sample size calculations on the go.*

