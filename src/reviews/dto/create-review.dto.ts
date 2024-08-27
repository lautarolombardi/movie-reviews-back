import { IsInt, IsString, IsUUID } from 'class-validator';
import { Movie } from '../../movies/entities/movie.entity';
import { User } from '../../users/entities/user.entity';

export class CreateReviewDto {
  @IsString()
  description: string;

  @IsInt()
  calification: number;

  @IsUUID()
  movie: Movie;

  @IsUUID()
  user: User;
}
