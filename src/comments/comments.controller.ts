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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    await this.commentsService.create(createCommentDto);
    return {
      message: 'Comentario creado con éxito',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const comments = await this.commentsService.findAll();
    return {
      message: 'Lista de comentarios',
      statusCode: HttpStatus.OK,
      data: comments,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const comment = await this.commentsService.findOne(id);
    return {
      message: 'Comentario encontrado',
      statusCode: HttpStatus.OK,
      data: comment,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentsService.update(id, updateCommentDto);
    return {
      message: 'Comentario editado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(id);
    return {
      message: 'Comentario deshabilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }

  @Put(':id')
  async restore(@Param('id') id: string) {
    await this.commentsService.restore(id);
    return {
      message: 'Comentario habilitado con éxito',
      statusCode: HttpStatus.OK,
    };
  }
}
