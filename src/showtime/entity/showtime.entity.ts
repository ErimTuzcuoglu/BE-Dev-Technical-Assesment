import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'showtime', orderBy: { id: 'ASC' } })
// @Index(['id, movieTitle, cinemaName, showtimeInUTC, bookingLink, attributes'])
export class ShowtimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, unique: true })
  showtimeId: string;

  @Column({ nullable: false })
  cinemaName: string;

  @Column({ nullable: false })
  movieTitle: string;

  @Column({ type: 'timestamptz', nullable: false })
  showtimeInUTC: Date;

  @Column({ nullable: false })
  bookingLink: string;

  @Column('varchar', { array: true, nullable: true })
  attributes: string[];

  @Column({ nullable: true, default: null })
  city: string;
}
