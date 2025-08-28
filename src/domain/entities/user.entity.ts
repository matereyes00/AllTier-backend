// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TierList } from './tier.list.entity';
import { Rating } from './rating.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // A user can have many tier lists
  @OneToMany(() => TierList, (tierList) => tierList.user)
  tierLists: TierList[];

  // A user can have many ratings
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  // A user can also have many comments
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Column({ default: 0 })
  tokenVersion: number; // 👈 used for invalidating old tokens

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[]; 
}
