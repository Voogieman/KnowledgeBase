import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req: any): Promise<Article> {
    return this.articlesService.create(createArticleDto, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Get()
  async findAll(@Query('tags') tags: string[], @Request() req: any): Promise<Article[]> {
    const user = req.user;
    return this.articlesService.findAll(tags || [], user ? user.id : null);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto, @Request() req: any): Promise<void> {
    const user = req.user;
    return this.articlesService.update(id, updateArticleDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Request() req: any): Promise<void> {
    const user = req.user;
    return this.articlesService.remove(id, user);
  }
}
