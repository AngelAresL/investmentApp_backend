import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class InvestmentReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.investmentReports)
  user: User;

  @Column({ type: 'jsonb' })
  investmentsData: any; // Aquí guardamos la información completa de las inversiones

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Fecha en que se generó el reporte

  constructor() {
    this.id = 0;
    this.user = new User();
    this.investmentsData = {};
    this.createdAt = new Date();
  }
}