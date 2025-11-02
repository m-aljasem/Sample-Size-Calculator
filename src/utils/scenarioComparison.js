// Scenario comparison utilities
export const createScenario = (name, inputs, calculatorKey) => {
  return {
    id: Date.now() + Math.random(),
    name,
    inputs,
    calculatorKey,
    timestamp: new Date().toISOString()
  }
}

export const compareScenarios = (scenarios, calcFunctions) => {
  const comparisons = scenarios.map(scenario => {
    const calcFunction = calcFunctions[scenario.calculatorKey]
    if (!calcFunction) {
      return {
        scenario,
        result: null,
        summary: {
          sampleSize: null,
          sampleSizeAdjusted: null,
          total: null,
          error: 'Calculator function not found'
        }
      }
    }
    
    const result = calcFunction(scenario.inputs)
    
    return {
      scenario,
      result,
      summary: {
        sampleSize: result?.value || null,
        sampleSizeAdjusted: result?.valueAdjusted || null,
        total: result?.total || (result?.value && result?.value2 ? result.value + result.value2 : result?.value) || null,
        error: result?.error || null
      }
    }
  })
  
  return comparisons
}

export const exportScenarioComparison = (comparisons, format = 'csv') => {
  if (format === 'csv') {
    const headers = ['Scenario', 'Calculator', 'Sample Size', 'Adjusted Sample Size', 'Total', 'Error']
    const rows = comparisons.map(comp => [
      comp.scenario.name,
      comp.scenario.calculatorKey,
      comp.summary.sampleSize || 'N/A',
      comp.summary.sampleSizeAdjusted || 'N/A',
      comp.summary.total || 'N/A',
      comp.summary.error || 'None'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
  
  return JSON.stringify(comparisons, null, 2)
}
