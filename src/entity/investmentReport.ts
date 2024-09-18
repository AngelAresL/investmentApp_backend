import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class InvestmentReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.investmentReports)
  user: User;

  @Column({ type: 'jsonb' })
  investmentsData: any; 

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; 

  constructor() {
    this.id = 0;
    this.user = new User();
    this.investmentsData = {};
    this.createdAt = new Date();
  }
}