import { ApiProperty } from "@nestjs/swagger";
import { WebsiteData } from "../interface/website-data.interface";
import { ShowtimeInterface } from "../interface/showtime.interface";
import { ShowtimeDto } from "./showtime-dto";

export class WebsiteDataDto implements WebsiteData {
    @ApiProperty()
    title: string;
  
    @ApiProperty()
    metaDescription: string;
  
    @ApiProperty()
    faviconUrl: string;
  
    @ApiProperty({ type: [String] })
    scriptUrls: string[];
  
    @ApiProperty({ type: [String] })
    stylesheetUrls: string[];
  
    @ApiProperty({ type: [String] })
    imageUrls: string[];
  
    @ApiProperty({ type: [ShowtimeDto] })
    showtimes: ShowtimeInterface[];
  }