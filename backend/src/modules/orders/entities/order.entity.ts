import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';
import { Boutique } from '../../boutiques/entities/boutique.entity';
import { Product } from '../../catalog/entities/product.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  READY = 'ready',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum DeliveryMethod {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export enum PaymentMethod {
  BANKILY = 'bankily',
  MASRVI = 'masrvi',
  SEDAD = 'sedad',
  CASH = 'cash',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
@Index(['clientId'])
@Index(['boutiqueId'])
@Index(['status'])
@Index(['orderNumber'], { unique: true })
export class Order extends BaseEntity {
  @Column({ name: 'order_number', length: 20 })
  orderNumber: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'boutique_id' })
  boutiqueId: string;

  @ManyToOne(() => Boutique)
  @JoinColumn({ name: 'boutique_id' })
  boutique: Boutique;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ name: 'subtotal', type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ name: 'commission', type: 'decimal', precision: 10, scale: 2, default: 0 })
  commission: number;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    name: 'delivery_method',
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.PICKUP,
  })
  deliveryMethod: DeliveryMethod;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'delivery_address', type: 'jsonb', nullable: true })
  deliveryAddress: {
    street?: string;
    quartier?: string;
    city?: string;
    phone?: string;
  };

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'cancellation_reason', nullable: true, type: 'text' })
  cancellationReason: string;

  @Column({ name: 'confirmed_at', nullable: true, type: 'timestamp' })
  confirmedAt: Date;

  @Column({ name: 'delivered_at', nullable: true, type: 'timestamp' })
  deliveredAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_name', length: 300 })
  productName: string;

  @Column({ name: 'product_price', type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 10, scale: 2 })
  lineTotal: number;
}
