import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthService } from '../auth/auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Создание новой статьи. Доступно только авторизованным пользователям',
  })
  @ApiResponse({
    status: 201,
    description: 'Статья успешно создана',
    type: Article,
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: any,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение статьи по идентификатору' })
  @ApiResponse({ status: 200, description: 'Статья найдена' })
  async findOne(
    @Param('id') id: number,
    @Headers('authorization') authHeader?: string,
  ): Promise<Article> {
    const token = authHeader || '';
    const { userId, role } = await this.authService.decodeToken(token);
    return this.articlesService.findOne(id, userId, role);
  }

  @Get()
  @ApiOperation({
    summary: 'Получение списка статей с опциональной фильтрацией по тегам',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Массив тегов для фильтрации статей. Если параметр не указан, возвращаются все статьи (только если пользователь — админ)',
    type: [String],
  })
  @ApiResponse({ status: 200, description: 'Список статей' })
  async findAll(
    @Query('tags') tags: string[],
    @Headers('authorization') authHeader?: string,
  ): Promise<Article[]> {
    const token = authHeader || '';
    const { userId, role } = await this.authService.decodeToken(token);
    return this.articlesService.findAll(tags || [], userId, role);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновление статьи. Доступно только автору или администратору',
  })
  @ApiResponse({ status: 200, description: 'Статья успешно обновлена' })
  async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ): Promise<void> {
    return this.articlesService.update(id, updateArticleDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удаление статьи. Доступно только автору или администратору',
  })
  @ApiResponse({ status: 200, description: 'Статья успешно удалена' })
  async remove(@Param('id') id: number, @Request() req: any): Promise<void> {
    return this.articlesService.remove(id, req.user);
  }
}
