import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { Submission } from './submission.schema';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  // new submission
  @Post()
  async create(@Body() body: Partial<Submission>) {
    console.log('Received data in controller:');
    // Validate the request body
    if (!body.title || typeof body.title !== 'string') {
      throw new BadRequestException('Title is required and must be a string.');
    }

    if (body.year !== undefined) {
      const yearNumber = Number(body.year);
      if (isNaN(yearNumber)) {
        throw new BadRequestException('Year must be a valid number.');
      }
    }

    if (body.volume !== undefined && typeof body.volume !== 'string') {
      throw new BadRequestException('Volume must be a string.');
    }

    if (body.number !== undefined && typeof body.number !== 'string') {
      throw new BadRequestException('Number must be a string.');
    }

    if (body.pages !== undefined && typeof body.pages !== 'string') {
      throw new BadRequestException('Pages must be a string.');
    }

    if (body.doi !== undefined && typeof body.doi !== 'string') {
      throw new BadRequestException('DOI must be a string.');
    }

    if (body.authors !== undefined && typeof body.authors !== 'string') {
      throw new BadRequestException('Authors must be a string.');
    }

    if (body.journal !== undefined && typeof body.journal !== 'string') {
      throw new BadRequestException('Journal must be a string.');
    }

    return this.submissionsService.create(body);
  }

  // check submission duplicate
  @Get()
  async findAll(@Query('status') status?: string) {
    if (status) {
      return this.submissionsService.findByStatus(status);
    }
    return this.submissionsService.findAll();
  }

  // change submission status
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!status || typeof status !== 'string') {
      throw new BadRequestException('Status is required and must be a string.');
    }
    return this.submissionsService.updateStatus(id, status);
  }

  // search submissions
  @Get('search')
  async search(@Query('q') query: string): Promise<Submission[]> {
    if (!query || typeof query !== 'string') {
      throw new BadRequestException('Query parameter "q" is required and must be a string.');
    }
    return this.submissionsService.search(query);
  }
}
