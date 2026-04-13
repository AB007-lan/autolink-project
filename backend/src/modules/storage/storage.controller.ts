import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { memoryStorage } from 'multer';

@ApiTags('storage')
@Controller('storage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload un fichier' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Type de fichier non autorisé'), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const url = await this.storageService.uploadFile(file, folder);
    return { url, originalname: file.originalname, size: file.size };
  }
}
