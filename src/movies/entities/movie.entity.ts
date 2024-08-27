import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../../genders/entities/gender.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  year: number;

  @Column('text')
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @ManyToOne(() => Gender, (gender) => gender.movies)
  gender: Gender;
}
