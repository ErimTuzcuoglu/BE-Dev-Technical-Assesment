import { ApiProperty } from "@nestjs/swagger";
import { ShowtimeInterface } from "../interface/showtime.interface";

export class ShowtimeDto implements ShowtimeInterface {
    @ApiProperty()
    showtimeId: string;
  
    @ApiProperty()
    cinemaName: string;
  
    @ApiProperty()
    movieTitle: string;
  
    @ApiProperty()
    showtimeInUTC: string;
  
    @ApiProperty()
    bookingLink: string;
  
    @ApiProperty({ type: [String] })
    attributes: string[];
  }