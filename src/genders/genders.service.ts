import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { Gender } from './entities/gender.entity';

@Injectable()
export class GendersService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) {}
  async create(createGenderDto: CreateGenderDto): Promise<Gender> {
    try {
      return await this.genderRepository.save(createGenderDto);
    } catch (error) {
      throw new ConflictException('El género ya existe');
    }
  }

  async findAll(): Promise<Gender[]> {
    return await this.genderRepository.find();
  }

  async findOne(id: string): Promise<Gender> {
    try {
      return await this.genderRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Género no encontrado');
    }
  }

  async update(id: string, updateGenderDto: UpdateGenderDto): Promise<void> {
    await this.findOne(id);

    await this.genderRepository.update(id, updateGenderDto);
  }

  async remove(id: string): Promise<void> {
    const gender = await this.genderRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!gender) {
      throw new NotFoundException('Género no encontrado');
    }

    if (gender.deleted_at) {
      throw new BadRequestException('El género ya se encuentra deshabilitado');
    }

    await this.genderRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const gender = await this.genderRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!gender) {
      throw new NotFoundException('Género no encontrado');
    }

    if (!gender.deleted_at) {
      throw new BadRequestException('El género ya se encuentra habilitado');
    }

    await this.genderRepository.restore(id);
  }
}
