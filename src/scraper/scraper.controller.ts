import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScraperRequestDto } from './dto/scraper-request.dto';
import { ScraperService } from './scraper.service';
import { ScraperResponseDto } from './dto/scraper-response.dto';

@Controller('scraper')
@ApiTags('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiOperation({
    summary: 'Initiate a new scraping process for the provided URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully initiated scraping process',
    type: ScraperResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Invalid URL or missing parameters',
  })
  @ApiNotFoundResponse({
    description: 'Not Found: The specified URL does not exist or cannot be reached',
  })
  @Get('scrape')
  async scrapeRequest(
    @Query() scrapeRequestDto: ScraperRequestDto,
  ): Promise<ScraperResponseDto> {
    try {
      const result = await this.scraperService.scrape(scrapeRequestDto.url);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}