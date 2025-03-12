import { IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Заголовок статьи',
    example: 'Как использовать NestJS с Swagger',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Содержимое статьи',
    example: 'В этом руководстве мы рассмотрим, как интегрировать Swagger в NestJS...',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Список тегов статьи',
    example: ['nestjs', 'swagger', 'api'],
    type: [String],
  })
  @IsArray()
  tags: string[];

  @ApiProperty({
    description: 'Флаг публичности статьи',
    example: true,
  })
  @IsBoolean()
  isPublic: boolean;
}
