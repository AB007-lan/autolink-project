import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

export class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.findById(userId);
    user.avatarUrl = avatarUrl;
    return this.userRepository.save(user);
  }

  async getFavorites(userId: string) {
    // TODO: Implémenter les favoris avec une table de liaison
    return [];
  }
}
