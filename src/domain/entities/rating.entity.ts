// rating.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  ratingId: string;

  @ManyToOne(() => Item, (item) => item.ratings, { onDelete: 'CASCADE' })
  item: Item;

  @Column({ default: 0 })
  upVotes: number;

  @Column({ default: 0 })
  downVotes: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.rating)
  comments: Comment[];
}
