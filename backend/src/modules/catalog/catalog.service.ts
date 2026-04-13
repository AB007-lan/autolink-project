import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Product,
  Category,
  VehicleCompatibility,
  ProductStatus,
} from './entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  AddCompatibilityDto,
  ProductQueryDto,
} from './dto/product.dto';
import { BoutiquesService } from '../boutiques/boutiques.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(VehicleCompatibility)
    private compatibilityRepository: Repository<VehicleCompatibility>,
    private boutiquesService: BoutiquesService,
  ) {}

  async createProduct(ownerId: string, dto: CreateProductDto): Promise<Product> {
    const boutique = await this.boutiquesService.findByOwner(ownerId);

    const product = this.productRepository.create({
      ...dto,
      boutiqueId: boutique.id,
      status: ProductStatus.PENDING_REVIEW,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: ProductQueryDto) {
    const {
      search,
      categoryId,
      boutiqueId,
      condition,
      brand,
      model,
      year,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.boutique', 'boutique')
      .leftJoinAndSelect('product.compatibilities', 'compat')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.stock > 0')
      .andWhere('product.deleted_at IS NULL');

    if (categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId });
    }

    if (boutiqueId) {
      qb.andWhere('product.boutique_id = :boutiqueId', { boutiqueId });
    }

    if (condition) {
      qb.andWhere('product.condition = :condition', { condition });
    }

    if (search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.reference ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (brand) {
      qb.andWhere('compat.brand ILIKE :brand', { brand: `%${brand}%` });
    }

    if (model) {
      qb.andWhere('compat.model ILIKE :model', { model: `%${model}%` });
    }

    if (year) {
      qb.andWhere(
        '(compat.year_start <= :year AND compat.year_end >= :year)',
        { year },
      );
    }

    // Tri
    switch (sortBy) {
      case 'price_asc':
        qb.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('product.price', 'DESC');
        break;
      case 'popular':
        qb.orderBy('product.sale_count', 'DESC');
        break;
      default:
        qb.orderBy('product.created_at', 'DESC');
    }

    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['boutique', 'boutique.owner', 'compatibilities'],
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // Incrémenter le compteur de vues
    await this.productRepository.increment({ id }, 'viewCount', 1);

    return product;
  }

  async findByBoutique(boutiqueId: string, ownerId?: string) {
    const where: any = { boutiqueId };
    if (!ownerId) where.status = ProductStatus.ACTIVE;
    return this.productRepository.find({
      where,
      relations: ['compatibilities'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMyProducts(ownerId: string, query: ProductQueryDto) {
    const boutique = await this.boutiquesService.findByOwner(ownerId);
    const { search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .where('product.boutique_id = :boutiqueId', { boutiqueId: boutique.id })
      .andWhere('product.deleted_at IS NULL');

    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('product.created_at', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(
    id: string,
    ownerId: string,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['boutique'],
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    if (product.boutique.ownerId !== ownerId) {
      throw new ForbiddenException('Vous n\'êtes pas propriétaire de ce produit');
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['boutique'],
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    if (product.boutique.ownerId !== ownerId) {
      throw new ForbiddenException('Vous n\'êtes pas propriétaire de ce produit');
    }

    await this.productRepository.softDelete(id);
  }

  async approveProduct(id: string, approve: boolean): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    product.status = approve ? ProductStatus.ACTIVE : ProductStatus.REJECTED;
    return this.productRepository.save(product);
  }

  async addCompatibility(
    productId: string,
    ownerId: string,
    dto: AddCompatibilityDto,
  ): Promise<VehicleCompatibility> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['boutique'],
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    if (product.boutique.ownerId !== ownerId) {
      throw new ForbiddenException('Accès refusé');
    }

    const compat = this.compatibilityRepository.create({
      productId,
      ...dto,
    });

    return this.compatibilityRepository.save(compat);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: { status: ProductStatus.ACTIVE, isFeatured: true },
      relations: ['boutique'],
      take: 12,
      order: { createdAt: 'DESC' },
    });
  }

  async getVehicleBrands(): Promise<string[]> {
    const result = await this.compatibilityRepository
      .createQueryBuilder('compat')
      .select('DISTINCT compat.brand', 'brand')
      .orderBy('brand', 'ASC')
      .getRawMany();

    return result.map((r) => r.brand);
  }

  async getVehicleModels(brand: string): Promise<string[]> {
    const result = await this.compatibilityRepository
      .createQueryBuilder('compat')
      .select('DISTINCT compat.model', 'model')
      .where('compat.brand ILIKE :brand', { brand })
      .andWhere('compat.model IS NOT NULL')
      .orderBy('model', 'ASC')
      .getRawMany();

    return result.map((r) => r.model);
  }
}
