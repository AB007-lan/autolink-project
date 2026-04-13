import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = configService.get('UPLOAD_DIR') || './uploads';
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    const dirs = ['products', 'avatars', 'boutiques', 'documents'];
    dirs.forEach((dir) => {
      const fullPath = path.join(this.uploadDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:4000';
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
    const uploadPath = path.join(this.uploadDir, folder, filename);

    fs.writeFileSync(uploadPath, file.buffer);

    const url = `${baseUrl}/uploads/${folder}/${filename}`;
    this.logger.log(`File uploaded: ${url}`);

    return url;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:4000';
    const relativePath = fileUrl.replace(baseUrl, '');
    const fullPath = path.join('.', relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      this.logger.log(`File deleted: ${fullPath}`);
    }
  }
}
