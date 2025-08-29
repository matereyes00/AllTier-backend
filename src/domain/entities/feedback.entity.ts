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
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  feedbackVoteId: string;

  @Column({ type: 'enum', enum: RatingVoteEnum })
  vote: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Rating, (rating) => rating.feedback)
  rating: Rating[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
