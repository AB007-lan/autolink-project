import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import {
  CreateProductDto,
  UpdateProductDto,
  AddCompatibilityDto,
  ProductQueryDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Ajouter un produit' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.catalogService.createProduct(userId, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Rechercher des produits' })
  findAll(@Query() query: ProductQueryDto) {
    return this.catalogService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Produits mis en avant' })
  getFeatured() {
    return this.catalogService.getFeaturedProducts();
  }

  @Get('my')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Produits de ma boutique' })
  getMyProducts(
    @CurrentUser('id') userId: string,
    @Query() query: ProductQueryDto,
  ) {
    return this.catalogService.findMyProducts(userId, query);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Liste des catégories' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Public()
  @Get('vehicles/brands')
  @ApiOperation({ summary: 'Marques de véhicules disponibles' })
  getVehicleBrands() {
    return this.catalogService.getVehicleBrands();
  }

  @Public()
  @Get('vehicles/:brand/models')
  @ApiOperation({ summary: 'Modèles pour une marque donnée' })
  getVehicleModels(@Param('brand') brand: string) {
    return this.catalogService.getVehicleModels(brand);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un produit' })
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Modifier un produit' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.catalogService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Supprimer un produit' })
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.catalogService.delete(id, userId);
  }

  @Patch(':id/approve')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Approuver ou rejeter un produit' })
  approve(
    @Param('id') id: string,
    @Body('approve') approve: boolean,
  ) {
    return this.catalogService.approveProduct(id, approve);
  }

  @Post(':id/compatibility')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Ajouter une compatibilité véhicule' })
  addCompatibility(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddCompatibilityDto,
  ) {
    return this.catalogService.addCompatibility(id, userId, dto);
  }

  @Post('categories')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Créer une catégorie' })
  createCategory(@Body() data: any) {
    return this.catalogService.createCategory(data);
  }
}
