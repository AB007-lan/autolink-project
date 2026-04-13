import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Boutique, BoutiqueStatus } from './entities/boutique.entity';
import {
  CreateBoutiqueDto,
  UpdateBoutiqueDto,
  BoutiqueQueryDto,
  VerifyBoutiqueDto,
} from './dto/boutique.dto';

@Injectable()
export class BoutiquesService {
  constructor(
    @InjectRepository(Boutique)
    private boutiqueRepository: Repository<Boutique>,
  ) {}

  async create(ownerId: string, dto: CreateBoutiqueDto): Promise<Boutique> {
    const existing = await this.boutiqueRepository.findOne({
      where: { ownerId },
    });

    if (existing) {
      throw new ConflictException('Vous avez déjà une boutique');
    }

    const boutique = this.boutiqueRepository.create({
      ...dto,
      ownerId,
      status: BoutiqueStatus.PENDING,
    });

    return this.boutiqueRepository.save(boutique);
  }

  async findAll(query: BoutiqueQueryDto) {
    const { search, quartier, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Boutique> = {};

    if (status) where.status = status;
    else where.status = BoutiqueStatus.VERIFIED;

    if (quartier) where.quartier = quartier;

    const queryBuilder = this.boutiqueRepository
      .createQueryBuilder('boutique')
      .leftJoinAndSelect('boutique.owner', 'owner')
      .where('boutique.deleted_at IS NULL');

    if (status) {
      queryBuilder.andWhere('boutique.status = :status', { status });
    } else {
      queryBuilder.andWhere('boutique.status = :status', {
        status: BoutiqueStatus.VERIFIED,
      });
    }

    if (quartier) {
      queryBuilder.andWhere('boutique.quartier = :quartier', { quartier });
    }

    if (search) {
      queryBuilder.andWhere(
        '(boutique.name ILIKE :search OR boutique.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('boutique.rating_average', 'DESC')
      .addOrderBy('boutique.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Boutique> {
    const boutique = await this.boutiqueRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!boutique) {
      throw new NotFoundException('Boutique non trouvée');
    }

    return boutique;
  }

  async findByOwner(ownerId: string): Promise<Boutique> {
    const boutique = await this.boutiqueRepository.findOne({
      where: { ownerId },
      relations: ['owner'],
    });

    if (!boutique) {
      throw new NotFoundException('Vous n\'avez pas encore de boutique');
    }

    return boutique;
  }

  async update(
    id: string,
    ownerId: string,
    dto: UpdateBoutiqueDto,
  ): Promise<Boutique> {
    const boutique = await this.findOne(id);

    if (boutique.ownerId !== ownerId) {
      throw new ForbiddenException('Vous n\'êtes pas propriétaire de cette boutique');
    }

    Object.assign(boutique, dto);
    return this.boutiqueRepository.save(boutique);
  }

  async verify(
    id: string,
    adminId: string,
    dto: VerifyBoutiqueDto,
  ): Promise<Boutique> {
    const boutique = await this.findOne(id);

    boutique.status = dto.status;
    boutique.isVerified = dto.status === BoutiqueStatus.VERIFIED;
    boutique.rejectionReason = dto.rejectionReason || null;
    boutique.verifiedBy = adminId;

    if (dto.status === BoutiqueStatus.VERIFIED) {
      boutique.verifiedAt = new Date();
    }

    return this.boutiqueRepository.save(boutique);
  }

  async updateStats(
    id: string,
    stats: { ratingAverage?: number; ratingCount?: number; totalSales?: number },
  ): Promise<void> {
    await this.boutiqueRepository.update(id, stats);
  }

  async getStats(boutiqueId: string) {
    const boutique = await this.findOne(boutiqueId);
    return {
      totalSales: boutique.totalSales,
      ratingAverage: boutique.ratingAverage,
      ratingCount: boutique.ratingCount,
      status: boutique.status,
      isVerified: boutique.isVerified,
    };
  }
}
