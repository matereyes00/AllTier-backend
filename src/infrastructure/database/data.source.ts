import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  // Use the Docker service name 'db' as the host, not 'localhost'
  host: process.env.DB_HOST || 'db', 
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development', // Be careful with this in production
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
