import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Mohamed', description: 'Prénom' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Ould Ahmed', description: 'Nom de famille' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'user@example.mr', description: 'Email' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: '+22220000000', description: 'Téléphone' })
  @IsOptional()
  @IsString()
  @Matches(/^(\+222|222)?[0-9]{8}$/, { message: 'Numéro mauritanien invalide' })
  phone?: string;

  @ApiProperty({ example: 'Password123!', description: 'Mot de passe (min 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'Minimum 8 caractères' })
  @MaxLength(100)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.mr' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.mr' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    avatarUrl?: string;
  };

  @ApiProperty()
  expiresIn: number;
}
