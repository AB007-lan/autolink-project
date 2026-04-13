import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { UserStatus } from '../auth/entities/user.entity';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Statistiques du tableau de bord admin' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Liste de tous les utilisateurs' })
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(+page, +limit, role, search);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un utilisateur' })
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('boutiques/pending')
  @ApiOperation({ summary: 'Boutiques en attente de vérification' })
  getPendingBoutiques() {
    return this.adminService.getPendingBoutiques();
  }

  @Get('products/pending')
  @ApiOperation({ summary: 'Produits en attente de modération' })
  getPendingProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getPendingProducts(+page, +limit);
  }

  @Get('revenue/monthly')
  @ApiOperation({ summary: 'Revenus mensuels' })
  getRevenueByMonth() {
    return this.adminService.getRevenueByMonth();
  }

  @Get('boutiques/top')
  @ApiOperation({ summary: 'Top boutiques par ventes' })
  getTopBoutiques(@Query('limit') limit = 10) {
    return this.adminService.getTopBoutiques(+limit);
  }

  @Get('boutiques')
  @ApiOperation({ summary: 'Liste toutes les boutiques' })
  getAllBoutiques(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllBoutiques(+page, +limit, status, search);
  }

  @Get('products')
  @ApiOperation({ summary: 'Liste tous les produits' })
  getAllProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllProducts(+page, +limit, status, search);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Liste toutes les commandes' })
  getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllOrders(+page, +limit, status, search);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Logs d\'audit' })
  getAuditLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.adminService.getAuditLogs(+page, +limit);
  }
}
