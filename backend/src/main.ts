import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    cors: true,
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  
  // CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Compression
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Exception filter global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Autolink API')
    .setDescription('Marketplace de pièces détachées automobiles - Mauritanie')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication et gestion des sessions')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('boutiques', 'Gestion des boutiques/vendeurs')
    .addTag('products', 'Catalogue de produits')
    .addTag('vehicles', 'Référentiel véhicules')
    .addTag('orders', 'Gestion des commandes')
    .addTag('payments', 'Traitement des paiements')
    .addTag('messaging', 'Messagerie temps réel')
    .addTag('notifications', 'Système de notifications')
    .addTag('reviews', 'Avis et notations')
    .addTag('admin', 'Administration backoffice')
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Health check endpoint
  app.getHttpAdapter().get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get('NODE_ENV'),
      version: '1.0.0',
    });
  });

  const port = configService.get('PORT') || 4000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚗  AUTOLINK API - MARKETPLACE PIÈCES AUTO              ║
║                                                           ║
║   🚀  API running on: http://localhost:${port}             ║
║   📚  API Docs: http://localhost:${port}/api/docs         ║
║   ❤️   Health: http://localhost:${port}/api/v1/health     ║
║                                                           ║
║   Environment: ${configService.get('NODE_ENV')}                                    ║
║   Database: PostgreSQL                                   ║
║   Cache: Redis                                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
