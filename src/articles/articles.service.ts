import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: string): Promise<Article> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const article = this.articlesRepository.create({ ...createArticleDto, author: user });
    return await this.articlesRepository.save(article);
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id }, relations: ['author'] });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async findAll(tags?: string[], userId?: string): Promise<Article[]> {
    const whereCondition: any = {};

    if (!userId) {
      whereCondition.isPublic = true;
    }

    if (tags && tags.length > 0) {
      whereCondition.tags = In(tags);
    }

    return this.articlesRepository.find({ where: whereCondition, relations: ['author'] });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, user: User): Promise<void> {
    const article = await this.findOne(id);

    if (user.role !== UserRole.ADMIN && article.author.id !== user.id) {
      throw new ForbiddenException('Only the author or an admin can update this article');
    }

    Object.assign(article, updateArticleDto);
    article.updatedAt = new Date();
    await this.articlesRepository.save(article);
  }

  async remove(id: number, user: User): Promise<void> {
    const article = await this.findOne(id);

    if (user.role !== UserRole.ADMIN && article.author.id !== user.id) {
      throw new ForbiddenException('Only the author or an admin can delete this article');
    }

    await this.articlesRepository.remove(article);
  }
}
