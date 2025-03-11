import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT токен доступа (access token)' })
  @IsString()
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT refresh токен' })
  @IsString()
  refresh_token: string;
}
