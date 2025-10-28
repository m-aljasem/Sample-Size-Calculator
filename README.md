# 🧬 Statistical Sample Size Calculator

A professional Vue.js application for calculating sample sizes in medical and healthcare research studies. This tool provides comprehensive statistical calculators for estimation studies, hypothesis testing, and rates/survival analysis with advanced features including multi-language support, interactive visualizations, educational tutorials, and academic citation support.

**Developed by medical professionals with expertise in public health, digital health, and AI, supervised by Prof. Alipasha Meysamie (MD, MPH) - Full Professor at Tehran University of Medical Sciences.**

## ✨ Features

### 🎓 Educational & Academic Features
- **📚 Citation Support** - Professional citation formats (APA, Vancouver, MLA, Chicago)
- **🎓 Educational Tutorials** - Interactive guides for statistical concepts
- **📊 Data Visualization** - Interactive charts and power analysis tools
- **📄 Professional Reporting** - Comprehensive report templates
- **🔬 Academic Supervision** - Developed under Prof. Alipasha Meysamie's guidance

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

### 📊 Advanced Statistical Features
- **⚡ Power Analysis** - Interactive power curves and sample size analysis
- **🧠 Bayesian Analysis** - Bayesian methods with prior distributions
- **📈 Sequential Analysis** - Adaptive and sequential study designs
- **📋 Calculation History** - Save and manage previous calculations
- **📊 Interactive Charts** - Real-time visualization with Chart.js

### 📱 Modern UI/UX
- **🎨 2-Column Layout** - Improved calculator interface with side-by-side inputs and results
- **📤 Floating Export Button** - Easy access to export functionality
- **🏠 Clickable Title** - Navigate to home page from anywhere
- **📱 Responsive Design** - Optimized for all screen sizes
- **✨ Smooth Animations** - Enhanced user experience

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

### Live Demo
🌐 **Access the live application**: [ssc.aljasem.eu.org](https://ssc.aljasem.eu.org)

## 🆕 Recent Updates

### Latest Features (2024)
- **📚 Citation System**: Professional citation formats with one-click copying
- **🎨 UI/UX Improvements**: 2-column layout, floating export button, clickable title
- **📊 Enhanced Visualizations**: Interactive charts with Chart.js integration
- **🎓 Educational Content**: Comprehensive tutorials and learning resources
- **📄 About Page**: Detailed project information and team profiles
- **🔧 Technical Enhancements**: Improved performance and error handling
- **📱 Mobile Optimization**: Better responsive design and mobile experience

### Key Improvements
- **Calculator Interface**: Side-by-side input and result layout
- **Navigation**: Clickable project title for easy home navigation
- **Export Functionality**: Floating export button for better accessibility
- **Academic Support**: Professional citation system for research use
- **Team Information**: Comprehensive about page with project details

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
│   ├── WelcomeScreen.vue   # Landing page with citation box
│   ├── Sidebar.vue         # Navigation sidebar
│   ├── CalculatorContent.vue # Main calculator interface (2-column layout)
│   ├── AboutPage.vue       # About page with team info and citation
│   ├── CitationModal.vue   # Citation modal with copy functionality
│   ├── EducationalTutorials.vue # Interactive tutorials
│   ├── DataVisualization.vue # Charts and power analysis
│   ├── AppFooter.vue       # Footer
│   ├── LanguageSwitcher.vue # Language selection
│   ├── ThemeSwitcher.vue   # Dark/light mode toggle
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

## 📚 Citation System

### Professional Citation Formats
The application provides comprehensive citation support for academic and research use:

- **APA Style**: `AlJasem, M., & Meysamie, A. (2024). Statistical Sample Size Calculator [Web application]. Retrieved from https://ssc.aljasem.eu.org`
- **Vancouver Style**: `AlJasem M, Meysamie A. Statistical Sample Size Calculator [Internet]. 2024 [cited 2024]. Available from: https://ssc.aljasem.eu.org`
- **MLA Style**: `AlJasem, Mohammad, and Alipasha Meysamie. Statistical Sample Size Calculator. Web application, 2024, ssc.aljasem.eu.org.`
- **Chicago Style**: `AlJasem, Mohammad, and Alipasha Meysamie. Statistical Sample Size Calculator. Web application. 2024. https://ssc.aljasem.eu.org.`

### Citation Features
- **One-click copying** for each citation format
- **Visual feedback** with success/error messages
- **Cross-browser compatibility** with fallback support
- **Citation guidelines** for proper academic referencing
- **Modal interface** for easy access and copying

### Usage Guidelines
- Include the current date when you accessed the tool
- Specify the version or date of the calculation if relevant to your study
- Mention any specific calculators or methods used
- Consider including a brief description of how the tool was used in your methodology

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

## 👥 Team & Authors

### Development Team

**Mohammad AlJasem** - MD, MPH, MSc | Digital Health Specialist
- Medical doctor and public health specialist from Syria
- Advanced degrees in public health and digital health
- Expertise in AI, digital health, and full-stack development
- Passionate about combining medical expertise with technology
- Contact: mohamad@aljasem.eu.org

**Prof. Alipasha Meysamie** - MD, MPH | Full Professor & Project Supervisor
- Full Professor at Tehran University of Medical Sciences
- Department of Community Medicine
- Author of multiple books on statistical analysis
- Supervisor of this project, providing expert guidance
- Expertise in statistical methodology and clinical research design
- Contact: Available through Tehran University of Medical Sciences

### Project Supervision
This project is developed under the academic supervision of Prof. Alipasha Meysamie, ensuring:
- **Academic rigor** and methodological soundness
- **Statistical accuracy** in all calculations
- **Professional standards** in healthcare research
- **Educational value** for researchers and clinicians

### Motivation & Objectives
- **Healthcare Research Impact**: Empowering researchers with accurate statistical tools
- **Global Accessibility**: Free, open-access tool for worldwide research community
- **Educational Impact**: Interactive tutorials and educational resources
- **AI & Digital Health Innovation**: Combining medical expertise with modern technology
- **Academic Excellence**: Under professional supervision for quality assurance

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- Vue i18n for internationalization
- Workbox for PWA capabilities
- Inter font family for typography

## 📞 Support & Contact

### Getting Help
For questions, issues, or feature requests:
- **GitHub Issues**: Create an issue on the project repository
- **Email**: mohamad@aljasem.eu.org
- **Documentation**: ssc.aljasem.eu.org
- **Live Demo**: [ssc.aljasem.eu.org](https://ssc.aljasem.eu.org)

### Academic Inquiries
For academic collaboration or research-related questions:
- **Prof. Alipasha Meysamie**: Available through Tehran University of Medical Sciences
- **Department**: Community Medicine, Tehran University of Medical Sciences
- **Research Focus**: Statistical methodology, clinical research design, epidemiological studies

### Technical Support
- **Development**: Mohammad AlJasem (mohamad@aljasem.eu.org)
- **GitHub Repository**: github.com/m-aljasem/sample-size-calculator
- **Documentation**: ssc.aljasem.eu.org

---

**Made with ❤️ for the medical and healthcare research community**

*Developed by medical professionals, for medical professionals - ensuring accuracy, reliability, and academic excellence in statistical sample size calculations.*