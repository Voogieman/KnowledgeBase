import { join } from 'path';

export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'knowledge',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_DB || 'knowledge_db',
    entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
    synchronize: false,
  },
});
