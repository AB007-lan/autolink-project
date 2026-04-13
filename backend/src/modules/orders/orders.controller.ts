import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto, UpdateOrderStatusDto } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrderStatus } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Passer une commande' })
  create(
    @CurrentUser('id') clientId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(clientId, dto);
  }

  @Get('my')
  @ApiBearerAuth()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Mes commandes (client)' })
  findMyOrders(
    @CurrentUser('id') clientId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.ordersService.findClientOrders(clientId, +page, +limit);
  }

  @Get('boutique')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Commandes reçues par la boutique' })
  findBoutiqueOrders(
    @CurrentUser('id') ownerId: string,
    @Query('status') status?: OrderStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.ordersService.findBoutiqueOrders(ownerId, status, +page, +limit);
  }

  @Get('admin')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Toutes les commandes' })
  getAdminOrders(
    @Query('status') status?: OrderStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.ordersService.getAdminOrders(+page, +limit, status);
  }

  @Get('admin/stats')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Statistiques des commandes' })
  getStats() {
    return this.ordersService.getStats();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détail d\'une commande' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, userId, userRole, dto);
  }
}
