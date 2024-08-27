import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Gender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Movie, (movie) => movie.gender)
  movies: Movie[];
}
