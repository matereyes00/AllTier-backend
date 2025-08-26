// comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Rating } from './rating.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  commentId: string;

  @Column({ type: 'text' })
  commentText: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Rating, (rating) => rating.comments, { onDelete: 'CASCADE' })
  rating: Rating;
}
