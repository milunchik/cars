import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'; //decorators

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
