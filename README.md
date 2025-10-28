# Biomedical Sample Size Calculator

A professional Vue.js application for calculating sample sizes in biomedical research studies. This tool provides statistical calculators for estimation studies, hypothesis testing, and rates/survival analysis with advanced features including multi-language support, PWA capabilities, and dark mode.

## ✨ Features

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
- Not activated automatically - user must click to enable

### 📱 Progressive Web App (PWA)
- **Installable** - Add to home screen on mobile/desktop
- **Offline Support** - Works without internet connection
- **App-like Experience** - Standalone mode
- **Service Worker** - Caches resources for offline use
- **Responsive Design** - Optimized for all screen sizes

### 📊 Export & Save Features
- **PDF Reports** - Generate printable calculation reports
- **CSV Export** - Export data for further analysis
- **Copy to Clipboard** - Quick text copying
- **Save Calculations** - Store calculations locally
- **Calculation History** - Access previously saved calculations

### 🧮 Statistical Calculators
- **Estimation Studies**: Single Proportion, Single Mean, Difference Between 2 Proportions, Odds Ratio, Relative Risk, Correlation Coefficient
- **Hypothesis Testing**: Single Proportion Test, Two Proportions Test, Two Means Test, Two Correlation Coefficients Test
- **Rates & Survival Analysis**: Two Incidence Rates Test

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Generate PWA icons (optional)
./generate-icons.sh

# Start development server
npm run serve
```

The application will be available at `http://localhost:8080`

### Production Build
```bash
# Build for production
npm run build

# Build optimized for production
npm run build:prod
```

## 📁 Project Structure

```
src/
├── components/              # Vue components
│   ├── AppHeader.vue        # Header with language/theme controls
│   ├── WelcomeScreen.vue   # Landing page
│   ├── Sidebar.vue         # Navigation sidebar
│   ├── CalculatorContent.vue # Main calculator interface
│   ├── AppFooter.vue       # Footer
│   ├── LanguageSwitcher.vue # Language selection
│   ├── ThemeSwitcher.vue   # Dark/light mode toggle
│   ├── PWAInstallPrompt.vue # PWA installation prompt
│   └── ExportResults.vue   # Export functionality
├── data/                   # Data and configurations
│   └── calculators.js      # Calculator definitions
├── utils/                  # Utility functions
│   └── calculators.js      # Statistical calculations
├── locales/                # Translation files
│   ├── en.json            # English translations
│   ├── fa.json            # Farsi translations
│   ├── ar.json            # Arabic translations
│   └── fr.json            # French translations
├── i18n/                   # Internationalization setup
│   └── index.js           # i18n configuration
├── styles/                 # CSS styles
│   └── main.css           # Main styles with dark mode
├── App.vue                 # Main application component
└── main.js                # Application entry point
```

## 🌐 Language Support

The application supports 4 languages with proper RTL/LTR handling:

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| English  | `en` | LTR       | ✅ Complete |
| Farsi    | `fa` | RTL       | ✅ Complete |
| Arabic   | `ar` | RTL       | ✅ Complete |
| French   | `fr` | LTR       | ✅ Complete |

### Adding New Languages
1. Create new translation file in `src/locales/`
2. Add language to `src/i18n/index.js`
3. Add language button to `LanguageSwitcher.vue`
4. Update CSS for RTL if needed

## 🎨 Theming

### Light Mode (Default)
- Clean, professional design
- Blue accent color (#007BFF)
- White backgrounds with subtle shadows

### Dark Mode
- Dark backgrounds (#1a1a1a, #2d2d2d, #3d3d3d)
- Light text (#ffffff, #b0b0b0)
- Blue accent (#4dabf7)
- Optimized contrast ratios

### Customization
CSS custom properties allow easy theme customization:
```css
.dark-theme {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --accent-color: #4dabf7;
}
```

## 📱 PWA Features

### Installation
- **Mobile**: "Add to Home Screen" prompt
- **Desktop**: Install button in browser address bar
- **Automatic**: PWA install prompt after 3 seconds

### Offline Capabilities
- Caches application shell
- Caches Google Fonts
- Works without internet connection
- Service worker handles updates

### Manifest Configuration
- App name and description
- Theme colors
- Icon sets (16x16 to 512x512)
- Display mode: standalone
- Orientation: portrait-primary

## 📊 Export Features

### PDF Reports
- Professional calculation reports
- Input parameters and results
- Timestamp and metadata
- Print-ready format

### CSV Export
- Structured data format
- Compatible with Excel/Google Sheets
- Includes all calculation details
- Timestamp tracking

### Save Calculations
- Local storage persistence
- Up to 50 saved calculations
- Quick access to previous work
- Calculation history management

## 🛠️ Development

### Available Scripts
```bash
npm run serve      # Development server
npm run build      # Production build
npm run build:prod # Optimized production build
npm run lint       # ESLint checking
```

### Adding New Calculators
1. Add calculator definition to `src/data/calculators.js`
2. Implement calculation function in `src/utils/calculators.js`
3. Add case to `calculatedResult` computed property
4. Update translations if needed

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Development/Production mode
- `VUE_APP_TITLE`: Application title

### Build Configuration
- Output directory: `app/`
- Assets directory: `static/`
- Public path: `./` (relative for deployment)

## 📈 Performance

### Optimization Features
- Code splitting
- Lazy loading
- CSS extraction in production
- Service worker caching
- Font optimization

### Bundle Analysis
```bash
npm run build -- --report
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Install dependencies: `npm install`
4. Make changes
5. Test thoroughly
6. Submit pull request

### Code Style
- ESLint configuration included
- Vue.js best practices
- Component-based architecture
- Responsive design principles

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- **Mohamad AlJasem**
- **Prof. Alipasha Meysamie** - Tehran University of Medical Sciences

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- Vue i18n for internationalization
- Workbox for PWA capabilities
- Inter font family for typography

## 📞 Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Contact the authors directly
- Check the documentation

---

**Made with ❤️ for the biomedical research community**