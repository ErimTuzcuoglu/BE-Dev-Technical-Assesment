import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entity/showtime.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowtimeSummaryEntity } from './entity/showtimeSummary.entity';
import { ShowtimeInterface } from 'src/scraper/interface/showtime.interface';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(ShowtimeEntity)
    private showtimeEntityRepository: Repository<ShowtimeEntity>,
    @InjectRepository(ShowtimeSummaryEntity)
    private showtimeSummaryEntityRepository: Repository<ShowtimeSummaryEntity>,
    private dataSource: DataSource,
  ) {}

  private async updateShowtimeSummary() {
    const entityManager = this.showtimeSummaryEntityRepository.manager;

    try {
      await entityManager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.query(`
        INSERT INTO "showtime-summary"
        ("showtimeDate",
         "cinemaName",
         "movieTitle",
         attributes,
         city,
         "showtimeCount")
        SELECT date(showtime."showtimeInUTC" AT TIME ZONE 'UTC'),
            showtime."cinemaName",
            showtime."movieTitle",
            showtime.attributes,
            showtime.city,
        COUNT(*) AS "showtimeCount"
        FROM "showtime"
        GROUP BY
            date(showtime."showtimeInUTC" AT TIME ZONE 'UTC'),
            showtime."cinemaName",
            showtime."movieTitle",
            showtime.attributes,
            showtime.city
        ON CONFLICT
            (
            "showtimeDate",
            "cinemaName",
            "movieTitle",
            attributes,
            city
            )
            DO UPDATE
                   SET "showtimeCount"= EXCLUDED."showtimeCount"
      `);
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async addShowtimes(showtimes: ShowtimeInterface[]) {
    for (const showtime of showtimes) {
      try {
        await this.showtimeEntityRepository
          .createQueryBuilder()
          .insert()
          .into(ShowtimeEntity)
          .values({
            showtimeId: showtime.showtimeId,
            movieTitle: showtime.movieTitle,
            cinemaName: showtime.cinemaName,
            showtimeInUTC: showtime.showtimeInUTC,
            bookingLink: showtime.bookingLink,
            attributes: showtime.attributes,
            city: showtime.cinemaName.split('-')[1].trim()
          })
          .execute();
      } catch (error) {
        if (error.code === '23505' && error.detail.includes('showtimeId')) {
          console.error(`Duplicate showtimeId: ${showtime.showtimeId}. Skipping.`);
          continue;
        } else {
          throw error;
        }
      }
    }
    await this.updateShowtimeSummary();
  }
}
