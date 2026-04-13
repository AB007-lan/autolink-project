import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, PaymentStatus, PaymentMethod } from '../orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';

export class InitiatePaymentDto {
  orderId: string;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private configService: ConfigService,
  ) {}

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId, clientId: userId },
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cette commande est déjà payée');
    }

    // Simuler l'initiation du paiement selon la méthode
    switch (dto.paymentMethod) {
      case PaymentMethod.BANKILY:
        return this.initiateBankilyPayment(order, dto.phoneNumber);
      case PaymentMethod.MASRVI:
        return this.initiateMasrviPayment(order, dto.phoneNumber);
      case PaymentMethod.SEDAD:
        return this.initiateSedadPayment(order, dto.phoneNumber);
      case PaymentMethod.CASH:
      case PaymentMethod.COD:
        return { success: true, message: 'Paiement en espèces confirmé', orderId: order.id };
      default:
        throw new BadRequestException('Méthode de paiement non supportée');
    }
  }

  private async initiateBankilyPayment(order: Order, phone: string) {
    // TODO: Intégration réelle avec l'API Bankily
    // const response = await axios.post('https://api.bankily.mr/payment', {...})

    return {
      success: true,
      provider: 'Bankily',
      transactionRef: `BNK-${Date.now()}`,
      amount: order.total,
      currency: 'MRU',
      phone,
      message: 'Composez le *140# et suivez les instructions pour confirmer le paiement',
      orderId: order.id,
    };
  }

  private async initiateMasrviPayment(order: Order, phone: string) {
    // TODO: Intégration réelle avec l'API Masrvi
    return {
      success: true,
      provider: 'Masrvi',
      transactionRef: `MSR-${Date.now()}`,
      amount: order.total,
      currency: 'MRU',
      phone,
      message: 'Vérifiez l\'application Masrvi pour confirmer le paiement',
      orderId: order.id,
    };
  }

  private async initiateSedadPayment(order: Order, phone: string) {
    // TODO: Intégration réelle avec l'API Sedad
    return {
      success: true,
      provider: 'Sedad',
      transactionRef: `SDD-${Date.now()}`,
      amount: order.total,
      currency: 'MRU',
      phone,
      message: 'Confirmez le paiement via l\'application Sedad',
      orderId: order.id,
    };
  }

  async confirmPayment(orderId: string, transactionRef: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    order.paymentStatus = PaymentStatus.PAID;
    return this.orderRepository.save(order);
  }

  async handleWebhook(provider: string, payload: any) {
    // TODO: Implémenter les webhooks de chaque provider de paiement
    const { orderId, transactionRef, status } = payload;

    if (status === 'SUCCESS' && orderId) {
      await this.confirmPayment(orderId, transactionRef);
    }

    return { received: true };
  }
}
