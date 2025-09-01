/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Item } from './item.entity';
import { TierListType } from '../enum/tier.list.enum';
import { Comment } from './comment.entity';
import { TierListLike } from './like.entity';

@Entity()
export class TierList {
  @PrimaryGeneratedColumn('uuid')
  tierListId: string;

  @Column({ unique: true })
  tierListName: string;

  @Column({ type: 'enum', enum: TierListType })
  tierListType: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;

  // creator
  @ManyToOne(() => User, (user) => user.tierLists)
  user: User;

  @OneToMany(() => Item, (item) => item.tierList, {
    cascade: true,
    eager: true,
  })
  items: Item[];

  @OneToMany(() => Comment, (comment) => comment.tierList, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @Column({ default: 0 })
  itemCount: number;

  @Column({ default: 0 })
  ratingCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;

  @OneToMany(() => TierListLike, (like) => like.tierList)
  likes: TierListLike[];

  @Column()
  categories: string[]
}
