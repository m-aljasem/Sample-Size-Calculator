// Sensitivity analysis utilities
export const generateSensitivityRange = (
  calcFunction: (inputs: Record<string, number>) => any,
  baseInputs: Record<string, number>,
  paramName: string,
  min: number,
  max: number,
  steps: number = 10
) => {
  const results: Array<{
    paramValue: number;
    sampleSize?: number;
    value?: number;
    value1?: number;
    value2?: number;
    total?: number;
    sampleSizeAdjusted?: number;
  }> = [];
  const stepSize = (max - min) / steps;
  
  for (let i = 0; i <= steps; i++) {
    const paramValue = min + (i * stepSize);
    const testInputs = { ...baseInputs, [paramName]: paramValue };
    const result = calcFunction(testInputs);
    
    if (result && !result.error && result.value !== null) {
      results.push({
        paramValue: Math.round(paramValue * 1000) / 1000,
        sampleSize: result.value,
        ...(result.valueAdjusted && { sampleSizeAdjusted: result.valueAdjusted }),
        ...(result.isMulti && {
          value1: result.value,
          value2: result.value2,
          total: result.total || (result.value + (result.value2 || 0))
        })
      });
    }
  }
  
  return results;
};

export const generateMultipleParamRanges = (
  calcFunction: (inputs: Record<string, number>) => any,
  baseInputs: Record<string, number>,
  params: Array<{ name: string; label?: string; min: number; max: number; steps?: number }>
) => {
  const allResults: Array<{
    paramName: string;
    paramLabel?: string;
    results: Array<any>;
    minValue: number;
    maxValue: number;
  }> = [];
  
  params.forEach(param => {
    const paramResults = generateSensitivityRange(
      calcFunction,
      baseInputs,
      param.name,
      param.min,
      param.max,
      param.steps || 10
    );
    allResults.push({
      paramName: param.name,
      paramLabel: param.label || param.name,
      results: paramResults,
      minValue: param.min,
      maxValue: param.max
    });
  });
  
  return allResults;
};

export const findMinMaxSampleSize = (sensitivityResults: Array<{
  results: Array<{ total?: number; sampleSize?: number; value?: number }>;
}>) => {
  let minSampleSize = Infinity;
  let maxSampleSize = -Infinity;
  
  sensitivityResults.forEach(paramResult => {
    paramResult.results.forEach(result => {
      const sampleSize = result.total || result.sampleSize || result.value;
      if (sampleSize !== null && sampleSize !== undefined) {
        minSampleSize = Math.min(minSampleSize, sampleSize);
        maxSampleSize = Math.max(maxSampleSize, sampleSize);
      }
    });
  });
  
  return {
    min: minSampleSize === Infinity ? 0 : Math.ceil(minSampleSize),
    max: maxSampleSize === -Infinity ? 0 : Math.ceil(maxSampleSize),
    range: Math.ceil(maxSampleSize) - Math.ceil(minSampleSize)
  };
};

