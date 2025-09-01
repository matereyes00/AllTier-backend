// rating.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Rating } from './rating.entity';
import { RatingVoteEnum } from '../enum/rating.vote.enum';

@Entity()
export class FeedbackVote {
  @PrimaryGeneratedColumn('uuid')
  feedbackVoteId: string;

  @Column({ type: 'enum', enum: RatingVoteEnum })
  vote: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Rating, (rating) => rating.feedbackVotes, { onDelete: 'CASCADE' })
  rating: Rating; // ✅ Type should be a single Rating, not an array.

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
