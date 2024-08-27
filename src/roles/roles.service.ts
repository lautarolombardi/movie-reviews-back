import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.roleRepository.save(createRoleDto);
    } catch (error) {
      throw new ConflictException('El rol ya existe');
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    try {
      return await this.roleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Rol no encontrado');
    }
  }

  async findOneByDescription(description: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { description } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<void> {
    await this.findOne(id);

    await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    if (role.deleted_at) {
      throw new BadRequestException('El rol ya se encuentra deshabilitado');
    }

    await this.roleRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    if (!role.deleted_at) {
      throw new BadRequestException('El rol ya se encuentra habilitado');
    }

    await this.roleRepository.restore(id);
  }
}
