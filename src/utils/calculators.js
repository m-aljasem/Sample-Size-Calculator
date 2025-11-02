// Statistical calculation utilities
export const getZScore = (alpha, twoTailed = true) => {
  if (alpha === 0.10 && twoTailed) return 1.645
  if (alpha === 0.05 && twoTailed) return 1.96
  if (alpha === 0.01 && twoTailed) return 2.576
  if (alpha === 0.05 && !twoTailed) return 1.645
  if (alpha === 0.20 && !twoTailed) return 0.84
  if (alpha === 0.10 && !twoTailed) return 1.28
  if (alpha === 0.01 && !twoTailed) return 2.326
  // Interpolate for other values
  if (!twoTailed) {
    // One-tailed: Z = norminv(1-alpha)
    return 1.96 // Default approximation
  }
  return 1.96
}

// Get Z-score for beta (one-tailed for power)
export const getZBeta = (beta) => {
  const power = 1 - beta
  if (power === 0.80) return 0.84
  if (power === 0.90) return 1.28
  if (power === 0.95) return 1.645
  // Interpolate for other values
  return 0.84 // Default for 80% power
}

// Attrition adjustment utility
export const adjustForAttrition = (sampleSize, dropoutRate) => {
  if (!dropoutRate || dropoutRate <= 0 || dropoutRate >= 1) return sampleSize
  return Math.ceil(sampleSize / (1 - dropoutRate))
}

// Apply unequal group allocation
export const applyAllocationRatio = (sampleSizePerGroup, allocationRatio = 1) => {
  if (!allocationRatio || allocationRatio <= 0) allocationRatio = 1
  const n1 = Math.ceil(sampleSizePerGroup)
  const n2 = Math.ceil(sampleSizePerGroup * allocationRatio)
  return { n1, n2, total: n1 + n2, ratio: allocationRatio }
}

// Estimation calculators
export const calculateEstimateProportion = (inputs) => {
  const { alpha, p, d } = inputs
  if (!alpha || p == null || !d || p < 0 || p > 1 || d <= 0) {
    return { value: null, error: "Please provide valid inputs. Proportion must be between 0 and 1, and margin of error must be positive." }
  }
  const Z = getZScore(alpha, true)
  const q = 1 - p
  const n = (Math.pow(Z, 2) * p * q) / Math.pow(d, 2)
  return { value: Math.ceil(n), error: null }
}

export const calculateEstimateMean = (inputs) => {
  const { alpha, sd, d } = inputs
  if (!alpha || !sd || !d || sd <= 0 || d <= 0) {
    return { value: null, error: "Please provide valid inputs. Standard deviation and margin of error must be positive." }
  }
  const Z = getZScore(alpha, true)
  const n = (Math.pow(Z, 2) * Math.pow(sd, 2)) / Math.pow(d, 2)
  return { value: Math.ceil(n), error: null }
}

export const calculateEstimateDiff2Proportions = (inputs) => {
  const { alpha, p1, p2, d } = inputs
  if (!alpha || p1 == null || p2 == null || !d || p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1 || d <= 0) {
    return { value: null, error: "Please provide valid inputs. Proportions must be between 0 and 1." }
  }
  const Z = getZScore(alpha, true)
  const n = (Math.pow(Z, 2) * (p1 * (1 - p1) + p2 * (1 - p2))) / Math.pow(d, 2)
  return { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
}

export const calculateEstimateOddsRatio = (inputs) => {
  const { alpha, p2, or, epsilon } = inputs
  if (!alpha || p2 == null || !or || epsilon == null || p2 < 0 || p2 > 1 || or <= 0 || epsilon <= 0) {
    return { value: null, error: "Please provide valid inputs. Proportion must be between 0 and 1, OR must be positive." }
  }
  const p1 = (or * p2) / (1 - p2 + or * p2)
  if (p1 > 1) {
    return { value: null, error: "The calculated p1 exceeds 1. Please adjust your OR or p2 values." }
  }
  const Z = getZScore(alpha, true)
  const n = Math.pow(Z, 2) / Math.pow(Math.log(1 - epsilon), 2) * (1 / (p1 * (1 - p1)) + 1 / (p2 * (1 - p2)))
  return { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
}

export const calculateEstimateRelativeRisk = (inputs) => {
  const { alpha, p2, rr, epsilon } = inputs
  if (!alpha || p2 == null || !rr || epsilon == null || p2 < 0 || p2 > 1 || rr <= 0 || epsilon <= 0) {
    return { value: null, error: "Please provide valid inputs. Proportion must be between 0 and 1, RR must be positive." }
  }
  const p1 = p2 * rr
  if (p1 > 1) {
    return { value: null, error: "The calculated p1 exceeds 1. Please adjust your RR or p2 values." }
  }
  const Z = getZScore(alpha, true)
  const n = Math.pow(Z, 2) / Math.pow(Math.log(1 - epsilon), 2) * ((1 - p1) / p1 + (1 - p2) / p2)
  return { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
}

export const calculateEstimateCorrelation = (inputs) => {
  const { alpha, r } = inputs
  if (!alpha || r == null || r < -1 || r > 1 || r === 0) {
    return { value: null, error: "Please provide valid inputs. Correlation must be between -1 and 1 (and not 0)." }
  }
  const Z = getZScore(alpha, true)
  const fisherZ = 0.5 * Math.log((1 + r) / (1 - r))
  const n = 3 + Math.pow(Z / fisherZ, 2)
  return { value: Math.ceil(n), error: null }
}

// Post-hoc power analysis functions
export const calculatePostHocPowerTestProportion = (inputs) => {
  const { alpha, n, p0, pa, twoTailed = true } = inputs
  if (!alpha || !n || p0 == null || pa == null || p0 < 0 || p0 > 1 || pa < 0 || pa > 1 || p0 === pa || n <= 0) {
    return { value: null, error: "Please provide valid inputs." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const effectSize = Math.abs(p0 - pa)
  const se = Math.sqrt(p0 * (1 - p0) / n + pa * (1 - pa) / n)
  const z_critical = Z_alpha
  const z_observed = effectSize / se
  const z_beta = z_observed - z_critical
  // Convert to power using normal CDF approximation
  const power = Math.max(0, Math.min(0.99, 0.5 * (1 + Math.sign(z_beta) * (1 - Math.exp(-2 * z_beta * z_beta / Math.PI)))))
  return { value: Math.round(power * 100) / 100, error: null, power: power, powerPercent: Math.round(power * 100) }
}

export const calculatePostHocPowerTest2Proportions = (inputs) => {
  const { alpha, n, p1, p2, twoTailed = true } = inputs
  if (!alpha || !n || p1 == null || p2 == null || p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1 || p1 === p2 || n <= 0) {
    return { value: null, error: "Please provide valid inputs." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const effectSize = Math.abs(p1 - p2)
  const p_bar = (p1 + p2) / 2
  const se = Math.sqrt(p_bar * (1 - p_bar) * (2 / n))
  const z_critical = Z_alpha
  const z_observed = effectSize / se
  const z_beta = z_observed - z_critical
  const power = Math.max(0, Math.min(0.99, 0.5 * (1 + Math.sign(z_beta) * (1 - Math.exp(-2 * z_beta * z_beta / Math.PI)))))
  return { value: Math.round(power * 100) / 100, error: null, power: power, powerPercent: Math.round(power * 100) }
}

export const calculatePostHocPowerTest2Means = (inputs) => {
  const { alpha, n, mu1, mu2, sd1, sd2, twoTailed = true } = inputs
  if (!alpha || !n || mu1 == null || mu2 == null || !sd1 || !sd2 || sd1 <= 0 || sd2 <= 0 || mu1 === mu2 || n <= 0) {
    return { value: null, error: "Please provide valid inputs." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const effectSize = Math.abs(mu1 - mu2)
  const pooledSD = Math.sqrt((sd1 * sd1 + sd2 * sd2) / 2)
  const se = pooledSD * Math.sqrt(2 / n)
  const z_critical = Z_alpha
  const z_observed = effectSize / se
  const z_beta = z_observed - z_critical
  const power = Math.max(0, Math.min(0.99, 0.5 * (1 + Math.sign(z_beta) * (1 - Math.exp(-2 * z_beta * z_beta / Math.PI)))))
  return { value: Math.round(power * 100) / 100, error: null, power: power, powerPercent: Math.round(power * 100) }
}

// Hypothesis testing calculators with one/two-tailed support
export const calculateTestProportion = (inputs) => {
  const { alpha, beta, p0, pa, twoTailed = true } = inputs
  if (!alpha || !beta || p0 == null || pa == null || p0 < 0 || p0 > 1 || pa < 0 || pa > 1 || p0 === pa) {
    return { value: null, error: "Please provide valid inputs. Proportions must be between 0 and 1 and different from each other." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const Z_beta = getZBeta(beta)
  const numerator = Math.pow(Z_alpha * Math.sqrt(p0 * (1 - p0)) + Z_beta * Math.sqrt(pa * (1 - pa)), 2)
  const denominator = Math.pow(p0 - pa, 2)
  const n = numerator / denominator
  const baseResult = { value: Math.ceil(n), error: null }
  
  // Apply attrition adjustment if provided
  if (inputs.dropoutRate) {
    baseResult.valueAdjusted = adjustForAttrition(baseResult.value, inputs.dropoutRate)
    baseResult.dropoutRate = inputs.dropoutRate
  }
  
  return baseResult
}

export const calculateTest2Proportions = (inputs) => {
  const { alpha, beta, p1, p2, twoTailed = true, allocationRatio = 1, dropoutRate } = inputs
  if (!alpha || !beta || p1 == null || p2 == null || p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1 || p1 === p2) {
    return { value: null, error: "Please provide valid inputs. Proportions must be between 0 and 1 and different from each other." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const Z_beta = getZBeta(beta)
  const p_bar = (p1 + p2) / 2
  const numerator = Math.pow(Z_alpha * Math.sqrt(2 * p_bar * (1 - p_bar)) + Z_beta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
  const denominator = Math.pow(p1 - p2, 2)
  let n = numerator / denominator
  
  // Apply unequal allocation if specified
  if (allocationRatio !== 1) {
    const allocation = applyAllocationRatio(n, allocationRatio)
    const result = {
      value: allocation.n1,
      value2: allocation.n2,
      error: null,
      isMulti: true,
      label: 'Required Sample Size Per Group',
      label1: 'Group 1 (n₁)',
      label2: 'Group 2 (n₂)',
      total: allocation.total,
      allocationRatio: allocationRatio
    }
    
    // Apply attrition if provided
    if (dropoutRate) {
      result.valueAdjusted = adjustForAttrition(allocation.n1, dropoutRate)
      result.value2Adjusted = adjustForAttrition(allocation.n2, dropoutRate)
      result.totalAdjusted = result.valueAdjusted + result.value2Adjusted
      result.dropoutRate = dropoutRate
    }
    
    return result
  }
  
  const baseResult = { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
  
  // Apply attrition adjustment if provided
  if (dropoutRate) {
    baseResult.valueAdjusted = adjustForAttrition(baseResult.value, dropoutRate)
    baseResult.dropoutRate = dropoutRate
  }
  
  return baseResult
}

export const calculateTest2Means = (inputs) => {
  const { alpha, beta, mu1, mu2, sd1, sd2, twoTailed = true, allocationRatio = 1, dropoutRate } = inputs
  if (!alpha || !beta || mu1 == null || mu2 == null || !sd1 || !sd2 || sd1 <= 0 || sd2 <= 0 || mu1 === mu2) {
    return { value: null, error: "Please provide valid inputs. Standard deviations must be positive and means must be different." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const Z_beta = getZBeta(beta)
  let n = ((Math.pow(sd1, 2) + Math.pow(sd2, 2)) * Math.pow(Z_alpha + Z_beta, 2)) / Math.pow(mu1 - mu2, 2)
  
  // Apply unequal allocation if specified
  if (allocationRatio !== 1) {
    const allocation = applyAllocationRatio(n, allocationRatio)
    const result = {
      value: allocation.n1,
      value2: allocation.n2,
      error: null,
      isMulti: true,
      label: 'Required Sample Size Per Group',
      label1: 'Group 1 (n₁)',
      label2: 'Group 2 (n₂)',
      total: allocation.total,
      allocationRatio: allocationRatio
    }
    
    // Apply attrition if provided
    if (dropoutRate) {
      result.valueAdjusted = adjustForAttrition(allocation.n1, dropoutRate)
      result.value2Adjusted = adjustForAttrition(allocation.n2, dropoutRate)
      result.totalAdjusted = result.valueAdjusted + result.value2Adjusted
      result.dropoutRate = dropoutRate
    }
    
    return result
  }
  
  const baseResult = { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
  
  // Apply attrition adjustment if provided
  if (dropoutRate) {
    baseResult.valueAdjusted = adjustForAttrition(baseResult.value, dropoutRate)
    baseResult.dropoutRate = dropoutRate
  }
  
  return baseResult
}

export const calculateTest2Correlations = (inputs) => {
  const { alpha, beta, r1, r2, twoTailed = true, allocationRatio = 1, dropoutRate } = inputs
  if (!alpha || !beta || r1 == null || r2 == null || r1 < -1 || r1 > 1 || r2 < -1 || r2 > 1 || r1 === r2) {
    return { value: null, error: "Please provide valid inputs. Correlations must be between -1 and 1 and different from each other." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const Z_beta = getZBeta(beta)
  const Zr1 = 0.5 * Math.log((1 + r1) / (1 - r1))
  const Zr2 = 0.5 * Math.log((1 + r2) / (1 - r2))
  let n = Math.pow((Z_alpha + Z_beta) / (Zr1 - Zr2), 2) + 3
  
  // Apply unequal allocation if specified
  if (allocationRatio !== 1) {
    const allocation = applyAllocationRatio(n, allocationRatio)
    const result = {
      value: allocation.n1,
      value2: allocation.n2,
      error: null,
      isMulti: true,
      label: 'Required Sample Size Per Group',
      label1: 'Group 1 (n₁)',
      label2: 'Group 2 (n₂)',
      total: allocation.total,
      allocationRatio: allocationRatio
    }
    
    // Apply attrition if provided
    if (dropoutRate) {
      result.valueAdjusted = adjustForAttrition(allocation.n1, dropoutRate)
      result.value2Adjusted = adjustForAttrition(allocation.n2, dropoutRate)
      result.totalAdjusted = result.valueAdjusted + result.value2Adjusted
      result.dropoutRate = dropoutRate
    }
    
    return result
  }
  
  const baseResult = { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
  
  // Apply attrition adjustment if provided
  if (dropoutRate) {
    baseResult.valueAdjusted = adjustForAttrition(baseResult.value, dropoutRate)
    baseResult.dropoutRate = dropoutRate
  }
  
  return baseResult
}

export const calculateTest2Rates = (inputs) => {
  const { alpha, beta, lambda1, lambda2, k, twoTailed = true, dropoutRate } = inputs
  if (!alpha || !beta || !lambda1 || !lambda2 || !k || lambda1 <= 0 || lambda2 <= 0 || k <= 0 || lambda1 === lambda2) {
    return { value: null, error: "Please provide valid inputs. Rates and allocation ratio must be positive, and rates must be different." }
  }
  const Z_alpha = getZScore(alpha, twoTailed)
  const Z_beta = getZBeta(beta)
  const lambda_bar = (k * lambda1 + lambda2) / (k + 1)
  const numerator = Math.pow(Z_alpha * Math.sqrt((k + 1) / k * lambda_bar) + Z_beta * Math.sqrt(lambda1 + lambda2 / k), 2)
  const denominator = Math.pow(lambda1 - lambda2, 2)
  const E = numerator / denominator
  
  const result = { 
    value: Math.ceil(E), 
    value2: Math.ceil(k * E),
    error: null, 
    isMulti: true,
    label: 'Required Number of Events',
    label1: 'Events in Group 1',
    label2: 'Events in Group 2',
    note: 'These are the required number of events, not subjects'
  }
  
  // Apply attrition if provided (though less relevant for event-based calculations)
  if (dropoutRate) {
    result.valueAdjusted = adjustForAttrition(result.value, dropoutRate)
    result.value2Adjusted = adjustForAttrition(result.value2, dropoutRate)
    result.dropoutRate = dropoutRate
  }
  
  return result
}
