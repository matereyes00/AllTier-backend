import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TierList } from './tier.list.entity';
import { Item } from './item.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ type: 'text' })
  categoryName: string;

  @ManyToOne(() => TierList, (tierList) => tierList.comments, {
    onDelete: 'CASCADE',
  })
  tierList: TierList;

  // @OneToMany(() => Item, (items) => items.category)
  // items: Item[];
}
