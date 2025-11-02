// Effect size estimation helpers
export const convertTStatToEffectSize = (t, n1, n2) => {
  const df = (n1 + n2 - 2)
  const d = t * Math.sqrt(1/n1 + 1/n2)
  return d
}

export const convertFStatToEffectSize = (F, df1, df2) => {
  // For one-way ANOVA
  const etaSquared = (df1 * F) / (df1 * F + df2)
  return Math.sqrt(etaSquared / (1 - etaSquared)) // Convert to Cohen's d approximation
}

export const convertChiSqToEffectSize = (chiSq, n, df = 1) => {
  // Cramér's V
  return Math.sqrt(chiSq / (n * (df - 1)))
}

export const convertPValueToEffectSize = (p, n1, n2, twoTailed = true) => {
  // Approximate conversion - requires assumptions
  // This is a rough approximation and should be used with caution
  // Simple normal approximation for z-score from p-value
  const pAdjusted = twoTailed ? p / 2 : p
  // Approximate z-score using inverse normal CDF approximation
  const z = Math.sqrt(-2 * Math.log(pAdjusted))
  const pooledN = (n1 + n2) / 2
  return z * Math.sqrt(2 / pooledN)
}

export const effectSizeBenchmarks = {
  psychology: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    correlation: { small: 0.1, medium: 0.3, large: 0.5 }
  },
  medicine: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    or: { small: 1.5, medium: 2.5, large: 4.0 }
  },
  education: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 }
  },
  default: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    correlation: { small: 0.1, medium: 0.3, large: 0.5 }
  }
}

export const getEffectSizeInterpretation = (value, type = 'cohensD', field = 'default') => {
  const benchmarks = effectSizeBenchmarks[field] || effectSizeBenchmarks.default
  const thresholds = benchmarks[type] || benchmarks.cohensD
  
  if (Math.abs(value) >= thresholds.large) return 'large'
  if (Math.abs(value) >= thresholds.medium) return 'medium'
  if (Math.abs(value) >= thresholds.small) return 'small'
  return 'negligible'
}
