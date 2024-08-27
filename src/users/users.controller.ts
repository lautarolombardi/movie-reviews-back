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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);

    return {
      message: 'Usuario creado con éxito',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: 'Lista de usuarios',
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'Usuario encontrado',
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
    return {
      message: 'Usuario editado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      message: 'Usuario deshabilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  async restore(@Param('id') id: string) {
    await this.usersService.restore(id);
    return {
      message: 'Usuario habilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }
}
