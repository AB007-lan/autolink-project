import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoutiquesService } from './boutiques.service';
import {
  CreateBoutiqueDto,
  UpdateBoutiqueDto,
  BoutiqueQueryDto,
  VerifyBoutiqueDto,
} from './dto/boutique.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('boutiques')
@Controller('boutiques')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BoutiquesController {
  constructor(private readonly boutiquesService: BoutiquesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Créer sa boutique' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBoutiqueDto,
  ) {
    return this.boutiquesService.create(userId, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les boutiques vérifiées' })
  findAll(@Query() query: BoutiqueQueryDto) {
    return this.boutiquesService.findAll(query);
  }

  @Get('my')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Ma boutique' })
  findMy(@CurrentUser('id') userId: string) {
    return this.boutiquesService.findByOwner(userId);
  }

  @Get('my/stats')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Statistiques de ma boutique' })
  getMyStats(@CurrentUser('id') userId: string) {
    return this.boutiquesService.findByOwner(userId).then((b) =>
      this.boutiquesService.getStats(b.id),
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une boutique' })
  findOne(@Param('id') id: string) {
    return this.boutiquesService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(UserRole.BOUTIQUE)
  @ApiOperation({ summary: 'Mettre à jour sa boutique' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBoutiqueDto,
  ) {
    return this.boutiquesService.update(id, userId, dto);
  }

  @Patch(':id/verify')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Vérifier/rejeter une boutique' })
  verify(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: VerifyBoutiqueDto,
  ) {
    return this.boutiquesService.verify(id, adminId, dto);
  }
}
