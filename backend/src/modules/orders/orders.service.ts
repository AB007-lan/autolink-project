import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from './entities/order.entity';
import { Product, ProductStatus } from '../catalog/entities/product.entity';
import { BoutiquesService } from '../boutiques/boutiques.service';

export class CreateOrderDto {
  boutiqueId: string;
  items: Array<{ productId: string; quantity: number }>;
  deliveryMethod?: string;
  paymentMethod?: string;
  deliveryAddress?: any;
  notes?: string;
}

export class UpdateOrderStatusDto {
  status: OrderStatus;
  cancellationReason?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private boutiquesService: BoutiquesService,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `AL-${timestamp}-${random}`;
  }

  async create(clientId: string, dto: CreateOrderDto): Promise<Order> {
    const boutique = await this.boutiquesService.findOne(dto.boutiqueId);

    if (!boutique.isVerified) {
      throw new BadRequestException('Cette boutique n\'est pas encore vérifiée');
    }

    // Valider et calculer les items
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId, boutiqueId: dto.boutiqueId },
      });

      if (!product) {
        throw new NotFoundException(`Produit ${item.productId} non trouvé dans cette boutique`);
      }

      if (product.status !== ProductStatus.ACTIVE) {
        throw new BadRequestException(`Le produit "${product.name}" n'est pas disponible`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour "${product.name}". Disponible: ${product.stock}`,
        );
      }

      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    const deliveryFee = dto.deliveryMethod === 'delivery' ? 500 : 0;
    const commission = subtotal * (Number(boutique.commissionRate) / 100);
    const total = subtotal + deliveryFee;

    // Créer la commande
    const order = this.orderRepository.create({
      orderNumber: this.generateOrderNumber(),
      clientId,
      boutiqueId: dto.boutiqueId,
      subtotal,
      deliveryFee,
      commission,
      total,
      deliveryMethod: dto.deliveryMethod as any,
      paymentMethod: dto.paymentMethod as any,
      deliveryAddress: dto.deliveryAddress,
      notes: dto.notes,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Créer les items
    for (const item of orderItems) {
      await this.orderItemRepository.save({
        ...item,
        orderId: savedOrder.id,
      });
    }

    // Mettre à jour le stock
    for (const item of dto.items) {
      await this.productRepository.decrement(
        { id: item.productId },
        'stock',
        item.quantity,
      );
    }

    return this.findOne(savedOrder.id);
  }

  async findClientOrders(clientId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.orderRepository.findAndCount({
      where: { clientId },
      relations: ['boutique', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBoutiqueOrders(ownerId: string, status?: OrderStatus, page = 1, limit = 20) {
    const boutique = await this.boutiquesService.findByOwner(ownerId);
    const skip = (page - 1) * limit;

    const where: any = { boutiqueId: boutique.id };
    if (status) where.status = status;

    const [items, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['client', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'boutique', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    return order;
  }

  async updateStatus(
    id: string,
    userId: string,
    userRole: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    // Vérifier les permissions
    if (userRole === 'client' && order.clientId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    if (userRole === 'boutique') {
      const boutique = await this.boutiquesService.findByOwner(userId);
      if (order.boutiqueId !== boutique.id) {
        throw new ForbiddenException('Accès refusé');
      }
    }

    // Valider la transition de statut
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.READY],
      [OrderStatus.READY]: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[order.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Transition de statut invalide: ${order.status} -> ${dto.status}`,
      );
    }

    order.status = dto.status;
    if (dto.cancellationReason) {
      order.cancellationReason = dto.cancellationReason;
    }
    if (dto.status === OrderStatus.CONFIRMED) {
      order.confirmedAt = new Date();
    }
    if (dto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    return this.orderRepository.save(order);
  }

  async getAdminOrders(page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['client', 'boutique'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getStats() {
    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({
      where: { status: OrderStatus.PENDING },
    });
    const deliveredOrders = await this.orderRepository.count({
      where: { status: OrderStatus.DELIVERED },
    });

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'revenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: Number(revenueResult?.revenue || 0),
    };
  }
}
