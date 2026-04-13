import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Product, Category, VehicleCompatibility } from './entities/product.entity';
import { BoutiquesModule } from '../boutiques/boutiques.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, VehicleCompatibility]),
    BoutiquesModule,
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService, TypeOrmModule],
})
export class CatalogModule {}
