import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';

export enum BoutiqueStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum Quartier {
  TEVRAGH_ZEINA = 'Tevragh-Zeina',
  KSAR = 'Ksar',
  SEBKHA = 'Sebkha',
  EL_MINA = 'El Mina',
  ARAFAT = 'Arafat',
  TOUJOUNINE = 'Toujounine',
  DAR_NAIM = 'Dar Naim',
  RIYAD = 'Riyad',
  TEYARETT = 'Teyarett',
}

@Entity('boutiques')
@Index(['ownerId'], { unique: true })
export class Boutique extends BaseEntity {
  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: Quartier,
    nullable: true,
  })
  quartier: Quartier;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string;

  @Column({ name: 'trade_register', nullable: true, length: 100 })
  tradeRegister: string;

  @Column({ name: 'nif', nullable: true, length: 50 })
  nif: string;

  @Column({
    type: 'enum',
    enum: BoutiqueStatus,
    default: BoutiqueStatus.PENDING,
  })
  status: BoutiqueStatus;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'rating_average', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAverage: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ name: 'total_sales', default: 0 })
  totalSales: number;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 10 })
  commissionRate: number;

  @Column({ name: 'rejection_reason', nullable: true, type: 'text' })
  rejectionReason: string;

  @Column({ name: 'verified_at', nullable: true, type: 'timestamp' })
  verifiedAt: Date;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: string;

  @Column({ name: 'opens_at', nullable: true, length: 5 })
  opensAt: string;

  @Column({ name: 'closes_at', nullable: true, length: 5 })
  closesAt: string;

  @Column({ name: 'open_days', type: 'jsonb', nullable: true })
  openDays: string[];

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;
}
