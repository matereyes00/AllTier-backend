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

@Entity()
export class TierList {
  @PrimaryGeneratedColumn('uuid')
  tierListId: string;

  @Column({ unique: true })
  tierListName: string;

  @Column({ type: 'enum', enum: TierListType })
  tierListType: string;

  @ManyToOne(() => User, (user) => user.tierLists)
  user: User;

  @OneToMany(() => Item, (item) => item.tierList, {
    cascade: true,
    eager: true,
  })
  items: Item[];
}
