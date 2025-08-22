import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Item } from './item.entity';

@Entity()
export class TierList {
  @PrimaryGeneratedColumn('uuid')
  tierListId: string;

  @Column({ unique: true })
  tierListName: string;

  @ManyToOne(() => User, (user) => user.tierLists)
  user: User;

  @OneToMany(() => Item, (item) => item.tierList, { cascade: true, eager: true })
  items: Item[];
}
