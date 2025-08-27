import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ItemsService } from 'src/application/services/item.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
}
