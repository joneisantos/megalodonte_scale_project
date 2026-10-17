export interface MetricData {
  real: number;
  ideal: number;
}

export class BodyMetrics {
  constructor(
    public readonly weight: MetricData,
    public readonly bodyFat: MetricData,
    public readonly muscleMass: MetricData,
    public readonly visceralFat: MetricData
  ) {}

  static calculateIdeal(height: number, gender: string, age: number, realWeight: number, impedance: number): BodyMetrics {
    const idealWeightValue = 22 * (height * height); 
    const idealFatValue = gender === 'male' ? 15 : 22;
    const idealMuscleValue = gender === 'male' ? 42 : 35;
    
    // Estimativa básica baseada em impedância e dados antropométricos para demonstração DDD
    const estimatedFat = Number((Math.max(5, (realWeight * 0.15) + (impedance * 0.02) - (age * 0.05))).toFixed(1));
    const estimatedMuscle = Number((realWeight * (gender === 'male' ? 0.45 : 0.38)).toFixed(1));

    return {
      weight: { real: realWeight, ideal: Number(idealWeightValue.toFixed(1)) },
      bodyFat: { real: estimatedFat, ideal: idealFatValue },
      muscleMass: { real: estimatedMuscle, ideal: idealMuscleValue },
      visceralFat: { real: 7, ideal: 5 }
    };
  }
}
