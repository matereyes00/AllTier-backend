import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TierList } from './tier.list.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column()
  itemName: string;

  // This defines the relationship: Many Items belong to One TierList.
  @ManyToOne(() => TierList, (tierList) => tierList.items)
  tierList: TierList;
}
