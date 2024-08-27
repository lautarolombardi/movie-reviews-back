import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    const defaultRole = await this.rolesService.findOneByDescription('user');
    if (!defaultRole) {
      throw new BadRequestException('El rol no existe');
    }

    createUserDto.password = await this.encryptPassword(createUserDto.password);

    const createdUser = await this.userRepository.save(createUserDto);

    createdUser.role = defaultRole;

    await this.update(createdUser.id, createdUser);

    return createdUser;
  }

  async createGoogleUser(createUserDto: CreateUserDto) {
    const defaultRole = await this.rolesService.findOneByDescription('user');
    if (!defaultRole) {
      throw new BadRequestException('El rol no existe');
    }

    createUserDto.password = await this.encryptPassword(createUserDto.password);

    const createdUser = await this.userRepository.save(createUserDto);
    createdUser.role = defaultRole;

    await this.update(createdUser.id, createdUser);

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneOrNull(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findOneWithCredentials(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.email')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.findOne(id);

    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.deleted_at) {
      throw new BadRequestException('El usuario ya se encuentra deshabilitado');
    }

    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.deleted_at) {
      throw new BadRequestException('El usuario ya se encuentra habilitado');
    }

    await this.userRepository.restore(id);
  }

  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
