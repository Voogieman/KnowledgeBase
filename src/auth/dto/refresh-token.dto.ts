import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
