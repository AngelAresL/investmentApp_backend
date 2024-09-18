import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Investment } from "./investment";
import { InvestmentReport } from "./investmentReport";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Investment, (investment) => investment.user)
  investments?: Investment[]; 
  @OneToMany(() => InvestmentReport, (report) => report.user)
  investmentReports?: InvestmentReport[];

  
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  constructor() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.isActive = true;
    this.createdAt = new Date(); 
    this.updatedAt = new Date(); 
  }
}
