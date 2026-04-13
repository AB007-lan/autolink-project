import {
  Entity,
  Column,
  Index,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  CLIENT = 'client',
  BOUTIQUE = 'boutique',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true, sparse: true })
export class User extends BaseEntity {
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({ name: 'last_login_at', nullable: true, type: 'timestamp' })
  lastLoginAt: Date;

  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ name: 'reset_password_token', nullable: true })
  @Exclude()
  resetPasswordToken: string;

  @Column({ name: 'reset_password_expires', nullable: true, type: 'timestamp' })
  resetPasswordExpires: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2b$')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
