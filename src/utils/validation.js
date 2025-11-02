// Calculation validation and warnings
export const validateInputs = (inputs, calculatorKey) => {
  const warnings = []
  const errors = []
  
  // Common validations
  if (inputs.alpha && (inputs.alpha <= 0 || inputs.alpha >= 1)) {
    errors.push('Alpha must be between 0 and 1')
  }
  
  if (inputs.beta && (inputs.beta <= 0 || inputs.beta >= 1)) {
    errors.push('Beta must be between 0 and 1')
  }
  
  if (inputs.power && (inputs.power <= 0 || inputs.power >= 1)) {
    errors.push('Power must be between 0 and 1')
  }
  
  // Power validation
  if (inputs.beta) {
    const power = 1 - inputs.beta
    if (power < 0.5) {
      warnings.push({
        type: 'low_power',
        message: `Power is ${(power * 100).toFixed(0)}%. Power below 50% is typically insufficient.`,
        severity: 'warning'
      })
    }
    if (power < 0.8 && power >= 0.5) {
      warnings.push({
        type: 'moderate_power',
        message: `Power is ${(power * 100).toFixed(0)}%. Consider increasing to 80% or higher for adequate statistical power.`,
        severity: 'info'
      })
    }
  }
  
  // Sample size warnings
  if (inputs.n) {
    if (inputs.n > 10000) {
      warnings.push({
        type: 'large_sample',
        message: `Sample size of ${inputs.n.toLocaleString()} may be impractical. Consider if this is feasible.`,
        severity: 'warning'
      })
    }
    if (inputs.n < 10) {
      warnings.push({
        type: 'small_sample',
        message: `Sample size of ${inputs.n} is very small. Statistical assumptions may not hold.`,
        severity: 'warning'
      })
    }
  }
  
  // Effect size validations for proportions
  if (inputs.p1 !== undefined && inputs.p2 !== undefined) {
    const diff = Math.abs(inputs.p1 - inputs.p2)
    if (diff < 0.01) {
      warnings.push({
        type: 'small_effect',
        message: `Difference between proportions (${(diff * 100).toFixed(1)}%) is very small. Large sample size may be required.`,
        severity: 'info'
      })
    }
    if (inputs.p1 < 0.05 || inputs.p2 < 0.05 || inputs.p1 > 0.95 || inputs.p2 > 0.95) {
      warnings.push({
        type: 'extreme_proportion',
        message: 'Proportions near 0 or 1 may require special consideration (e.g., exact tests).',
        severity: 'info'
      })
    }
  }
  
  // Means validation
  if (inputs.mu1 !== undefined && inputs.mu2 !== undefined && inputs.sd1 && inputs.sd2) {
    const effectSize = Math.abs(inputs.mu1 - inputs.mu2) / Math.sqrt((inputs.sd1 * inputs.sd1 + inputs.sd2 * inputs.sd2) / 2)
    if (effectSize < 0.1) {
      warnings.push({
        type: 'tiny_effect',
        message: `Effect size (Cohen's d = ${effectSize.toFixed(2)}) is very small. This may require an extremely large sample.`,
        severity: 'warning'
      })
    }
    if (effectSize > 2) {
      warnings.push({
        type: 'huge_effect',
        message: `Effect size (Cohen's d = ${effectSize.toFixed(2)}) is very large. Small sample may suffice, but verify assumptions.`,
        severity: 'info'
      })
    }
  }
  
  // Attrition validation
  if (inputs.dropoutRate) {
    if (inputs.dropoutRate > 0.5) {
      warnings.push({
        type: 'high_attrition',
        message: `Dropout rate of ${(inputs.dropoutRate * 100).toFixed(0)}% is very high. Consider study design improvements.`,
        severity: 'warning'
      })
    }
  }
  
  // One-tailed validation
  if (inputs.twoTailed === false) {
    warnings.push({
      type: 'one_tailed',
      message: 'One-tailed test assumes directional hypothesis. Ensure this is appropriate for your research question.',
      severity: 'info'
    })
  }
  
  return { errors, warnings }
}

export const validateCalculationResult = (result) => {
  const warnings = []
  
  if (!result || result.error) {
    return { warnings, isValid: false }
  }
  
  if (result.value) {
    if (result.value > 50000) {
      warnings.push({
        type: 'extremely_large',
        message: 'Calculated sample size is extremely large. Verify inputs and consider if this is practical.',
        severity: 'warning'
      })
    }
    
    if (result.value < 3) {
      warnings.push({
        type: 'too_small',
        message: 'Calculated sample size is very small. Statistical assumptions may not hold.',
        severity: 'warning'
      })
    }
  }
  
  return { warnings, isValid: true }
}
