import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration'; // Здесь загружаем конфигурацию
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';


console.log('config', configuration);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        console.log('Final TypeORM Config:', dbConfig);
        return dbConfig;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
  ],
})
export class AppModule {}
