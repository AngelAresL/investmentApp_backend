import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Nombre de la inversión

  @Column()
  symbol: string; // Símbolo de la inversión (ticker de la acción)

  @Column()
  type: string; // Tipo de inversión (acción, fondo, etc.)

  @Column('decimal')
  amount: number; // Monto invertido

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' }) // Fecha de la inversión por defecto
  date: Date;

  @ManyToOne(() => User, (user) => user.investments)
  user: User; // Relación con el usuario

  constructor() {
    this.id = 0;
    this.name = '';
    this.symbol = '';
    this.type = '';
    this.amount = 0;
    this.date = new Date(); // Generación automática
    this.user = new User();
  }
}