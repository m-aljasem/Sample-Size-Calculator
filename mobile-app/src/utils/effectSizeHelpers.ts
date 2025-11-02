// Effect size conversion helpers
export const convertTStatToEffectSize = (t: number, n1: number, n2: number): number => {
  const pooledN = (n1 + n2) / 2;
  return t * Math.sqrt(2 / pooledN);
};

export const convertFStatToEffectSize = (f: number, df1: number, df2: number): number => {
  return Math.sqrt((f * df1) / ((f * df1) + df2));
};

export const convertChiSqToEffectSize = (chiSq: number, n: number, df: number = 1): number => {
  return Math.sqrt(chiSq / (n * (df - 1)));
};

export const convertPValueToEffectSize = (
  p: number,
  n1: number,
  n2: number,
  twoTailed: boolean = true
): number => {
  const pAdjusted = twoTailed ? p / 2 : p;
  const z = Math.sqrt(-2 * Math.log(pAdjusted));
  const pooledN = (n1 + n2) / 2;
  return z * Math.sqrt(2 / pooledN);
};

export const effectSizeBenchmarks: Record<string, {
  cohensD: { small: number; medium: number; large: number };
  correlation?: { small: number; medium: number; large: number };
}> = {
  default: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    correlation: { small: 0.1, medium: 0.3, large: 0.5 }
  },
  psychology: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    correlation: { small: 0.1, medium: 0.3, large: 0.5 }
  },
  medicine: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    correlation: { small: 0.1, medium: 0.3, large: 0.5 }
  },
  education: {
    cohensD: { small: 0.2, medium: 0.5, large: 0.8 },
    correlation: { small: 0.1, medium: 0.3, large: 0.5 }
  }
};

export const getEffectSizeInterpretation = (
  effectSize: number,
  type: 'cohensD' | 'correlation' = 'cohensD',
  field: string = 'default'
): string => {
  const benchmarks = effectSizeBenchmarks[field] || effectSizeBenchmarks.default;
  const benchmark = benchmarks[type] || benchmarks.cohensD;
  
  const absEffect = Math.abs(effectSize);
  
  if (absEffect < benchmark.small) return 'Negligible';
  if (absEffect < benchmark.medium) return 'Small';
  if (absEffect < benchmark.large) return 'Medium';
  return 'Large';
};

