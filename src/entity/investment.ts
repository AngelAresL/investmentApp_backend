import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

export enum InvestmentType {
  STOCK = "stock",
  CRYPTO = "crypto",
}

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @Column({
    type: "enum",
    enum: InvestmentType,
    default: InvestmentType.STOCK,
  })
  type!: InvestmentType;

  @Column("decimal")
  amount!: number;

  @Column()
  currency!: string;

  @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
  date!: Date;

  @ManyToOne(() => User, (user) => user.investments)
  user!: User;
}
