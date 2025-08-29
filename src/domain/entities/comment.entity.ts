import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TierList } from './tier.list.entity';
import { CommentVote } from './coment.vote.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  commentId: string;

  @Column({ type: 'text' })
  commentText: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => TierList, (tierList) => tierList.comments, {
    onDelete: 'CASCADE',
  })
  tierList: TierList;

  @ManyToOne(() => CommentVote, (commentVote) => commentVote.comment, {
    onDelete: 'CASCADE',
  })
  commentVote: CommentVote;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: string;

  @Column({ default: 0 })
  likeCount: number;
}
