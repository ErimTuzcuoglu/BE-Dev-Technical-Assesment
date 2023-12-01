import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeEntity } from './showtime/entity/showtime.entity';
import { ShowtimeSummaryEntity } from './showtime/entity/showtimeSummary.entity';
import { AppConfigModule } from './config/config.module';
import databaseConfig from './persistence/database.config';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    ScraperModule,
    ShowtimeModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
