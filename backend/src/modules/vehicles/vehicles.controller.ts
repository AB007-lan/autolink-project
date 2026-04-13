import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Public()
  @Get('brands')
  @ApiOperation({ summary: 'Liste de toutes les marques de véhicules' })
  getBrands() {
    return this.vehiclesService.getBrands();
  }

  @Public()
  @Get('models')
  @ApiOperation({ summary: 'Modèles pour une marque donnée' })
  @ApiQuery({ name: 'brand', required: true })
  getModels(@Query('brand') brand: string) {
    return this.vehiclesService.getModelsByBrand(brand);
  }

  @Public()
  @Get('years')
  @ApiOperation({ summary: 'Années disponibles' })
  getYears() {
    return this.vehiclesService.getYears();
  }

  @Public()
  @Get('fuel-types')
  @ApiOperation({ summary: 'Types de carburant' })
  getFuelTypes() {
    return this.vehiclesService.getFuelTypes();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Recherche de véhicules' })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'year', required: false })
  search(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('year') year?: number,
  ) {
    return this.vehiclesService.searchVehicles(brand, model, year);
  }
}
