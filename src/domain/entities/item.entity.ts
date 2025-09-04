// item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TierList } from './tier.list.entity';
import { Rating } from './rating.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column()
  itemName: string;

  @ManyToOne(() => TierList, (tierList) => tierList.items, {
    onDelete: 'CASCADE',
  })
  tierList: TierList;

  @Column({ type: 'varchar', nullable: true })
  itemPhotoUrl: string | null;

  @OneToMany(() => Rating, (rating) => rating.item)
  ratings: Rating[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  averageRating: number | null;

  @Column({ type: 'float', nullable: true, default: 0 })
  ratingCount: number | null;
  
}
