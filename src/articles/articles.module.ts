import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticlesService } from './articles.service';
import { UsersModule } from '../users/users.module';
import { ArticlesController } from './articles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UsersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
