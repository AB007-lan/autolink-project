import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../auth/entities/user.entity';
import { Boutique, BoutiqueStatus } from '../boutiques/entities/boutique.entity';
import { Product, ProductStatus } from '../catalog/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Boutique)
    private boutiqueRepository: Repository<Boutique>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalBoutiques,
      pendingBoutiques,
      totalProducts,
      pendingProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
    ] = await Promise.all([
      this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
      this.boutiqueRepository.count(),
      this.boutiqueRepository.count({ where: { status: BoutiqueStatus.PENDING } }),
      this.productRepository.count(),
      this.productRepository.count({ where: { status: ProductStatus.PENDING_REVIEW } }),
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
    ]);

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.commission)', 'totalCommissions')
      .addSelect('SUM(order.total)', 'totalRevenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    // Évolution mensuelle (30 derniers jours)
    const monthlyOrders = await this.orderRepository
      .createQueryBuilder('order')
      .select("DATE_TRUNC('day', order.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(order.total)', 'revenue')
      .where("order.created_at >= NOW() - INTERVAL '30 days'")
      .groupBy("DATE_TRUNC('day', order.created_at)")
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      users: {
        total: totalUsers,
      },
      boutiques: {
        total: totalBoutiques,
        pending: pendingBoutiques,
        verified: await this.boutiqueRepository.count({
          where: { status: BoutiqueStatus.VERIFIED },
        }),
      },
      products: {
        total: totalProducts,
        pending: pendingProducts,
        active: await this.productRepository.count({
          where: { status: ProductStatus.ACTIVE },
        }),
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        totalRevenue: Number(revenueResult?.totalRevenue || 0),
        totalCommissions: Number(revenueResult?.totalCommissions || 0),
      },
      monthlyOrders,
    };
  }

  async getUsers(page = 1, limit = 20, role?: string, search?: string) {
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.deleted_at IS NULL');

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (search) {
      qb.andWhere(
        '(user.email ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('user.created_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    await this.userRepository.update(userId, { status });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getPendingBoutiques() {
    return this.boutiqueRepository.find({
      where: { status: BoutiqueStatus.PENDING },
      relations: ['owner'],
      order: { createdAt: 'ASC' },
    });
  }

  async getPendingProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.productRepository.findAndCount({
      where: { status: ProductStatus.PENDING_REVIEW },
      relations: ['boutique', 'boutique.owner'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getRevenueByMonth() {
    return this.orderRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(order.created_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'orders')
      .addSelect('SUM(order.total)', 'revenue')
      .addSelect('SUM(order.commission)', 'commissions')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere("order.created_at >= NOW() - INTERVAL '12 months'")
      .groupBy("TO_CHAR(order.created_at, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTopBoutiques(limit = 10) {
    return this.boutiqueRepository.find({
      where: { status: BoutiqueStatus.VERIFIED },
      order: { totalSales: 'DESC' },
      take: limit,
      relations: ['owner'],
    });
  }

  async getAuditLogs(page = 1, limit = 50) {
    // Placeholder - à implémenter avec une vraie table d'audit
    return { items: [], total: 0, page, limit };
  }
}
