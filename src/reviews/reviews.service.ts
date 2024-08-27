import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.reviewRepository.save(createReviewDto);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }

  async findOne(id: string): Promise<Review> {
    try {
      return await this.reviewRepository.findOneOrFail({
        where: { id },
        relations: ['user', 'comments'],
      });
    } catch (error) {
      throw new NotFoundException('Reseña no encontrada');
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<void> {
    await this.findOne(id);

    await this.reviewRepository.update(id, updateReviewDto);
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    if (review.deleted_at) {
      throw new BadRequestException('La reseña ya se encuentra deshabiltada');
    }

    await this.reviewRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    if (!review.deleted_at) {
      throw new BadRequestException('La reseña ya se encuentra habilitada');
    }

    await this.reviewRepository.restore(id);
  }
}
