// comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Rating } from './rating.entity';
import { TierList } from './tier.list.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  commentId: string;

  @Column({ type: 'text' })
  commentText: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => TierList, (tierList) => tierList.comments, { onDelete: 'CASCADE' })
  tierList: TierList;

  @ManyToOne(() => Rating, (rating) => rating.comments, { onDelete: 'CASCADE' })
  rating: Rating;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: string;

  @Column({ default: 0 })
  likeCount: number;

}
