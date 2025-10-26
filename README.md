# 🧬 Biomedical Sample Size Calculator

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vue.js](https://img.shields.io/badge/vue.js-3.0-brightgreen.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

**A comprehensive, production-ready statistical tool for research design in biomedical sciences**

*Empowering researchers with precise, evidence-based sample size calculations*

[Live Demo](#) • [Documentation](#features) • [Report Issue](#)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Statistical Methods](#-statistical-methods)
- [Technical Architecture](#-technical-architecture)
- [Installation & Usage](#-installation--usage)
- [Calculator Specifications](#-calculator-specifications)
- [Mathematical Foundations](#-mathematical-foundations)
- [Design Philosophy](#-design-philosophy)
- [Contributing](#-contributing)
- [Authors](#-authors)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

The **Biomedical Sample Size Calculator** is a sophisticated, single-page web application designed to provide accurate sample size estimations for a wide array of research designs in biomedical and epidemiological studies. Built with modern web technologies and grounded in rigorous statistical theory, this tool bridges the gap between complex statistical formulas and practical research planning.

### 🌟 Why This Tool?

Sample size calculation is a critical component of research design that directly impacts:

- **Statistical Power**: Ensuring adequate power to detect clinically meaningful effects
- **Resource Optimization**: Preventing over-enrollment and waste of resources
- **Ethical Considerations**: Minimizing unnecessary participant exposure
- **Publication Success**: Meeting journal requirements for methodological rigor

This calculator addresses these concerns by providing:
- ✅ **11 specialized calculators** covering estimation and hypothesis testing scenarios
- ✅ **Real-time validation** with immediate feedback on input parameters
- ✅ **Educational context** with detailed explanations and real-world examples
- ✅ **Zero installation** required - runs entirely in the browser
- ✅ **Mobile-responsive design** for access anywhere, anytime

---

## 🚀 Key Features

### 📊 Comprehensive Coverage

| Category | Calculators | Use Cases |
|----------|-------------|-----------|
| **Estimation** | 6 calculators | Prevalence studies, confidence interval estimation, effect size quantification |
| **Hypothesis Testing** | 4 calculators | Clinical trials, comparative effectiveness research, intervention studies |
| **Rates & Survival** | 1 calculator | Cohort studies, time-to-event analysis, longitudinal research |

### 💡 User-Centric Design

- **Intuitive Welcome Screen**: Categorized view of all calculators with visual hierarchy
- **Contextual Guidance**: Each calculator includes:
  - Clear description of methodology
  - When and where to use the test
  - Real-world research examples
  - Tooltip explanations for every parameter
- **Smart Validation**: Real-time input validation with helpful error messages
- **Instant Results**: Calculations performed on-the-fly with no latency

### 🎨 Modern Interface

- **Professional Aesthetics**: Clean, academic design inspired by Stripe and Notion
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Smooth Animations**: Polished interactions that enhance user engagement
- **Accessibility First**: Semantic HTML and proper ARIA labels for screen readers

### 🔧 Technical Excellence

- **Single-File Architecture**: Entire application in one HTML file - no build process needed
- **Zero Dependencies**: No external libraries beyond Vue.js 3 from CDN
- **Progressive Enhancement**: Works with JavaScript disabled (graceful degradation)
- **Cross-Browser Compatible**: Tested on Chrome, Firefox, Safari, and Edge

---

## 📐 Statistical Methods

### Estimation Calculators

#### 1. Single Proportion Estimation
**Formula**: `n = (Z₁₋α/₂)² × p × (1-p) / d²`

**Application**: Estimating prevalence, survey research, quality control
- Prevalence of chronic diseases in populations
- Success rates in clinical procedures
- Defect rates in manufacturing processes

#### 2. Single Mean Estimation
**Formula**: `n = (Z₁₋α/₂)² × σ² / d²`

**Application**: Estimating population averages with specified precision
- Average blood pressure in populations
- Mean biomarker levels
- Average treatment response times

#### 3. Difference Between Two Proportions
**Formula**: `n = (Z₁₋α/₂)² × (p₁(1-p₁) + p₂(1-p₂)) / d²`

**Application**: Comparing prevalence between groups
- Gender differences in disease prevalence
- Regional variations in health outcomes
- Treatment protocol comparisons

#### 4. Odds Ratio Estimation
**Formula**: `n = (Z₁₋α/₂)² / ln(1-ε)² × (1/(p₁(1-p₁)) + 1/(p₂(1-p₂)))`

**Application**: Case-control studies, rare disease research
- Genetic association studies
- Environmental exposure and disease risk
- Retrospective case-control designs

#### 5. Relative Risk Estimation
**Formula**: `n = (Z₁₋α/₂)² / ln(1-ε)² × ((1-p₁)/p₁ + (1-p₂)/p₂)`

**Application**: Cohort studies, prospective research
- Vaccine effectiveness studies
- Occupational health research
- Lifestyle factors and disease incidence

#### 6. Correlation Coefficient Estimation
**Formula**: `n = 3 + (Z₁₋α/₂ / (0.5 × ln((1+r)/(1-r))))²`

**Application**: Association studies, predictive modeling
- Biomarker correlation studies
- Quality of life assessments
- Psychometric validation

### Hypothesis Testing Calculators

#### 7. Single Proportion Test
**Formula**: `n = (Z₁₋α/₂√(p₀(1-p₀)) + Z₁₋β√(pₐ(1-pₐ)))² / (p₀ - pₐ)²`

**Application**: Testing against a known standard
- Drug efficacy trials (vs. historical control)
- Quality improvement initiatives
- Benchmark comparisons

#### 8. Two Proportions Test
**Formula**: `n = (Z₁₋α/₂√(2p̄(1-p̄)) + Z₁₋β√(p₁(1-p₁) + p₂(1-p₂)))² / (p₁ - p₂)²`

**Application**: Randomized controlled trials, A/B testing
- Treatment vs. control comparisons
- Intervention effectiveness studies
- Head-to-head drug comparisons

#### 9. Two Means Test
**Formula**: `n = ((σ₁² + σ₂²) × (Z₁₋α/₂ + Z₁₋β)²) / (μ₁ - μ₂)²`

**Application**: Continuous outcome comparisons
- Blood pressure reduction trials
- Weight loss interventions
- Pain score comparisons

#### 10. Two Correlation Coefficients Test
**Formula**: `n = ((Z₁₋α/₂ + Z₁₋β) / (Zᵣ₁ - Zᵣ₂))² + 3`

**Application**: Comparing associations across groups
- Age-stratified correlation analysis
- Gender differences in associations
- Cross-cultural validation studies

### Rates & Survival Calculators

#### 11. Two Incidence Rates Test
**Formula**: `E = (Z₁₋α/₂√((k+1)/k × λ̄) + Z₁₋β√(λ₁ + λ₂/k))² / (λ₁ - λ₂)²`

**Application**: Time-to-event analysis, survival studies
- Cancer survival comparisons
- Infection rate studies
- Mortality rate analyses

---

## 🏗️ Technical Architecture

### Technology Stack

```
┌─────────────────────────────────────────┐
│          User Interface Layer           │
│                                         │
│  • HTML5 Semantic Structure             │
│  • CSS3 Custom Animations               │
│  • Google Fonts (Inter)                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       JavaScript Framework Layer        │
│                                         │
│  • Vue.js 3 (Composition API)           │
│  • Reactive Data Binding                │
│  • Computed Properties                  │
│  • Component Lifecycle Management       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Statistical Engine Layer          │
│                                         │
│  • Z-score Calculations                 │
│  • Formula Implementations              │
│  • Input Validation Logic               │
│  • Error Handling System                │
└─────────────────────────────────────────┘
```

### Code Architecture

The application follows a **Model-View-ViewModel (MVVM)** pattern:

- **Model**: Calculator definitions with inputs, formulas, and metadata
- **View**: Reactive templates with conditional rendering
- **ViewModel**: Vue.js instance managing state and computations

### Performance Optimizations

1. **Computed Properties**: Results calculated only when inputs change
2. **Efficient DOM Updates**: Vue's virtual DOM minimizes reflows
3. **CSS Animations**: Hardware-accelerated transforms for smooth UI
4. **Lazy Loading**: Content rendered on-demand based on user selection

---

## 📦 Installation & Usage

### Quick Start (No Installation Required)

1. **Download** the `index.html` file
2. **Open** in any modern web browser
3. **Start calculating** - it's that simple!

```bash
# Clone the repository (optional)
git clone https://github.com/yourusername/sample-size-calculator.git

# Navigate to the directory
cd sample-size-calculator

# Open in browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```



#### Self-Hosted
Simply place the HTML file on any web server:
```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

---

## 📘 Calculator Specifications

### Input Parameter Guidelines

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| α (Alpha) | Float | 0.01 - 0.10 | Type I error rate (typically 0.05) |
| β (Beta) | Float | 0.10 - 0.20 | Type II error rate (typically 0.20 for 80% power) |
| p, p₁, p₂ | Float | 0.0 - 1.0 | Proportions (must be between 0 and 1) |
| μ₁, μ₂ | Float | Any | Population means |
| σ, σ₁, σ₂ | Float | > 0 | Standard deviations (must be positive) |
| d | Float | > 0 | Margin of error or precision |
| r, r₁, r₂ | Float | -1.0 - 1.0 | Correlation coefficients |
| OR | Float | > 0 | Odds Ratio (must be positive) |
| RR | Float | > 0 | Relative Risk (must be positive) |
| ε (Epsilon) | Float | 0.0 - 1.0 | Relative precision |
| λ₁, λ₂ | Float | > 0 | Incidence rates (events per person-time) |
| k | Float | > 0 | Allocation ratio between groups |

### Z-Score Lookup Table

The calculator uses standard Z-scores for common confidence levels:

| Confidence Level | α (two-tailed) | Z₁₋α/₂ |
|------------------|----------------|---------|
| 90% | 0.10 | 1.645 |
| 95% | 0.05 | 1.96 |
| 99% | 0.01 | 2.576 |

| Power | β (one-tailed) | Z₁₋β |
|-------|----------------|------|
| 80% | 0.20 | 0.84 |
| 90% | 0.10 | 1.28 |

---

## 🔬 Mathematical Foundations

### Theoretical Basis

This calculator implements sample size formulas derived from:

1. **Neyman-Pearson Lemma**: Optimal hypothesis testing framework
2. **Central Limit Theorem**: Asymptotic normality of estimators
3. **Fisher's Z-Transformation**: Correlation coefficient stabilization
4. **Wald Test**: Large-sample approximations for complex parameters

### Key Assumptions

- **Random Sampling**: Participants selected randomly from target population
- **Independence**: Observations are independent within and between groups
- **Normal Approximations**: Valid for sufficiently large samples
- **Equal Variance** (where applicable): Homogeneity of variance between groups
- **No Attrition**: Calculated sample sizes assume no loss to follow-up

### Adjustments for Real-World Research

Consider increasing calculated sample sizes for:

- **Dropout/Attrition**: Multiply by 1/(1-expected dropout rate)
- **Non-Response**: Add 10-20% buffer for survey research
- **Clustering**: Apply design effect multiplier for cluster randomization
- **Multiple Comparisons**: Adjust α using Bonferroni or FDR corrections
- **Unequal Allocation**: When group sizes differ intentionally

---

## 🎨 Design Philosophy

### Principles

1. **Clarity Over Cleverness**: Prioritize user understanding
2. **Education Through Design**: Every interaction is a learning opportunity
3. **Professional Without Pretense**: Academic rigor with modern aesthetics
4. **Accessibility First**: Usable by researchers at all technical levels

### Visual Hierarchy

```
Welcome Screen (Overview)
    ↓
Category Selection (Context)
    ↓
Calculator Selection (Specificity)
    ↓
Parameter Input (Interaction)
    ↓
Result Display (Outcome)
    ↓
Interpretation & Next Steps (Action)
```

### Color Psychology

- **Blue (#007BFF)**: Trust, reliability, scientific rigor
- **Teal (#20C997)**: Results, success, positive outcomes
- **Yellow (#FFC107)**: Information, caution, educational content
- **Grey Scale**: Professional, neutral, accessible

---

## 🤝 Contributing

We welcome contributions from the research and development community!

### Ways to Contribute

- **Bug Reports**: Submit detailed issue reports with reproducible examples
- **Feature Requests**: Propose new calculators or functionality
- **Documentation**: Improve explanations, add examples, translate content
- **Code Improvements**: Optimize algorithms, enhance UI/UX, add tests

### Development Guidelines

```javascript
// Code Style
- Use descriptive variable names
- Comment complex formulas with citations
- Follow Vue.js 3 best practices
- Maintain single-file architecture

// Testing
- Validate against published sample size tables
- Cross-check with established software (G*Power, PASS)
- Test edge cases and boundary conditions

// Documentation
- Update README for new features
- Add inline comments for statistical formulas
- Include references to source literature
```

---

## 👥 Authors

**Mohamad AlJasem**  
*Lead Developer & Biostatistics Researcher*  
Tehran University of Medical Sciences

**Prof. Alipasha Meysamie**  
*Statistical Advisor & Principal Investigator*  
Department of Community Medicine  
Tehran University of Medical Sciences

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Mohamad AlJasem & Prof. Alipasha Meysamie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT License text...]
```

---

## 🙏 Acknowledgments

### Statistical References

- **Fleiss, J.L., Levin, B., & Paik, M.C. (2003)**. *Statistical Methods for Rates and Proportions* (3rd ed.). Wiley.
- **Hulley, S.B., et al. (2013)**. *Designing Clinical Research* (4th ed.). Lippincott Williams & Wilkins.
- **Chow, S.C., Shao, J., & Wang, H. (2008)**. *Sample Size Calculations in Clinical Research* (2nd ed.). Chapman & Hall/CRC.
- **Machin, D., Campbell, M.J., Tan, S.B., & Tan, S.H. (2018)**. *Sample Sizes for Clinical, Laboratory and Epidemiology Studies* (4th ed.). Wiley-Blackwell.

### Software Inspiration

- **G*Power**: Comprehensive power analysis tool
- **PASS**: Specialized sample size software
- **R's `pwr` package**: Open-source power calculations

### Community

Special thanks to:
- Tehran University of Medical Sciences for institutional support
- The biostatistics research community for methodological guidance
- Open-source contributors who make tools like Vue.js freely available
- Beta testers and early adopters for invaluable feedback

---

## 📞 Support & Contact

### Questions or Issues?

- **Email**: [mohamad@aljasem.eu.org](mailto:mohamad@aljasem.eu.org)
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/sample-size-calculator/issues)

### Citation

If you use this calculator in your research, please cite:

```bibtex
@software{aljasem2024samplesize,
  author = {AlJasem, Mohamad and Meysamie, Alipasha},
  title = {Biomedical Sample Size Calculator: A Web-Based Tool for Research Design},
  year = {2024},
  publisher = {Tehran University of Medical Sciences},
  url = {https://github.com/m-aljasem/sample-size-calculator}
}
```

---

<div align="center">

### ⭐ Star this repository if you find it useful!

**Built with ❤️ for the research community**

[Back to Top](#-biomedical-sample-size-calculator)

</div>