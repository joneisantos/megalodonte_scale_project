import { IWeighingRepository } from '../../domain/repositories/IWeighingRepository';
import { BodyMetrics } from '../../domain/value-objects/Metrics';
import { WeighingEntity } from '../../infrastructure/persistence/AppDatabase';

export class RegisterWeighingUseCase {
  constructor(private weighingRepository: IWeighingRepository) {}

  async execute(userId: string, rawWeight: number, impedance: number, height: number, gender: 'male' | 'female', age: number): Promise<WeighingEntity> {
    const timestamp = new Date();
    const metrics = BodyMetrics.calculateIdeal(height, gender, age, rawWeight, impedance);

    const record: WeighingEntity = {
      id: crypto.randomUUID(),
      userId,
      timestamp,
      weight: metrics.weight.real,
      impedance,
      bodyFat: metrics.bodyFat.real,
      muscleMass: metrics.muscleMass.real,
      visceralFat: metrics.visceralFat.real,
      idealWeight: metrics.weight.ideal,
      idealBodyFat: metrics.bodyFat.ideal
    };

    await this.weighingRepository.save(record);
    return record;
  }
}
