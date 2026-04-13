import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/messaging',
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private messagingService: MessagingService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET') || 'autolink-secret-key',
      });

      this.connectedUsers.set(client.id, payload.sub);
      client.join(`user:${payload.sub}`);

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch (error) {
      this.logger.warn(`Connection rejected: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.join(`conversation:${conversationId}`);
    return { event: 'joined', conversationId };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    try {
      const message = await this.messagingService.sendMessage(userId, data);

      // Envoyer à tous dans la conversation
      this.server
        .to(`conversation:${message.conversationId}`)
        .emit('new_message', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      userId,
      conversationId: data.conversationId,
    });
  }

  notifyNewMessage(userId: string, message: any) {
    this.server.to(`user:${userId}`).emit('notification', {
      type: 'new_message',
      message,
    });
  }
}
