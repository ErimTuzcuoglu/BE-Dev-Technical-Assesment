import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ScraperRequestDto {
  @ApiProperty({
    description: 'Website Url',
    required: true,
    example: 'https://uae.voxcinemas.com/showtimes?c=al-hamra-mall-ras-al-khaimah&d=20231203',
  })
  @IsUrl(
    {
      require_protocol: true,
      require_tld: true,
      protocols: ['http', 'https'],
    },
    { message: 'Invalid URL format' },
  )
  url: string;
}