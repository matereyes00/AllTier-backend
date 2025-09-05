// rating.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Item } from './item.entity';
import { User } from './user.entity';
import { FeedbackVote } from './feedback.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  ratingId: string;

  @ManyToOne(() => Item, (item) => item.ratings, { onDelete: 'CASCADE' })
  item: Item;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @Column({nullable: true})
  feedback: string;

  @Column({type: 'int', nullable: false, default: 0})
  score: number;
  
  @OneToMany(() => FeedbackVote, (vote) => vote.rating)
  feedbackVotes: FeedbackVote[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
