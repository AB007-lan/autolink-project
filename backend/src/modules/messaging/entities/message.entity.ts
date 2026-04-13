import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('conversations')
@Index(['clientId', 'boutiqueId'])
export class Conversation extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'boutique_id' })
  boutiqueId: string;

  @Column({ name: 'related_product_id', nullable: true })
  relatedProductId: string;

  @Column({ name: 'related_order_id', nullable: true })
  relatedOrderId: string;

  @Column({ name: 'last_message_at', nullable: true, type: 'timestamp' })
  lastMessageAt: Date;

  @Column({ name: 'client_unread', default: 0 })
  clientUnread: number;

  @Column({ name: 'boutique_unread', default: 0 })
  boutiqueUnread: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Message, (msg) => msg.conversation)
  messages: Message[];
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

@Entity('messages')
@Index(['conversationId'])
@Index(['senderId'])
export class Message extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: string;

  @ManyToOne(() => Conversation, (conv) => conv.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({ name: 'attachment_url', nullable: true })
  attachmentUrl: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', nullable: true, type: 'timestamp' })
  readAt: Date;
}
