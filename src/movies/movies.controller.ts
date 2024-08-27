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
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    await this.moviesService.create(createMovieDto);
    return {
      message: 'Película creada con éxito',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const movies = await this.moviesService.findAll();
    return {
      message: 'Lista de películas',
      statusCode: HttpStatus.OK,
      data: movies,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);
    return {
      message: 'Película encontrada',
      statusCode: HttpStatus.OK,
      data: movie,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    await this.moviesService.update(id, updateMovieDto);
    return {
      message: 'Película editada con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.moviesService.remove(id);
    return {
      message: 'Película deshabilitada con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  async restore(@Param('id') id: string) {
    await this.moviesService.restore(id);
    return {
      message: 'Película habilitada con éxito',
      statusCode: HttpStatus.OK,
    };
  }
}
