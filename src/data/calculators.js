// Calculator configurations and data
export const estimationCalculators = [
  {
    key: 'estimateProportion',
    title: 'Single Proportion',
    emoji: '📌',
    description: 'Calculates the sample size needed to estimate a population proportion with a specified margin of error.',
    usage: 'Use this test when you want to estimate a single proportion in a population with a specific level of precision (confidence interval). This is ideal for prevalence studies, surveys, or quality control where you need to know "what percentage" of a population has a certain characteristic.',
    example: 'Estimating the prevalence of diabetes in a city, determining the percentage of students who pass an exam, or finding the proportion of defective products in manufacturing.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level (e.g., 0.05 for 95% confidence)', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'p', label: 'p (Expected Proportion)', tooltip: 'Estimated proportion of the attribute in the population (use 0.5 if unknown)', step: 0.01, min: 0, max: 1, placeholder: '0.5' },
      { name: 'd', label: 'd (Margin of Error)', tooltip: 'The desired precision (e.g., 0.03 for ±3%)', step: 0.01, min: 0, placeholder: '0.05' }
    ]
  },
  {
    key: 'estimateMean',
    title: 'Single Mean',
    emoji: '📏',
    description: 'Calculates the sample size needed to estimate a population mean with a specified margin of error.',
    usage: 'Use this test when you want to estimate the average value of a continuous variable in a population with a specific precision. You need to know or estimate the standard deviation of the variable.',
    example: 'Estimating the average blood pressure in adults, determining mean body weight in a population, or calculating average test scores.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level (e.g., 0.05 for 95% confidence)', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'sd', label: 'σ (Standard Deviation)', tooltip: 'Estimated standard deviation of the population', step: 0.01, min: 0, placeholder: 'e.g., 15' },
      { name: 'd', label: 'd (Margin of Error)', tooltip: 'The desired precision', step: 0.01, min: 0, placeholder: 'e.g., 2' }
    ]
  },
  {
    key: 'estimateDiff2Proportions',
    title: 'Difference Between 2 Proportions',
    emoji: '⚖️',
    description: 'Calculates the sample size per group to estimate the difference between two population proportions.',
    usage: 'Use this test when you want to estimate the difference in proportions between two independent groups with a specified precision. This is useful for comparing prevalence rates or percentages between two populations.',
    example: 'Comparing smoking rates between men and women, estimating the difference in recovery rates between two treatment protocols, or comparing disease prevalence across two regions.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'p1', label: 'p₁ (Proportion Group 1)', tooltip: 'Expected proportion in the first group', step: 0.01, min: 0, max: 1, placeholder: '0.5' },
      { name: 'p2', label: 'p₂ (Proportion Group 2)', tooltip: 'Expected proportion in the second group', step: 0.01, min: 0, max: 1, placeholder: '0.4' },
      { name: 'd', label: 'd (Margin of Error)', tooltip: 'Desired precision for the difference', step: 0.01, min: 0, placeholder: '0.05' }
    ]
  },
  {
    key: 'estimateOddsRatio',
    title: 'Odds Ratio',
    emoji: '🎲',
    description: 'Calculates sample size for estimating an Odds Ratio with specified relative precision.',
    usage: 'Use this test for case-control studies when you want to estimate the odds ratio (strength of association between exposure and outcome) with a specific level of precision. Odds ratios are particularly useful when the outcome is rare.',
    example: 'Estimating the association between smoking and lung cancer in a case-control study, studying the relationship between a genetic marker and disease risk.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'p2', label: 'p₂ (Proportion in Controls)', tooltip: 'Proportion of exposure in the control group', step: 0.01, min: 0, max: 1, placeholder: '0.3' },
      { name: 'or', label: 'OR (Expected Odds Ratio)', tooltip: 'The anticipated Odds Ratio', step: 0.1, min: 0, placeholder: '2' },
      { name: 'epsilon', label: 'ε (Relative Precision)', tooltip: 'e.g., 0.2 for 20% precision', step: 0.01, min: 0, max: 1, placeholder: '0.2' }
    ]
  },
  {
    key: 'estimateRelativeRisk',
    title: 'Relative Risk',
    emoji: '📈',
    description: 'Calculates sample size for estimating a Relative Risk with specified relative precision.',
    usage: 'Use this test for cohort studies or clinical trials when you want to estimate relative risk (risk ratio) with a specific precision. Relative risk compares the probability of an outcome between exposed and unexposed groups.',
    example: 'Estimating the risk of heart disease in smokers vs. non-smokers in a cohort study, comparing infection rates between vaccinated and unvaccinated groups.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'p2', label: 'p₂ (Proportion in Unexposed)', tooltip: 'Proportion of outcome in the unexposed group', step: 0.01, min: 0, max: 1, placeholder: '0.2' },
      { name: 'rr', label: 'RR (Expected Relative Risk)', tooltip: 'The anticipated Relative Risk', step: 0.1, min: 0, placeholder: '2' },
      { name: 'epsilon', label: 'ε (Relative Precision)', tooltip: 'e.g., 0.2 for 20% precision', step: 0.01, min: 0, max: 1, placeholder: '0.2' }
    ]
  },
  {
    key: 'estimateCorrelation',
    title: 'Correlation Coefficient',
    emoji: '🔗',
    description: 'Calculates sample size needed to estimate a correlation coefficient.',
    usage: 'Use this test when you want to estimate the strength of a linear relationship between two continuous variables with a specific level of precision. This is common in observational studies examining associations.',
    example: 'Estimating the correlation between age and blood pressure, studying the relationship between study hours and exam scores, or examining the association between height and weight.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'r', label: 'r (Expected Correlation)', tooltip: 'The expected correlation coefficient (between -1 and 1)', step: 0.01, min: -1, max: 1, placeholder: '0.3' }
    ]
  }
]

export const hypothesisCalculators = [
  {
    key: 'testProportion',
    title: 'Single Proportion',
    emoji: '🧪',
    description: 'Compares an observed proportion to a hypothesized population proportion.',
    usage: 'Use this test when you want to test whether a population proportion differs from a specific hypothesized value. You need to specify both the null hypothesis proportion and the alternative proportion you want to detect, along with desired power.',
    example: 'Testing if a new drug has a success rate different from the standard 50%, determining if voter support exceeds 60%, or checking if defect rates are below 5%.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'beta', label: 'β (Beta)', tooltip: 'Type II error rate (e.g., 0.2 for 80% power)', step: 0.01, min: 0, max: 1, placeholder: '0.2' },
      { name: 'p0', label: 'p₀ (Null Hypothesis Proportion)', tooltip: 'The proportion under the null hypothesis', step: 0.01, min: 0, max: 1, placeholder: '0.5' },
      { name: 'pa', label: 'pₐ (Alternative Hypothesis Proportion)', tooltip: 'The proportion under the alternative hypothesis', step: 0.01, min: 0, max: 1, placeholder: '0.6' }
    ]
  },
  {
    key: 'test2Proportions',
    title: 'Two Proportions',
    emoji: '🔬',
    description: 'Compares proportions between two independent groups.',
    usage: 'Use this test when you want to compare proportions between two independent groups and test if there is a statistically significant difference. This is one of the most common tests in clinical trials and epidemiological studies.',
    example: 'Comparing cure rates between treatment and control groups, testing if smoking rates differ between genders, or comparing infection rates between two vaccines.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'beta', label: 'β (Beta)', tooltip: 'Type II error rate', step: 0.01, min: 0, max: 1, placeholder: '0.2' },
      { name: 'p1', label: 'p₁ (Proportion Group 1)', tooltip: 'Expected proportion in group 1', step: 0.01, min: 0, max: 1, placeholder: '0.6' },
      { name: 'p2', label: 'p₂ (Proportion Group 2)', tooltip: 'Expected proportion in group 2', step: 0.01, min: 0, max: 1, placeholder: '0.4' }
    ]
  },
  {
    key: 'test2Means',
    title: 'Two Means',
    emoji: '📊',
    description: 'Compares the means of two independent groups.',
    usage: 'Use this test when comparing the average values of a continuous variable between two independent groups. This is the foundation for many clinical trials and experimental studies where you measure continuous outcomes.',
    example: 'Comparing mean blood pressure reduction between two medications, testing if average weight loss differs between diet programs, or comparing mean test scores between teaching methods.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'beta', label: 'β (Beta)', tooltip: 'Type II error rate', step: 0.01, min: 0, max: 1, placeholder: '0.2' },
      { name: 'mu1', label: 'μ₁ (Mean Group 1)', tooltip: 'Expected mean for group 1', step: 0.01, placeholder: 'e.g., 100' },
      { name: 'mu2', label: 'μ₂ (Mean Group 2)', tooltip: 'Expected mean for group 2', step: 0.01, placeholder: 'e.g., 95' },
      { name: 'sd1', label: 'σ₁ (SD Group 1)', tooltip: 'Standard deviation for group 1', step: 0.01, min: 0, placeholder: 'e.g., 15' },
      { name: 'sd2', label: 'σ₂ (SD Group 2)', tooltip: 'Standard deviation for group 2', step: 0.01, min: 0, placeholder: 'e.g., 15' }
    ]
  },
  {
    key: 'test2Correlations',
    title: 'Two Correlation Coefficients',
    emoji: '🔗',
    description: 'Compares correlation coefficients between two independent groups.',
    usage: 'Use this test when you want to compare the strength of linear relationships between two continuous variables across two different groups. This helps determine if associations differ between populations.',
    example: 'Testing if the correlation between exercise and blood pressure differs between young and elderly adults, comparing the relationship between study time and performance across different schools.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'beta', label: 'β (Beta)', tooltip: 'Type II error rate', step: 0.01, min: 0, max: 1, placeholder: '0.2' },
      { name: 'r1', label: 'r₁ (Correlation Group 1)', tooltip: 'Expected correlation in group 1', step: 0.01, min: -1, max: 1, placeholder: '0.5' },
      { name: 'r2', label: 'r₂ (Correlation Group 2)', tooltip: 'Expected correlation in group 2', step: 0.01, min: -1, max: 1, placeholder: '0.3' }
    ]
  }
]

export const ratesCalculators = [
  {
    key: 'test2Rates',
    title: 'Two Incidence Rates',
    emoji: '⏱️',
    description: 'Compares incidence rates between two groups (e.g., in a cohort study). Calculates required events per group.',
    usage: 'Use this test for cohort studies or clinical trials where you are comparing the rate at which events occur over time between two groups. This accounts for varying follow-up times and is ideal for time-to-event data.',
    example: 'Comparing hospitalization rates between treated and untreated groups, testing if infection rates per person-year differ between vaccinated and unvaccinated cohorts, or comparing mortality rates in longitudinal studies.',
    inputs: [
      { name: 'alpha', label: 'α (Alpha)', tooltip: 'Significance level', step: 0.01, min: 0, max: 1, placeholder: '0.05' },
      { name: 'beta', label: 'β (Beta)', tooltip: 'Type II error rate', step: 0.01, min: 0, max: 1, placeholder: '0.2' },
      { name: 'lambda1', label: 'λ₁ (Rate Group 1)', tooltip: 'Incidence rate in group 1 (events per person-year)', step: 0.01, min: 0, placeholder: 'e.g., 0.05' },
      { name: 'lambda2', label: 'λ₂ (Rate Group 2)', tooltip: 'Incidence rate in group 2', step: 0.01, min: 0, placeholder: 'e.g., 0.03' },
      { name: 'k', label: 'k (Allocation Ratio)', tooltip: 'Ratio of subjects in group 2 to group 1 (e.g., 1 for equal groups)', step: 0.1, min: 0, placeholder: '1' }
    ]
  }
]

// Default input values
export const defaultInputs = {
  estimateProportion: { alpha: 0.05, p: 0.5, d: 0.05 },
  estimateMean: { alpha: 0.05, sd: 15, d: 2 },
  estimateDiff2Proportions: { alpha: 0.05, p1: 0.5, p2: 0.4, d: 0.05 },
  estimateOddsRatio: { alpha: 0.05, p2: 0.3, or: 2, epsilon: 0.2 },
  estimateRelativeRisk: { alpha: 0.05, p2: 0.2, rr: 2, epsilon: 0.2 },
  estimateCorrelation: { alpha: 0.05, r: 0.3 },
  testProportion: { alpha: 0.05, beta: 0.2, p0: 0.5, pa: 0.6 },
  test2Proportions: { alpha: 0.05, beta: 0.2, p1: 0.6, p2: 0.4 },
  test2Means: { alpha: 0.05, beta: 0.2, mu1: 100, mu2: 95, sd1: 15, sd2: 15 },
  test2Correlations: { alpha: 0.05, beta: 0.2, r1: 0.5, r2: 0.3 },
  test2Rates: { alpha: 0.05, beta: 0.2, lambda1: 0.05, lambda2: 0.03, k: 1 }
}
