export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly age: number,
    public readonly height: number, // em metros (ex: 1.75)
    public readonly gender: 'male' | 'female'
  ) {}
}
