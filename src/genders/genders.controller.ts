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
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { GendersService } from './genders.service';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Post()
  async create(@Body() createGenderDto: CreateGenderDto) {
    await this.gendersService.create(createGenderDto);
    return {
      message: 'Género creado con éxito',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const genders = await this.gendersService.findAll();
    return {
      message: 'Lista de géneros',
      statusCode: HttpStatus.OK,
      data: genders,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const gender = await this.gendersService.findOne(id);
    return {
      message: 'Género encontrado',
      statusCode: HttpStatus.OK,
      data: gender,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenderDto: UpdateGenderDto,
  ) {
    await this.gendersService.update(id, updateGenderDto);
    return {
      message: 'Género editado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.gendersService.remove(id);
    return {
      message: 'Género deshabilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  async restore(@Param('id') id: string) {
    await this.gendersService.restore(id);
    return {
      message: 'Género habilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }
}
