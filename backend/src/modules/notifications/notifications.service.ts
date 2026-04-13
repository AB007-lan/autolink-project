import { Injectable, Logger } from '@nestjs/common';

export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_READY = 'order_ready',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  NEW_MESSAGE = 'new_message',
  BOUTIQUE_VERIFIED = 'boutique_verified',
  BOUTIQUE_REJECTED = 'boutique_rejected',
  PRODUCT_APPROVED = 'product_approved',
  PRODUCT_REJECTED = 'product_rejected',
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendNotification(userId: string, type: NotificationType, data: any) {
    this.logger.log(`Notification [${type}] -> User ${userId}: ${JSON.stringify(data)}`);
    // TODO: Implémenter l'envoi réel (push notification, email, SMS)
    return { sent: true, userId, type, data };
  }

  async sendSMS(phone: string, message: string) {
    this.logger.log(`SMS -> ${phone}: ${message}`);
    // TODO: Intégration Twilio ou provider SMS local
    return { sent: true };
  }

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`Email -> ${to}: ${subject}`);
    // TODO: Intégration nodemailer
    return { sent: true };
  }

  async notifyOrderCreated(order: any) {
    // Notifier la boutique
    await this.sendNotification(order.boutique?.ownerId, NotificationType.ORDER_CREATED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  }

  async notifyOrderStatusChange(order: any) {
    await this.sendNotification(order.clientId, NotificationType.ORDER_CONFIRMED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
    });
  }
}
