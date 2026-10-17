import { IWeighingRepository } from '../../domain/repositories/IWeighingRepository';
import { db, WeighingEntity } from './AppDatabase';

export class IndexedDBWeighingRepository implements IWeighingRepository {
  async save(record: WeighingEntity): Promise<void> {
    await db.weighings.add(record);
  }

  async getByUser(userId: string): Promise<WeighingEntity[]> {
    return await db.weighings
      .where('userId')
      .equals(userId)
      .sortBy('timestamp');
  }
}
