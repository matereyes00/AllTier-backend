import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity'

@Entity()
@Unique(['user', 'comment']) // Prevents a user from liking the same comment twice
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  commentLikeId: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.likeCount, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
