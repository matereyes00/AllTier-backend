import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  transform(value: string): any {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid JSON string provided.');
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed: Invalid JSON format.');
    }
  }
}
