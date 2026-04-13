import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsBoolean,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCondition, ProductStatus } from '../entities/product.entity';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Filtre à huile Toyota Corolla' })
  @IsString()
  @MaxLength(300)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'TY-OF-001' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: '90915-YZZD4' })
  @IsOptional()
  @IsString()
  oemReference?: string;

  @ApiProperty({ example: 2500, description: 'Prix en MRU' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  priceNegotiable?: boolean;

  @ApiProperty({ example: 10, description: 'Quantité en stock' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ enum: ProductCondition, default: ProductCondition.NEW })
  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weightKg?: number;
}

export class UpdateProductDto extends CreateProductDto {}

export class AddCompatibilityDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  brand: string;

  @ApiPropertyOptional({ example: 'Corolla' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2018 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2030)
  yearStart?: number;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2030)
  yearEnd?: number;

  @ApiPropertyOptional({ example: '1.8L' })
  @IsOptional()
  @IsString()
  engine?: string;
}

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  boutiqueId?: string;

  @ApiPropertyOptional({ enum: ProductCondition })
  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ['price_asc', 'price_desc', 'newest', 'popular'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

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
