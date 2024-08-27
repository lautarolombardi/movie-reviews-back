import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard, UserGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    await this.reviewsService.create(createReviewDto);
    return {
      message: 'Reseña creada con éxito',
      statusCode: HttpStatus.CREATED,
    };
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async findAll() {
    const reviews = await this.reviewsService.findAll();
    return {
      message: 'Lista de reseñas',
      statusCode: HttpStatus.OK,
      data: reviews,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);
    return {
      message: 'Reseña encontrada',
      statusCode: HttpStatus.OK,
      data: review,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    await this.reviewsService.update(id, updateReviewDto);
    return {
      message: 'Reseña editada con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
    return {
      message: 'Reseña deshabilitada con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  async restore(@Param('id') id: string) {
    await this.reviewsService.restore(id);
    return {
      message: 'Reseña habilitada con éxito',
      statusCode: HttpStatus.OK,
    };
  }
}
