import 'reflect-metadata';
import { DataSource } from 'typeorm';
import app from './app';  // Importar la app de Express
import { User } from './entity/user';
import { Investment } from './entity/investment';
import { InvestmentReport } from './entity/investmentReport';

const port = process.env.PORT || 3001;

// Inicializar TypeORM
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mydb',
  synchronize: true,
  logging: true,
  entities: [User,Investment, InvestmentReport],
  subscribers: [],
  migrations: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL');

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.error('Error connecting to the database', error));