import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Nombre de la inversión, por ejemplo, el nombre del fondo o de la acción

  @Column()
    symbol: string; // Símbolo de la inversión, por ejemplo, el ticker de la acción

  @Column()
  type: string; // Tipo de inversión (acción, fondo, etc.)

  @Column('decimal')
  amount: number; // Monto invertido

  @Column()
  date: Date; // Fecha de la inversión

  @ManyToOne(() => User, (user) => user.investments)
  user: User; // Relación muchos-a-uno con el usuario

  constructor() {
    this.id = 0;
    this.name = '';
    this.symbol = '';
    this.type = '';
    this.amount = 0;
    this.date = new Date();
    this.user = new User();
  }
}