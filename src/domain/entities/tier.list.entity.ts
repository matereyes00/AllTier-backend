import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TierList {
  @PrimaryGeneratedColumn('uuid')
  tierListId: string;

  @Column({ unique: true })
  tierListName: string;

  @ManyToOne(() => User, (user) => user.tierLists)
  user: User;

  @Column('simple-array', { default: [] })
  items: string[];
}
