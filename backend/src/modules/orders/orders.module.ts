import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from './entities/order.entity';
import { BoutiquesModule } from '../boutiques/boutiques.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    BoutiquesModule,
    CatalogModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
