// rating.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { RatingVoteEnum } from '../enum/rating.vote.enum';

@Entity()
export class CommentVote {
  @PrimaryGeneratedColumn('uuid')
  commentVoteId: string;

  @Column({ type: 'enum', enum: RatingVoteEnum })
  vote: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.commentVote)
  comment: Comment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
