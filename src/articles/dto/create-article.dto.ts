import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  tags: string[];

  @IsBoolean()
  isPublic: boolean;
}
