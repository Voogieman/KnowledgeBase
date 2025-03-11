import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

console.log('ArticlesService загружен');


@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);
    return await this.articlesRepository.save(article);
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async findAll(tags?: string[], userId?: number): Promise<Article[]> {
    const whereCondition: any = {};

    if (!userId) {
      whereCondition.isPublic = true;
    }

    if (tags && tags.length > 0) {
      whereCondition.tags = In(tags);
    }

    return this.articlesRepository.find({ where: whereCondition });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<void> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);
    article.updatedAt = new Date();
    await this.articlesRepository.update(id, article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }
}
