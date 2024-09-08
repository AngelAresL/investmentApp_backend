import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Investment } from "./investment";

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
  investments?: Investment[]; // Se marca como opcional

  constructor() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.isActive = true;
  }
}
