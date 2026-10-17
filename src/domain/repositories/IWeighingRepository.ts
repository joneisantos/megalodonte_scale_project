import { WeighingEntity } from '../../infrastructure/persistence/AppDatabase';

export interface IWeighingRepository {
  save(record: WeighingEntity): Promise<void>;
  getByUser(userId: string): Promise<WeighingEntity[]>;
}
