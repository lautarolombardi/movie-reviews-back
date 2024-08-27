import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  calification: number;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie: Movie;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.review)
  comments: Comment[];
}
