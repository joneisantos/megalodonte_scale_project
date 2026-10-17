import Dexie, { Table } from 'dexie';

export interface UserEntity {
  id: string;
  name: string;
  age: number;
  height: number;
  gender: 'male' | 'female';
}

export interface WeighingEntity {
  id: string;
  userId: string;
  timestamp: Date;
  weight: number;
  impedance: number;
  bodyFat: number;
  muscleMass: number;
  visceralFat: number;
  idealWeight: number;
  idealBodyFat: number;
}

class ScaleDatabase extends Dexie {
  users!: Table<UserEntity, string>;
  weighings!: Table<WeighingEntity, string>;

  constructor() {
    super('MegalodonteScaleDB');
    this.version(1).stores({
      users: 'id, name',
      weighings: 'id, userId, timestamp'
    });
  }
}

export const db = new ScaleDatabase();
