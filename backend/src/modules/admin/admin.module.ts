import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../auth/entities/user.entity';
import { Boutique } from '../boutiques/entities/boutique.entity';
import { Product } from '../catalog/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Boutique, Product, Order])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
