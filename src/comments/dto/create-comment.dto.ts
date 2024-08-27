import { IsString, IsUUID } from 'class-validator';
import { Review } from '../../reviews/entities/review.entity';
import { User } from '../../users/entities/user.entity';

export class CreateCommentDto {
  @IsString()
  description: string;

  @IsUUID()
  user: User;

  @IsUUID()
  review: Review;
}
