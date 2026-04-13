import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Boutique } from '../../boutiques/entities/boutique.entity';

export enum ProductCondition {
  NEW = 'new',
  USED = 'used',
  RECONDITIONED = 'reconditioned',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  PENDING_REVIEW = 'pending_review',
  REJECTED = 'rejected',
}

@Entity('products')
@Index(['boutiqueId'])
@Index(['categoryId'])
@Index(['status'])
export class Product extends BaseEntity {
  @Column({ name: 'boutique_id' })
  boutiqueId: string;

  @ManyToOne(() => Boutique)
  @JoinColumn({ name: 'boutique_id' })
  boutique: Boutique;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ length: 300 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'reference', length: 100, nullable: true })
  reference: string;

  @Column({ name: 'oem_reference', length: 100, nullable: true })
  oemReference: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'price_negotiable', default: false })
  priceNegotiable: boolean;

  @Column({ default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ProductCondition,
    default: ProductCondition.NEW,
  })
  condition: ProductCondition;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING_REVIEW,
  })
  status: ProductStatus;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'sale_count', default: 0 })
  saleCount: number;

  @Column({ name: 'rating_average', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAverage: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ type: 'jsonb', nullable: true })
  specifications: Record<string, any>;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 8, scale: 3, nullable: true })
  weightKg: number;

  @OneToMany(() => VehicleCompatibility, (compat) => compat.product)
  compatibilities: VehicleCompatibility[];
}

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ length: 200, nullable: true })
  nameAr: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}

@Entity('vehicle_compatibilities')
export class VehicleCompatibility extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'brand', length: 100 })
  brand: string;

  @Column({ name: 'model', length: 100, nullable: true })
  model: string;

  @Column({ name: 'year_start', nullable: true })
  yearStart: number;

  @Column({ name: 'year_end', nullable: true })
  yearEnd: number;

  @Column({ name: 'engine', length: 100, nullable: true })
  engine: string;
}
