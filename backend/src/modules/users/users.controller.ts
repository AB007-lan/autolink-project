import { Controller, Get, Put, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService, UpdateProfileDto } from './users.service';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Mon profil' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Put('avatar')
  @ApiOperation({ summary: 'Mettre à jour mon avatar' })
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async updateAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = await this.storageService.uploadFile(file, 'avatars');
    return this.usersService.updateAvatar(userId, avatarUrl);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Mes produits favoris' })
  getFavorites(@CurrentUser('id') userId: string) {
    return this.usersService.getFavorites(userId);
  }
}
