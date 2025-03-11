import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'knowledge',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_DB || 'knowledge_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  migrationsRun: false,
  logging: true,
});
