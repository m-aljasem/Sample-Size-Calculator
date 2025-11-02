// Mathematical formulas and variable explanations for each calculator

export const formulas = {
  estimateProportion: {
    formula: 'n = (Z² × p × (1-p)) / d²',
    formulaLaTeX: 'n = \\frac{Z^2 \\times p \\times (1-p)}{d^2}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size',
        description: 'The required number of subjects needed to estimate the proportion with the specified precision'
      },
      {
        symbol: 'Z',
        name: 'Z-score',
        description: 'Critical value from the standard normal distribution corresponding to the confidence level (α). For 95% confidence (α=0.05), Z=1.96'
      },
      {
        symbol: 'p',
        name: 'Expected Proportion',
        description: 'The anticipated or estimated proportion in the population. Use 0.5 if unknown to maximize sample size'
      },
      {
        symbol: 'd',
        name: 'Margin of Error',
        description: 'The desired precision or maximum acceptable difference between the sample proportion and true population proportion (half-width of confidence interval)'
      }
    ]
  },
  
  estimateMean: {
    formula: 'n = (Z² × σ²) / d²',
    formulaLaTeX: 'n = \\frac{Z^2 \\times \\sigma^2}{d^2}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size',
        description: 'The required number of subjects needed to estimate the mean with the specified precision'
      },
      {
        symbol: 'Z',
        name: 'Z-score',
        description: 'Critical value from the standard normal distribution. For 95% confidence (α=0.05), Z=1.96'
      },
      {
        symbol: 'σ',
        name: 'Standard Deviation',
        description: 'The population standard deviation of the continuous variable. This can be estimated from previous studies or pilot data'
      },
      {
        symbol: 'd',
        name: 'Margin of Error',
        description: 'The desired precision or maximum acceptable difference between the sample mean and true population mean'
      }
    ]
  },

  estimateDiff2Proportions: {
    formula: 'n = (Z² × [p₁(1-p₁) + p₂(1-p₂)]) / d²',
    formulaLaTeX: 'n = \\frac{Z^2 \\times [p_1(1-p_1) + p_2(1-p_2)]}{d^2}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size Per Group',
        description: 'The required number of subjects in each group to estimate the difference between two proportions'
      },
      {
        symbol: 'Z',
        name: 'Z-score',
        description: 'Critical value for the confidence level. For 95% confidence (α=0.05), Z=1.96'
      },
      {
        symbol: 'p₁',
        name: 'Proportion in Group 1',
        description: 'The expected proportion in the first group'
      },
      {
        symbol: 'p₂',
        name: 'Proportion in Group 2',
        description: 'The expected proportion in the second group'
      },
      {
        symbol: 'd',
        name: 'Margin of Error',
        description: 'The desired precision for estimating the difference between the two proportions'
      }
    ]
  },

  estimateOddsRatio: {
    formula: 'n = Z² / [ln(1-ε)]² × [1/(p₁(1-p₁)) + 1/(p₂(1-p₂))]',
    formulaLaTeX: 'n = \\frac{Z^2}{[\\ln(1-\\varepsilon)]^2} \\times \\left[\\frac{1}{p_1(1-p_1)} + \\frac{1}{p_2(1-p_2)}\\right]',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size Per Group',
        description: 'Required sample size per group (cases and controls) for estimating the odds ratio'
      },
      {
        symbol: 'Z',
        name: 'Z-score',
        description: 'Critical value for the confidence level. For 95% confidence (α=0.05), Z=1.96'
      },
      {
        symbol: 'p₁',
        name: 'Proportion in Cases',
        description: 'Proportion of exposure in the case group, calculated from p₂ and OR: p₁ = (OR × p₂) / (1 - p₂ + OR × p₂)'
      },
      {
        symbol: 'p₂',
        name: 'Proportion in Controls',
        description: 'Proportion of exposure in the control group'
      },
      {
        symbol: 'OR',
        name: 'Odds Ratio',
        description: 'The expected odds ratio (strength of association between exposure and outcome)'
      },
      {
        symbol: 'ε',
        name: 'Relative Precision',
        description: 'The desired relative precision for the odds ratio estimate (e.g., 0.2 for 20% precision)'
      }
    ]
  },

  estimateRelativeRisk: {
    formula: 'n = Z² / [ln(1-ε)]² × [(1-p₁)/p₁ + (1-p₂)/p₂]',
    formulaLaTeX: 'n = \\frac{Z^2}{[\\ln(1-\\varepsilon)]^2} \\times \\left[\\frac{1-p_1}{p_1} + \\frac{1-p_2}{p_2}\\right]',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size Per Group',
        description: 'Required sample size per group (exposed and unexposed) for estimating the relative risk'
      },
      {
        symbol: 'Z',
        name: 'Z-score',
        description: 'Critical value for the confidence level. For 95% confidence (α=0.05), Z=1.96'
      },
      {
        symbol: 'p₁',
        name: 'Proportion in Exposed',
        description: 'Proportion of outcome in the exposed group: p₁ = p₂ × RR'
      },
      {
        symbol: 'p₂',
        name: 'Proportion in Unexposed',
        description: 'Proportion of outcome in the unexposed (reference) group'
      },
      {
        symbol: 'RR',
        name: 'Relative Risk',
        description: 'The expected relative risk (risk ratio) comparing exposed to unexposed groups'
      },
      {
        symbol: 'ε',
        name: 'Relative Precision',
        description: 'The desired relative precision for the relative risk estimate (e.g., 0.2 for 20% precision)'
      }
    ]
  },

  estimateCorrelation: {
    formula: 'n = 3 + (Z / Fisher\'s Z)²',
    formulaLaTeX: 'n = 3 + \\left(\\frac{Z}{Z_r}\\right)^2',
    formulaDetail: 'where Fisher\'s Z = 0.5 × ln[(1+r)/(1-r)]',
    formulaDetailLaTeX: '\\text{where } Z_r = \\frac{1}{2} \\ln\\left(\\frac{1+r}{1-r}\\right)',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size',
        description: 'The required number of paired observations to estimate the correlation coefficient'
      },
      {
        symbol: 'Z',
        name: 'Z-score',
        description: 'Critical value for the confidence level. For 95% confidence (α=0.05), Z=1.96'
      },
      {
        symbol: 'r',
        name: 'Expected Correlation',
        description: 'The anticipated correlation coefficient between the two continuous variables (ranges from -1 to 1)'
      },
      {
        symbol: 'Fisher\'s Z',
        name: 'Fisher Transformation',
        description: 'Fisher\'s Z-transformation of the correlation coefficient, used because correlation is not normally distributed'
      }
    ]
  },

  testProportion: {
    formula: 'n = [Z_α√(p₀(1-p₀)) + Z_β√(pₐ(1-pₐ))]² / (p₀ - pₐ)²',
    formulaLaTeX: 'n = \\frac{[Z_{\\alpha}\\sqrt{p_0(1-p_0)} + Z_{\\beta}\\sqrt{p_a(1-p_a)}]^2}{(p_0 - p_a)^2}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size',
        description: 'The required number of subjects to test if the population proportion differs from the null hypothesis value'
      },
      {
        symbol: 'Z_α',
        name: 'Z-score for α',
        description: 'Critical value for Type I error (significance level). For α=0.05 (two-tailed), Z_α=1.96'
      },
      {
        symbol: 'Z_β',
        name: 'Z-score for β',
        description: 'Critical value for Type II error. For β=0.2 (80% power, one-tailed), Z_β=0.84'
      },
      {
        symbol: 'p₀',
        name: 'Null Hypothesis Proportion',
        description: 'The proportion value under the null hypothesis (H₀)'
      },
      {
        symbol: 'pₐ',
        name: 'Alternative Hypothesis Proportion',
        description: 'The proportion value under the alternative hypothesis (H₁) that you want to detect'
      }
    ]
  },

  test2Proportions: {
    formula: 'n = [Z_α√(2p̄(1-p̄)) + Z_β√(p₁(1-p₁) + p₂(1-p₂))]² / (p₁ - p₂)²',
    formulaLaTeX: 'n = \\frac{[Z_{\\alpha}\\sqrt{2\\bar{p}(1-\\bar{p})} + Z_{\\beta}\\sqrt{p_1(1-p_1) + p_2(1-p_2)}]^2}{(p_1 - p_2)^2}',
    formulaDetail: 'where p̄ = (p₁ + p₂) / 2',
    formulaDetailLaTeX: '\\text{where } \\bar{p} = \\frac{p_1 + p_2}{2}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size Per Group',
        description: 'The required number of subjects in each group to detect a difference between two proportions'
      },
      {
        symbol: 'Z_α',
        name: 'Z-score for α',
        description: 'Critical value for Type I error. For α=0.05 (two-tailed), Z_α=1.96'
      },
      {
        symbol: 'Z_β',
        name: 'Z-score for β',
        description: 'Critical value for Type II error. For β=0.2 (80% power), Z_β=0.84'
      },
      {
        symbol: 'p₁',
        name: 'Proportion in Group 1',
        description: 'The expected proportion in the first group'
      },
      {
        symbol: 'p₂',
        name: 'Proportion in Group 2',
        description: 'The expected proportion in the second group'
      },
      {
        symbol: 'p̄',
        name: 'Pooled Proportion',
        description: 'The average of the two proportions: p̄ = (p₁ + p₂) / 2'
      }
    ]
  },

  test2Means: {
    formula: 'n = [(σ₁² + σ₂²) × (Z_α + Z_β)²] / (μ₁ - μ₂)²',
    formulaLaTeX: 'n = \\frac{(\\sigma_1^2 + \\sigma_2^2) \\times (Z_{\\alpha} + Z_{\\beta})^2}{(\\mu_1 - \\mu_2)^2}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size Per Group',
        description: 'The required number of subjects in each group to detect a difference between two means'
      },
      {
        symbol: 'Z_α',
        name: 'Z-score for α',
        description: 'Critical value for Type I error. For α=0.05 (two-tailed), Z_α=1.96'
      },
      {
        symbol: 'Z_β',
        name: 'Z-score for β',
        description: 'Critical value for Type II error. For β=0.2 (80% power), Z_β=0.84'
      },
      {
        symbol: 'μ₁',
        name: 'Mean in Group 1',
        description: 'The expected mean value in the first group'
      },
      {
        symbol: 'μ₂',
        name: 'Mean in Group 2',
        description: 'The expected mean value in the second group'
      },
      {
        symbol: 'σ₁',
        name: 'Standard Deviation in Group 1',
        description: 'The expected standard deviation in the first group'
      },
      {
        symbol: 'σ₂',
        name: 'Standard Deviation in Group 2',
        description: 'The expected standard deviation in the second group'
      }
    ]
  },

  test2Correlations: {
    formula: 'n = [(Z_α + Z_β) / (Z_{r₁} - Z_{r₂})]² + 3',
    formulaLaTeX: 'n = \\left(\\frac{Z_{\\alpha} + Z_{\\beta}}{Z_{r_1} - Z_{r_2}}\\right)^2 + 3',
    formulaDetail: 'where Z_r = 0.5 × ln[(1+r)/(1-r)] (Fisher transformation)',
    formulaDetailLaTeX: '\\text{where } Z_r = \\frac{1}{2} \\ln\\left(\\frac{1+r}{1-r}\\right) \\text{ (Fisher transformation)}',
    variables: [
      {
        symbol: 'n',
        name: 'Sample Size Per Group',
        description: 'The required number of paired observations in each group to detect a difference between two correlation coefficients'
      },
      {
        symbol: 'Z_α',
        name: 'Z-score for α',
        description: 'Critical value for Type I error. For α=0.05 (two-tailed), Z_α=1.96'
      },
      {
        symbol: 'Z_β',
        name: 'Z-score for β',
        description: 'Critical value for Type II error. For β=0.2 (80% power), Z_β=0.84'
      },
      {
        symbol: 'r₁',
        name: 'Correlation in Group 1',
        description: 'The expected correlation coefficient in the first group'
      },
      {
        symbol: 'r₂',
        name: 'Correlation in Group 2',
        description: 'The expected correlation coefficient in the second group'
      },
      {
        symbol: 'Z_{r₁}, Z_{r₂}',
        name: 'Fisher\'s Z Transformations',
        description: 'Fisher\'s Z-transformation of r₁ and r₂, respectively. Z_r = 0.5 × ln[(1+r)/(1-r)]'
      }
    ]
  },

  test2Rates: {
    formula: 'E = [Z_α√((k+1)/k × λ̄) + Z_β√(λ₁ + λ₂/k)]² / (λ₁ - λ₂)²',
    formulaLaTeX: 'E_1 = \\frac{\\left[Z_{\\alpha}\\sqrt{\\frac{k+1}{k} \\times \\bar{\\lambda}} + Z_{\\beta}\\sqrt{\\lambda_1 + \\frac{\\lambda_2}{k}}\\right]^2}{(\\lambda_1 - \\lambda_2)^2}',
    formulaDetail: 'where λ̄ = (k × λ₁ + λ₂) / (k + 1) and E₂ = k × E₁',
    formulaDetailLaTeX: '\\text{where } \\bar{\\lambda} = \\frac{k \\times \\lambda_1 + \\lambda_2}{k + 1} \\text{ and } E_2 = k \\times E_1',
    variables: [
      {
        symbol: 'E₁',
        name: 'Events in Group 1',
        description: 'The required number of events (not subjects) in group 1'
      },
      {
        symbol: 'E₂',
        name: 'Events in Group 2',
        description: 'The required number of events in group 2, calculated as E₂ = k × E₁'
      },
      {
        symbol: 'Z_α',
        name: 'Z-score for α',
        description: 'Critical value for Type I error. For α=0.05 (two-tailed), Z_α=1.96'
      },
      {
        symbol: 'Z_β',
        name: 'Z-score for β',
        description: 'Critical value for Type II error. For β=0.2 (80% power), Z_β=0.84'
      },
      {
        symbol: 'λ₁',
        name: 'Incidence Rate in Group 1',
        description: 'The expected incidence rate (events per person-time) in group 1'
      },
      {
        symbol: 'λ₂',
        name: 'Incidence Rate in Group 2',
        description: 'The expected incidence rate (events per person-time) in group 2'
      },
      {
        symbol: 'λ̄',
        name: 'Pooled Rate',
        description: 'The weighted average rate: λ̄ = (k × λ₁ + λ₂) / (k + 1)'
      },
      {
        symbol: 'k',
        name: 'Allocation Ratio',
        description: 'Ratio of subjects in group 2 to group 1 (k = n₂/n₁). Use 1 for equal groups'
      }
    ]
  }
}

