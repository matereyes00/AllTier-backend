// item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TierList } from './tier.list.entity';
import { Rating } from './rating.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column()
  itemName: string;

  // Many items belong to one TierList
  @ManyToOne(() => TierList, (tierList) => tierList.items, {
    onDelete: 'CASCADE',
  })
  tierList: TierList;

  // Many item can have many ratings
  // @ManyToOne(() => Category, (category) => category.items)
  // category: Category;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;

  // One item can have many ratings
  @OneToMany(() => Rating, (rating) => rating.item)
  ratings: Rating[];
}
