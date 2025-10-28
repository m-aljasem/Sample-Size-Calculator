
## **A Web-Based Tool for Accessible and Education-Focused Research Design in the Biomedical Sciences**

**Mohamad AlJasem, M.Sc.¹ & Prof. Alipasha Meysamie, M.D., M.P.H.¹**

¹Department of Community Medicine, Tehran University of Medical Sciences, Tehran, Iran.

---

### **Abstract**

The reproducibility of biomedical research is fundamentally dependent on rigorous *a priori* study design, for which sample size determination is a critical component. However, the practical application of these essential calculations is frequently obstructed by the reliance on complex, specialized software that presents a significant usability barrier for many clinician-scientists and researchers. To address this methodological gap, we developed the Biomedical Sample Size Calculator, a comprehensive, web-based, single-page application engineered to make rigorous statistical planning accessible, intuitive, and educational. Architected as a zero-dependency, single-file HTML application using the Vue.js 3 framework, the tool ensures maximum portability and obviates any need for installation or configuration. It integrates 11 distinct calculators for sample size and power analysis, covering a wide gamut of scenarios in estimation, hypothesis testing, and time-to-event analysis. Each calculator is grounded in established statistical theory, with a key innovation being the integration of a user-centric educational framework that provides contextual guidance, real-world examples, and parameter-specific tooltips directly within the user interface. Validation against established software confirms the accuracy of its computational engine. The Biomedical Sample Size Calculator successfully bridges the chasm between complex statistical theory and the practical needs of research design. By eliminating technical barriers and embedding pedagogical elements into the workflow, the tool empowers researchers to conduct more robust, ethical, and efficient studies, thereby contributing to the broader effort to enhance scientific rigor and reproducibility.

---

### **Introduction**

A foundational tenet of the scientific method is the principle of reproducibility¹. Yet, in recent decades, a growing body of evidence has highlighted a "replication crisis" across numerous scientific fields, including the biomedical sciences²⁻⁴. A significant contributor to this crisis is methodological weakness in study design, particularly the pervasive issue of underpowered research⁵. An underpowered study has a low probability of detecting a true effect, leading to false-negative conclusions, while an overpowered study wastes resources and needlessly exposes participants to potentially ineffective interventions. Thus, the ethical and scientific imperative for *a priori* sample size calculation is unequivocal⁶.

Despite its importance, the execution of sample size determination remains a significant hurdle for many researchers. The available tools often fall into one of several categories, each with distinct limitations. Commercial software packages such as PASS or nQuery are powerful but prohibitively expensive for many institutions and individual researchers. Open-source alternatives, most notably G*Power⁷ and packages within the R programming environment⁸, are highly flexible but often present a steep learning curve, requiring a level of statistical and computational literacy that many biomedical researchers do not possess. A third category, simple online calculators, are often too limited in scope, lack transparency in their underlying formulas, and are rarely accompanied by the necessary educational context to ensure their appropriate use.

This landscape creates a "computational Meno's paradox" for the practicing researcher: one must already possess significant statistical knowledge to know which tool to use and how to use it correctly, yet the tool is needed to determine the parameters for the study in the first place. This challenge underscores the need for a new class of scientific software—one that is not merely a computational utility but also a pedagogical instrument.

Here, we present the **Biomedical Sample Size Calculator**, a novel web-based tool designed to resolve this paradox. Our objective was to create a statistically comprehensive, universally accessible, and intrinsically educational tool that guides researchers through the process of sample size calculation. By integrating a clean user interface, real-time feedback, and context-specific educational content, the application is designed to empower researchers to adopt best practices in study design. We describe its statistical foundations, software architecture, and user-centric design philosophy, arguing that this tool represents a significant step toward the democratization of rigorous research methodology.

---

### **Methods**

The development of the Biomedical Sample Size Calculator was a synthesis of biostatistical theory and modern software engineering principles, with a focus on validation, usability, and educational efficacy.

#### **Statistical Foundations**

The application incorporates a curated suite of 11 calculators, logically categorized into three domains reflecting common research objectives. The formulas implemented are derived from foundational statistical texts and peer-reviewed literature⁶,⁹⁻¹¹.

**1. Estimation Calculators:** This suite of six calculators is designed for studies where the primary objective is to estimate a population parameter with a specified degree of precision. The theoretical basis for these calculations is confidence interval theory, leveraging the Central Limit Theorem's assurance of asymptotic normality for sample estimates. The calculators cover the estimation of: a single proportion, a single mean, the difference between two proportions, the odds ratio (OR), the relative risk (RR), and a correlation coefficient. For instance, the sample size to estimate an odds ratio is derived from the standard error of the log-odds, implementing the formula:
`n = (Z₁₋α/₂)² / [ln(1-ε)]² × (1/[p₁(1-p₁)] + 1/[p₂(1-p₂)])`
where `Z₁₋α/₂` is the standard normal critical value, `ε` is the desired relative precision, and `p₁` and `p₂` are the exposure prevalence in the case and control groups, respectively.

**2. Hypothesis Testing Calculators:** This group of four calculators is intended for studies designed to test a specific statistical hypothesis. The formulas are rooted in the Neyman-Pearson framework, balancing the probabilities of Type I (α) and Type II (β) errors. The application includes power analyses for testing: a single proportion against a historical value, the difference between two independent proportions, the difference between two independent means (the basis for a two-sample t-test), and the difference between two independent correlation coefficients. For the comparison of two correlation coefficients, the formula utilizes Fisher's Z-transformation to stabilize the variance of the correlation coefficient¹²:
`n = ([Z₁₋α/₂ + Z₁₋β] / [0.5 × ln((1+r₁)/(1-r₁)) - 0.5 × ln((1+r₂)/(1-r₂))])² + 3`
where `r₁` and `r₂` are the expected correlation coefficients in the two groups.

**3. Rates & Survival Calculator:** A specialized calculator is provided for comparing two incidence rates, a common scenario in epidemiological cohort studies and clinical trials with time-to-event outcomes. This formula correctly calculates the required number of *events*, not subjects, which is the proper statistical endpoint for power in such designs⁹.

#### **Software Architecture and Implementation**

The application was engineered for maximal portability, longevity, and accessibility, leading to the deliberate choice of a single-file, zero-dependency architecture.

**1. Technology Stack Rationale:** The entire application is encapsulated within a single HTML file. This design choice eliminates any need for a server-side backend, a build process (like Webpack or Vite), or package management (like npm), thereby removing significant barriers to deployment and use. The application logic is powered by the Vue.js 3 framework, loaded from a public Content Delivery Network (CDN). Vue.js was selected for its reactive data-binding system and component-based architecture, which enables the interface to update instantaneously in response to user input—a critical feature for an interactive calculator.

**2. Model-View-ViewModel (MVVM) Architecture:** The codebase is structured using the MVVM pattern to ensure a clean separation of concerns.
*   **Model:** A structured JavaScript object serves as the single source of truth, defining the metadata for all 11 calculators (e.g., titles, descriptions, formulas) and their associated input parameters (e.g., labels, tooltips, validation rules).
*   **View:** The HTML5 template is responsible for rendering the user interface. It employs semantic tags for accessibility and uses Vue's declarative rendering to bind UI elements to the ViewModel's state.
*   **ViewModel:** The Vue application instance orchestrates the logic. It manages the application's state (such as the currently selected calculator), handles user events, and, most importantly, uses **computed properties** to perform the statistical calculations. These properties are lazily evaluated and cached, ensuring high performance by re-calculating results only when a dependent input parameter is modified.

**3. User Experience (UX) and Educational Design:** The user interface was designed following established principles of usability and cognitive psychology¹³. The primary goal was to minimize cognitive load and provide a guided, educational experience.
*   **Guided Navigation:** The Welcome Screen acts as a conceptual map, directing users based on their research goals rather than forcing them to choose from a list of statistical test names.
*   **Contextual Scaffolding:** Each calculator is presented with an "in-situ" educational module, including a description of its purpose, guidance on when to use it, and a concrete, relatable research example.
*   **Immediate Feedback:** The interface provides real-time input validation and instantaneous display of results, adhering to Nielsen's heuristic of "Visibility of system status." This allows for rapid exploration of different design scenarios.
*   **Tooltip Explanations:** Every statistical parameter (e.g., α, p₀, σ) is paired with a tooltip that provides a concise, jargon-free explanation, demystifying the statistical inputs for non-experts.

---

### **Results**

The result of this development process is a production-ready, validated statistical tool that functions seamlessly across all modern desktop and mobile web browsers.

#### **Workflow and User Journey**

The user's journey is designed to be intuitive and logically progressive. **Figure 1** illustrates the workflow. Upon launching the application, the user is greeted with a Welcome Screen that categorizes the available calculators by their methodological purpose (Estimation, Hypothesis Testing, Rates & Survival). This design choice immediately orients the user based on their research question.

Upon selecting a specific calculator, the user is taken to the main workspace. This view is anchored by a persistent navigation sidebar for easy switching between calculators. The central panel is dedicated to the selected calculator, featuring its educational header, the input form, and the results display. This integrated design ensures that educational context is always present alongside the computational elements.

#### **Illustrative Case Study 1: Designing a Clinical Trial**

A clinical researcher is planning a randomized controlled trial (RCT) to evaluate a new drug for reducing systolic blood pressure (SBP) compared to a placebo. The planned workflow within the application is as follows:

1.  **Selection:** From the Welcome Screen, the researcher selects "Hypothesis Testing" and then chooses the "Two Means" calculator from the sidebar.
2.  **Contextual Learning:** The interface provides a description ("Compares the means of two independent groups") and an example related to comparing medications, confirming the choice is appropriate.
3.  **Parameterization:** The researcher enters the study parameters into the validated input fields. Based on prior studies, they hypothesize a mean SBP reduction of 15 mmHg for the drug (μ₁) versus 10 mmHg for the placebo (μ₂), with a standard deviation of 12 mmHg in both groups (σ₁ = σ₂ = 12). They specify conventional levels for Type I and II errors (α = 0.05, β = 0.20 for 80% power).
4.  **Instantaneous Calculation:** As the final parameter is entered, the results panel updates in real-time to display the required sample size: **91 participants per group**.

This process allows the researcher to perform sensitivity analysis effortlessly. For example, by changing β to 0.10 (for 90% power), the required sample size instantly updates to 122 per group, clearly demonstrating the trade-offs between statistical power and resource allocation.

#### **Illustrative Case Study 2: Planning a Prevalence Study**

An epidemiologist aims to estimate the prevalence of a specific biomarker in a population. They require the estimate to be within ±3% of the true value with 95% confidence. From a pilot study, the expected prevalence is around 20%.

1.  **Selection:** The user selects "Estimation Studies" and then "Single Proportion."
2.  **Parameterization:** They input: α = 0.05, the expected proportion p = 0.20, and the desired margin of error d = 0.03.
3.  **Calculation:** The tool instantly calculates the required sample size as **683 participants**. If the epidemiologist had no prior estimate for prevalence, the tooltip for 'p' advises using 0.5 for a conservative (maximum) sample size, which would update the result to 1068 participants.

#### **Verification and Validation**

The computational accuracy of all 11 calculators was rigorously verified. Results for a wide range of input parameters were cross-validated against established software (G*Power 3.1)⁷ and published sample size tables in seminal biostatistics textbooks⁹,¹⁰. The computed values from the Biomedical Sample Size Calculator showed perfect concordance (after accounting for rounding) with these external benchmarks, confirming the correctness of the underlying formula implementations.

---

### **Discussion**

The Biomedical Sample Size Calculator was developed to address a persistent and critical challenge in biomedical research: the gap between the need for rigorous study design and the accessibility of the tools required to implement it. Our application makes a novel contribution by synergistically combining statistical comprehensiveness, zero-barrier technical accessibility, and an integrated educational framework.

This work aligns with the broader principles of the Open Science movement¹⁴. By providing a free, open, and transparent tool, we aim to democratize access to high-quality research design methodology. The tool also adheres to the FAIR data principles (Findable, Accessible, Interoperable, and Reusable) in its philosophy¹⁵; it is findable via web search, accessible on any device with a browser, and promotes the reusability of sound statistical methods.

The principal advantage of our approach is its user-centric and pedagogical design. Traditional software often treats the user as an expert, requiring them to know the correct statistical test and its parameters in advance. Our tool inverts this model by guiding the user from their research question to the appropriate test, providing context and explanations at each step. This "just-in-time" learning model has the potential to build statistical capacity and confidence among researchers, promoting a deeper and more intuitive understanding of study design principles.

**Limitations and Future Directions**
While the current tool covers a wide array of common research designs, it is not exhaustive. The calculations are based on asymptotic theory, assuming large enough samples for normal approximations to be valid. The current version does not include methods for more complex designs, such as crossover trials, cluster-randomized trials, or studies with repeated measures. Furthermore, it does not currently offer calculators for non-parametric tests, equivalence or non-inferiority trials, or automated adjustments for participant attrition.

Future development is planned along several strategic avenues.
1.  **Expansion of Statistical Methods:** We plan to incorporate calculators for more advanced scenarios, including sample size for logistic regression, Cox proportional hazards models, and analyses of variance (ANOVA).
2.  **Enhanced Reporting:** A planned feature will allow users to generate a downloadable, report-ready text snippet that describes the sample size calculation and its parameters, suitable for direct inclusion in grant proposals and manuscripts.
3.  **Attrition and Post-hoc Adjustments:** We will add a utility to adjust the calculated sample size based on an expected dropout rate and include modules for post-hoc power analysis.
4.  **Educational Integration:** We envision the tool's use in biostatistics curricula. Future versions may include a "teaching mode" with more detailed explanations and interactive visualizations to demonstrate concepts like the relationship between power, sample size, and effect size.

### **Conclusion**

The Biomedical Sample Size Calculator is a modern, robust, and user-friendly tool that effectively addresses a critical need in the biomedical research community. By synthesizing validated statistical formulas, a zero-dependency web architecture, and an integrated educational design, it empowers researchers to perform essential sample size calculations with confidence and a deeper understanding of the underlying principles. This work contributes to the vital mission of enhancing methodological rigor and supports the foundation of evidence-based science by making sound statistical design an intuitive, accessible, and integral part of every researcher's workflow.

---
### **References**

1.  Munafò, M. R. et al. A manifesto for reproducible science. *Nat. Hum. Behav.* **1**, 0021 (2017).
2.  Ioannidis, J. P. A. Why Most Published Research Findings Are False. *PLoS Med.* **2**, e124 (2005).
3.  Begley, C. G. & Ellis, L. M. Drug development: Raise standards for preclinical cancer research. *Nature* **483**, 531–533 (2012).
4.  Open Science Collaboration. Estimating the reproducibility of psychological science. *Science* **349**, aac4716 (2015).
5.  Button, K. S. et al. Power failure: why small sample size undermines the reliability of neuroscience. *Nat. Rev. Neurosci.* **14**, 365–376 (2013).
6.  Hulley, S. B., Cummings, S. R., Browner, W. S., Grady, D. G. & Newman, T. B. *Designing Clinical Research* (Lippincott Williams & Wilkins, 2013).
7.  Faul, F., Erdfelder, E., Lang, A.-G. & Buchner, A. G*Power 3: A flexible statistical power analysis program for the social, behavioral, and biomedical sciences. *Behav. Res. Methods* **39**, 175–191 (2007).
8.  Champely, S. *pwr: Basic Functions for Power Analysis*. R package version 1.3-0. (2020).
9.  Fleiss, J. L., Levin, B. & Paik, M. C. *Statistical Methods for Rates and Proportions* (John Wiley & Sons, 2003).
10. Chow, S.-C., Shao, J., Wang, H. & Lokhnygina, Y. *Sample Size Calculations in Clinical Research* (Chapman and Hall/CRC, 2017).
11. Machin, D., Campbell, M. J., Tan, S. B. & Tan, S. H. *Sample Sizes for Clinical, Laboratory and Epidemiology Studies* (Wiley-Blackwell, 2018).
12. Fisher, R. A. On the "probable error" of a coefficient of correlation deduced from a small sample. *Metron* **1**, 3–32 (1921).
13. Nielsen, J. *Usability Engineering* (Morgan Kaufmann, 1994).
14. Wilkinson, M. D. et al. The FAIR Guiding Principles for scientific data management and stewardship. *Sci. Data* **3**, 160018 (2016).
15. Nosek, B. A. et al. The Center for Open Science: A disciplinary commons to improve research practices. *Journal of Librarianship and Scholarly Communication* **2**, eP1158 (2014).