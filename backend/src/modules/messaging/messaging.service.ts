import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, Message, MessageType } from './entities/message.entity';
import { BoutiquesService } from '../boutiques/boutiques.service';

export class SendMessageDto {
  conversationId?: string;
  boutiqueId?: string;
  content: string;
  type?: MessageType;
  attachmentUrl?: string;
  relatedProductId?: string;
}

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private boutiquesService: BoutiquesService,
  ) {}

  async getOrCreateConversation(
    clientId: string,
    boutiqueId: string,
    relatedProductId?: string,
  ): Promise<Conversation> {
    let conversation = await this.conversationRepository.findOne({
      where: { clientId, boutiqueId },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        clientId,
        boutiqueId,
        relatedProductId,
        isActive: true,
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    return conversation;
  }

  async getConversations(userId: string, userRole: string) {
    const qb = this.conversationRepository
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.client', 'client')
      .leftJoinAndSelect('conv.messages', 'lastMsg')
      .orderBy('conv.lastMessageAt', 'DESC');

    if (userRole === 'client') {
      qb.where('conv.client_id = :userId', { userId });
    } else if (userRole === 'boutique') {
      const boutique = await this.boutiquesService.findByOwner(userId);
      qb.where('conv.boutique_id = :boutiqueId', { boutiqueId: boutique.id });
    }

    return qb.getMany();
  }

  async getMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 50,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation non trouvée');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    // Marquer les messages comme lus
    await this.markAsRead(conversationId, userId);

    return {
      items: messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async sendMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    let conversationId = dto.conversationId;

    if (!conversationId && dto.boutiqueId) {
      const conversation = await this.getOrCreateConversation(
        senderId,
        dto.boutiqueId,
        dto.relatedProductId,
      );
      conversationId = conversation.id;
    }

    if (!conversationId) {
      throw new NotFoundException('Conversation ou boutique requise');
    }

    const message = this.messageRepository.create({
      conversationId,
      senderId,
      content: dto.content,
      type: dto.type || MessageType.TEXT,
      attachmentUrl: dto.attachmentUrl,
    });

    const saved = await this.messageRepository.save(message);

    // Mettre à jour la conversation
    const conv = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (conv) {
      conv.lastMessageAt = new Date();
      if (senderId === conv.clientId) {
        conv.boutiqueUnread += 1;
      } else {
        conv.clientUnread += 1;
      }
      await this.conversationRepository.save(conv);
    }

    return this.messageRepository.findOne({
      where: { id: saved.id },
      relations: ['sender'],
    });
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conv = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conv) return;

    if (userId === conv.clientId) {
      conv.clientUnread = 0;
    } else {
      conv.boutiqueUnread = 0;
    }

    await this.conversationRepository.save(conv);

    await this.messageRepository.update(
      { conversationId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string, userRole: string): Promise<number> {
    const qb = this.conversationRepository.createQueryBuilder('conv');

    if (userRole === 'client') {
      qb.where('conv.client_id = :userId AND conv.client_unread > 0', { userId });
    } else if (userRole === 'boutique') {
      const boutique = await this.boutiquesService.findByOwner(userId);
      qb.where(
        'conv.boutique_id = :boutiqueId AND conv.boutique_unread > 0',
        { boutiqueId: boutique.id },
      );
    }

    const result = await qb
      .select('SUM(conv.client_unread + conv.boutique_unread)', 'total')
      .getRawOne();

    return Number(result?.total || 0);
  }
}
