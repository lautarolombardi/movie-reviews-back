import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentRepository.save(createCommentDto);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async findOne(id: string): Promise<Comment> {
    try {
      return await this.commentRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Comentario no encontrado');
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<void> {
    await this.findOne(id);

    await this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comment.deleted_at) {
      throw new BadRequestException(
        'El comentario ya se encuentra deshabilitado',
      );
    }

    await this.commentRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (!comment.deleted_at) {
      throw new BadRequestException('El comentario ya se encuentra habilitado');
    }
    await this.commentRepository.restore(id);
  }
}
