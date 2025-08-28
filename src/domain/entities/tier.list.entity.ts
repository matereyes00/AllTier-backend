import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Item } from './item.entity';
import { TierListType } from '../enum/tier.list.enum';
import { Comment } from './comment.entity';

@Entity()
export class TierList {
  @PrimaryGeneratedColumn('uuid')
  tierListId: string;

  @Column({ unique: true })
  tierListName: string;

  @Column({ type: 'enum', enum: TierListType })
  tierListType: string;

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

  @Column({ type: 'date' })
  createdAt: string;

  @Column({ type: 'date' })
  updatedAt: string;

}
