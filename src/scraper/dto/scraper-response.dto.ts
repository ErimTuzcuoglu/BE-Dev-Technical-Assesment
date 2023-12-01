import { ApiProperty } from '@nestjs/swagger';
import { WebsiteData } from '../interface/website-data.interface';
import { WebsiteDataDto } from './websitedata-dto';

export class ScraperResponseDto {
    @ApiProperty({
        description: 'The URL of the website that was scraped',
        example: 'https://uae.voxcinemas.com/showtimes?c=al-hamra-mall-ras-al-khaimah&d=20231203',
    })
    requestUrl: string;

    @ApiProperty({
        description: 'Data extracted from the scraped website',
        example: {
            title: "Movie Timings at Al Hamra Mall - Ras Al Khaimah Cinema | VOX Cinemas UAE",
            metaDescription: "Looking for new movies to watch at Al Hamra Mall - Ras Al Khaimah cinema? We've got you covered! Visit our website to see movies showtimes, trailers & more.",
            faviconUrl: "/assets/favicon.ico",
            scriptUrls: [
            "https://cdn.cookielaw.org/consent/875eb283-28ea-45f1-b220-2282bbb56c28/OtAutoBlock.js",
            ],
            stylesheetUrls: [
            "/assets/css/core-c7366f3aee68e7a58dcdd25b951344b6.css"
            ],
            imageUrls: [
            "/assets/images/region/ae-128x128.png",
            ],
            showtimes: [
            {
                showtimeId: "0009-171728",
                cinemaName: "Al Hamra Mall - Ras Al Khaimah",
                movieTitle: "Animal",
                showtimeInUTC: "2023-12-03T02:00:00Z",
                bookingLink: "https://uae.voxcinemas.com/booking/0009-171728",
                attributes: [
                "MAX"
                ]
            }
            ]
        } as WebsiteDataDto,
        type: WebsiteDataDto,
    })
    responseData: WebsiteData;
}
