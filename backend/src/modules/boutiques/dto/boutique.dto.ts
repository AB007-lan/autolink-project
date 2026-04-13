import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoutiqueStatus, Quartier } from '../entities/boutique.entity';
import { Type } from 'class-transformer';

export class CreateBoutiqueDto {
  @ApiProperty({ example: 'Pièces Autos Sahara' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: Quartier })
  @IsOptional()
  @IsEnum(Quartier)
  quartier?: Quartier;

  @ApiPropertyOptional({ example: '+22220000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tradeRegister?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nif?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  opensAt?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @IsString()
  closesAt?: string;

  @ApiPropertyOptional({ example: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] })
  @IsOptional()
  @IsArray()
  openDays?: string[];
}

export class UpdateBoutiqueDto extends CreateBoutiqueDto {}

export class BoutiqueQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: Quartier })
  @IsOptional()
  @IsEnum(Quartier)
  quartier?: Quartier;

  @ApiPropertyOptional({ enum: BoutiqueStatus })
  @IsOptional()
  @IsEnum(BoutiqueStatus)
  status?: BoutiqueStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class VerifyBoutiqueDto {
  @ApiProperty({ enum: BoutiqueStatus })
  @IsEnum(BoutiqueStatus)
  status: BoutiqueStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
