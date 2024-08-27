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
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    await this.rolesService.create(createRoleDto);
    return { message: 'Rol creado con éxito', statusCode: HttpStatus.CREATED };
  }

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      message: 'Lista de roles',
      statusCode: HttpStatus.OK,
      data: roles,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const role = await this.rolesService.findOne(id);
    return {
      message: 'Rol encontrado',
      statusCode: HttpStatus.OK,
      data: role,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    await this.rolesService.update(id, updateRoleDto);
    return {
      message: 'Rol editado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.rolesService.remove(id);
    return {
      message: 'Rol deshabilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  async restore(@Param('id') id: number) {
    await this.rolesService.restore(id);
    return {
      message: 'Rol habilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }
}
