import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sum: number;

  @Column()
  source: string;

  @Column()
  description: string;

  @Column()
  date: Date;
}
