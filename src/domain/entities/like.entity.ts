import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { TierList } from './tier.list.entity';

@Entity()
@Unique(['user', 'tierList']) // Prevents a user from liking the same tier list twice
export class Like {
  @PrimaryGeneratedColumn('uuid')
  likeId: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => TierList, (tierList) => tierList.likes, { onDelete: 'CASCADE' })
  tierList: TierList;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
