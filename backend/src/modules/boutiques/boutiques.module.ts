import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoutiquesController } from './boutiques.controller';
import { BoutiquesService } from './boutiques.service';
import { Boutique } from './entities/boutique.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boutique])],
  controllers: [BoutiquesController],
  providers: [BoutiquesService],
  exports: [BoutiquesService, TypeOrmModule],
})
export class BoutiquesModule {}
