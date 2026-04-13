import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole, UserStatus } from './entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  AuthResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier le téléphone si fourni
    if (dto.phone) {
      const existingPhone = await this.userRepository.findOne({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé');
      }
    }

    // Créer l'utilisateur
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash: dto.password,
      role: dto.role || UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    });

    await this.userRepository.save(user);

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Votre compte a été suspendu');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Votre compte est inactif');
    }

    // Mettre à jour la date de dernière connexion
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return this.generateAuthResponse(user);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET') || 'autolink-refresh-secret',
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== dto.refreshToken) {
        throw new UnauthorizedException('Token de rafraîchissement invalide');
      }

      return this.generateAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Token de rafraîchissement invalide ou expiré');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 heure

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.userRepository.save(user);

    // TODO: Envoyer l'email avec le lien de réinitialisation
    // await this.mailService.sendPasswordReset(user.email, token);

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: dto.token },
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isCurrentPasswordValid = await user.validatePassword(dto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepository.save(user);

    return { message: 'Mot de passe modifié avec succès' };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'autolink-secret-key',
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'autolink-refresh-secret',
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '30d',
    });

    // Sauvegarder le refresh token
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
      },
      expiresIn: 86400, // 24h en secondes
    };
  }
}
