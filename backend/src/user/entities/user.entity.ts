import { Listing } from 'src/listing/entities/listing.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: number;

  @Column({
    enum: [0, 1],
    default: 0,
  })
  role: number;

  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[];

  @Column({ default: '' })
  avatar: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
