import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessagingService, SendMessageDto } from './messaging.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('messaging')
@Controller('messaging')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Mes conversations' })
  getConversations(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.messagingService.getConversations(userId, userRole);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Messages d\'une conversation' })
  getMessages(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.messagingService.getMessages(id, userId, +page, +limit);
  }

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Envoyer un message' })
  sendMessage(
    @CurrentUser('id') senderId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagingService.sendMessage(senderId, dto);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Nombre de messages non lus' })
  getUnreadCount(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.messagingService.getUnreadCount(userId, userRole);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer une conversation comme lue' })
  markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.messagingService.markAsRead(id, userId);
  }
}
