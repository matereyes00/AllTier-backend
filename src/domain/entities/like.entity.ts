import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TierList } from './tier.list.entity';

@Entity()
@Unique(['user', 'tierList']) // Prevents a user from liking the same tier list twice
export class TierListLike {
  @PrimaryGeneratedColumn('uuid')
  likeId: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => TierList, (tierList) => tierList.likes, {
    onDelete: 'CASCADE',
  })
  tierList: TierList;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
