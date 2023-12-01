import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ScraperResponseDto } from './dto/scraper-response.dto';
import * as cheerio from 'cheerio';
import { WebsiteData } from './interface/website-data.interface';
import { ShowtimeInterface } from './interface/showtime.interface';
import { ShowtimeService } from '../showtime/showtime.service';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly showtimeService: ShowtimeService,
  ) {}

  private async fetchHtml(url: string): Promise<string> {
    const { data } = await firstValueFrom(
    this.httpService.get<string>(url).pipe(
        catchError((error: AxiosError) => {
          const msg = error?.response?.data || error?.response || error;
          this.logger.error(msg);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  convertToUTCFormat = (time: string, date: string) => {
      const hour = parseInt(time.split(':')[0]);
      const minute = time.split(':')[1].slice(0, 2);
      const noon = time.slice(-2);
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${
          noon === 'pm' ? hour + 12 : (hour < 10 ? `0${hour}` : hour)
      }:${minute}:00Z`;
  };

  private parseHtml(html: string): WebsiteData {
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') ?? '';
    const faviconUrl = $('link[rel="shortcut icon"]').attr('href') ?? '';

    const scriptUrls: string[] = [];
    $('script').each((_i, el) => {
      const src = $(el).attr('src');
      if (src) {
        scriptUrls.push(src);
      }
    });

    const stylesheetUrls: string[] = [];
    $('link[rel="stylesheet"]').each((_i, el) => {
      const href = $(el).attr('href');
      if (href) {
        stylesheetUrls.push(href);
      }
    });

    const imageUrls: string[] = [];
    $('img').each((_i, el) => {
      const src = $(el).attr('src');
      if (src) {
        imageUrls.push(src);
      }
    });

    let showtimes: ShowtimeInterface[] = [];

    try {
      const movies = $('article.movie-compare');
      const selectedDate = $('[name=d]')[0].attribs.value;
  
      for (let movie of movies) {
        const dates = $(movie).children('div.dates');
  
        const cinemaName = $(dates).children('h3.highlight').text();
        const movieTitle = $(movie).find('aside.movie-hero > div > h2').text();
  
        const fetchedShowTimes = $(dates)
            .children('ol.showtimes')
            .children('li');
        for (let fetchedShowTime of fetchedShowTimes) {
            const attribute = $(fetchedShowTime).children('strong').text();
            const scrapedShowtimes = $(fetchedShowTime)
            .find('ol li a')
            .map((_index, sTime) => ({
              showtimeId: sTime.attribs['data-id'].toString(),
              cinemaName,
              movieTitle,
              showtimeInUTC: this.convertToUTCFormat($(sTime).text(), selectedDate),
              bookingLink: `https://uae.voxcinemas.com${sTime.attribs['href'].toString()}`,
              attributes: [attribute],
            } as ShowtimeInterface))
            .get();
  
              showtimes.push(...scrapedShowtimes);
            }
      }
    } catch (error) {
      console.error(`Scraping failed: ${error.message}`);
    }

    return {
      title,
      metaDescription,
      faviconUrl,
      scriptUrls,
      stylesheetUrls,
      imageUrls,
      showtimes,
    };
  }

  async scrape(url: string): Promise<ScraperResponseDto> {
    const html = await this.fetchHtml(url);
    const websiteData: WebsiteData = this.parseHtml(html);
    await this.showtimeService.addShowtimes(websiteData.showtimes);
    return {
      requestUrl: url,
      responseData: websiteData,
    };
  }
}
