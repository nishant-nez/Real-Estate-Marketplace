import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    enum: ['house', 'land', 'apartment'],
  })
  type: 'house' | 'land' | 'apartment';

  @Column()
  price: number;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column('float')
  area: number;

  @Column('float')
  stories: number;

  @Column()
  bedroom: number;

  @Column()
  bathroom: number;

  @Column()
  kitchen: number;

  @Column({ default: 0 })
  recommended_price: number;

  @Column()
  car_parking: number;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  //   constructor(item: Partial<Listing>) {
  //     Object.assign(this, item);
  //   }
}
