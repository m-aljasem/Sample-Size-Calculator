// Statistical calculation utilities
export const getZScore = (alpha, twoTailed = true) => {
  if (alpha === 0.10 && twoTailed) return 1.645
  if (alpha === 0.05 && twoTailed) return 1.96
  if (alpha === 0.01 && twoTailed) return 2.576
  if (alpha === 0.05 && !twoTailed) return 1.645
  if (alpha === 0.20 && !twoTailed) return 0.84
  if (alpha === 0.10 && !twoTailed) return 1.28
  return 1.96
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

// Hypothesis testing calculators
export const calculateTestProportion = (inputs) => {
  const { alpha, beta, p0, pa } = inputs
  if (!alpha || !beta || p0 == null || pa == null || p0 < 0 || p0 > 1 || pa < 0 || pa > 1 || p0 === pa) {
    return { value: null, error: "Please provide valid inputs. Proportions must be between 0 and 1 and different from each other." }
  }
  const Z_alpha = getZScore(alpha, true)
  const Z_beta = getZScore(beta, false)
  const numerator = Math.pow(Z_alpha * Math.sqrt(p0 * (1 - p0)) + Z_beta * Math.sqrt(pa * (1 - pa)), 2)
  const denominator = Math.pow(p0 - pa, 2)
  const n = numerator / denominator
  return { value: Math.ceil(n), error: null }
}

export const calculateTest2Proportions = (inputs) => {
  const { alpha, beta, p1, p2 } = inputs
  if (!alpha || !beta || p1 == null || p2 == null || p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1 || p1 === p2) {
    return { value: null, error: "Please provide valid inputs. Proportions must be between 0 and 1 and different from each other." }
  }
  const Z_alpha = getZScore(alpha, true)
  const Z_beta = getZScore(beta, false)
  const p_bar = (p1 + p2) / 2
  const numerator = Math.pow(Z_alpha * Math.sqrt(2 * p_bar * (1 - p_bar)) + Z_beta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
  const denominator = Math.pow(p1 - p2, 2)
  const n = numerator / denominator
  return { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
}

export const calculateTest2Means = (inputs) => {
  const { alpha, beta, mu1, mu2, sd1, sd2 } = inputs
  if (!alpha || !beta || mu1 == null || mu2 == null || !sd1 || !sd2 || sd1 <= 0 || sd2 <= 0 || mu1 === mu2) {
    return { value: null, error: "Please provide valid inputs. Standard deviations must be positive and means must be different." }
  }
  const Z_alpha = getZScore(alpha, true)
  const Z_beta = getZScore(beta, false)
  const n = ((Math.pow(sd1, 2) + Math.pow(sd2, 2)) * Math.pow(Z_alpha + Z_beta, 2)) / Math.pow(mu1 - mu2, 2)
  return { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
}

export const calculateTest2Correlations = (inputs) => {
  const { alpha, beta, r1, r2 } = inputs
  if (!alpha || !beta || r1 == null || r2 == null || r1 < -1 || r1 > 1 || r2 < -1 || r2 > 1 || r1 === r2) {
    return { value: null, error: "Please provide valid inputs. Correlations must be between -1 and 1 and different from each other." }
  }
  const Z_alpha = getZScore(alpha, true)
  const Z_beta = getZScore(beta, false)
  const Zr1 = 0.5 * Math.log((1 + r1) / (1 - r1))
  const Zr2 = 0.5 * Math.log((1 + r2) / (1 - r2))
  const n = Math.pow((Z_alpha + Z_beta) / (Zr1 - Zr2), 2) + 3
  return { value: Math.ceil(n), error: null, label: 'Required Sample Size Per Group' }
}

export const calculateTest2Rates = (inputs) => {
  const { alpha, beta, lambda1, lambda2, k } = inputs
  if (!alpha || !beta || !lambda1 || !lambda2 || !k || lambda1 <= 0 || lambda2 <= 0 || k <= 0 || lambda1 === lambda2) {
    return { value: null, error: "Please provide valid inputs. Rates and allocation ratio must be positive, and rates must be different." }
  }
  const Z_alpha = getZScore(alpha, true)
  const Z_beta = getZScore(beta, false)
  const lambda_bar = (k * lambda1 + lambda2) / (k + 1)
  const numerator = Math.pow(Z_alpha * Math.sqrt((k + 1) / k * lambda_bar) + Z_beta * Math.sqrt(lambda1 + lambda2 / k), 2)
  const denominator = Math.pow(lambda1 - lambda2, 2)
  const E = numerator / denominator
  return { 
    value: Math.ceil(E), 
    value2: Math.ceil(k * E),
    error: null, 
    isMulti: true,
    label: 'Required Number of Events',
    label1: 'Events in Group 1',
    label2: 'Events in Group 2',
    note: 'These are the required number of events, not subjects'
  }
}
