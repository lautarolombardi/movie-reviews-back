import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      return await this.movieRepository.save(createMovieDto);
    } catch (error) {
      throw new ConflictException('La película ya existe');
    }
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  async findOne(id: string): Promise<Movie> {
    try {
      return await this.movieRepository.findOneOrFail({
        where: { id },
        relations: ['reviews'],
      });
    } catch (error) {
      throw new NotFoundException('Película no encontrada');
    }
  }

  async findOneByTitle(id: string): Promise<Movie> {
    return await this.movieRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<void> {
    await this.findOne(id);

    await this.movieRepository.update(id, updateMovieDto);
  }

  async remove(id: string): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    if (movie.deleted_at) {
      throw new BadRequestException(
        'La película ya se encuentra deshabilitada',
      );
    }

    await this.movieRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    if (!movie.deleted_at) {
      throw new BadRequestException('La película ya se encuentra habilitada');
    }

    await this.movieRepository.restore(id);
  }
}
