import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

// Definir el enum para los tipos de inversión
export enum InvestmentType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
}

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id!: number;  // El símbolo ! indica que TypeORM gestionará este campo, por lo que no es necesario inicializarlo en el constructor.

  @Column()
  name!: string;  // Agregar ! para indicar que se inicializa en algún momento, pero no necesariamente en el constructor.

  @Column()
  symbol!: string;

  @Column({
    type: 'enum',
    enum: InvestmentType,
    default: InvestmentType.STOCK,
  })
  type!: InvestmentType;

  @Column('decimal')
  amount!: number;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @ManyToOne(() => User, (user) => user.investments)
  user!: User;
}