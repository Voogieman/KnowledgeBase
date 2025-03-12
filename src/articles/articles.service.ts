import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<Article> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const article = this.articlesRepository.create({
      ...createArticleDto,
      author: user,
    });
    return this.articlesRepository.save(article);
  }

  async findOne(
    id: number,
    userId?: string,
    userRole?: UserRole,
  ): Promise<Article> {
    const whereCondition: any = { id };

    if (!userId) {
      whereCondition.isPublic = true; // Только публичные статьи для неавторизованных
    } else if (userRole !== UserRole.ADMIN) {
      whereCondition.isPublic = true;

      // Проверяем, является ли пользователь автором статьи
      const userArticle = await this.articlesRepository.findOne({
        where: { id, author: { id: userId } },
        relations: ['author'],
        select: { author: { id: true, email: true } }, // Выбираем только нужные поля
      });
      if (userArticle) return userArticle;
    }

    const article = await this.articlesRepository.findOne({
      where: whereCondition,
      relations: ['author'],
      select: { author: { id: true, email: true } }, // Ограничение данных автора
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }
    return article;
  }

  async findAll(
    tags?: string[],
    userId?: string,
    userRole?: UserRole,
  ): Promise<Article[]> {
    const whereCondition: any = this.getFilterConditions(
      tags,
      userId,
      userRole,
    );

    return this.articlesRepository.find({
      where: whereCondition,
      relations: ['author'],
      select: {
        id: true,
        title: true,
        content: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        author: {
          id: true,
          email: true, // Выбираем только id и email автора
        },
      },
    });
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    user: User,
  ): Promise<void> {
    const article = await this.findOne(id, user.id, user.role);
    this.checkAccess(article, user, 'update');

    await this.articlesRepository.update(id, {
      ...updateArticleDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: number, user: User): Promise<void> {
    const article = await this.findOne(id, user.id, user.role);
    this.checkAccess(article, user, 'delete');

    await this.articlesRepository.remove(article);
  }

  /**
   * Проверяет права доступа к статье
   */
  private checkAccess(
    article: Article,
    user: User,
    action: 'update' | 'delete',
  ): void {
    if (user.role !== UserRole.ADMIN && article.author.id !== user.id) {
      throw new ForbiddenException(
        `Only the author or an admin can ${action} this article`,
      );
    }
  }

  /**
   * Возвращает условия фильтрации для запроса статей
   */
  private getFilterConditions(
    tags?: string[],
    userId?: string,
    userRole?: UserRole,
  ): any {
    if (userRole === UserRole.ADMIN) {
      return tags?.length ? { tags: In(tags) } : {}; // Админ видит все статьи
    }

    const whereCondition: any = { isPublic: true }; // По умолчанию только публичные статьи

    if (userId) {
      whereCondition.author = { id: userId }; // Обычный пользователь видит свои статьи + публичные
    }

    if (tags?.length) {
      whereCondition.tags = In(tags);
    }

    return whereCondition;
  }
}
