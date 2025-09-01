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
import { ItemsService } from '../../../application/services/item.service';
import { User } from '../../../domain/entities/user.entity';
import { CurrentUser } from '../decorators/current.user.decorator';
import { UpdateItemDto } from '../../../application/dtos/Items/update-item.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Patch('edit-item/:tierListId/:itemId')
  async updateItem(
    @Param('tierListId') tierListId: string, 
    @Param('itemId') itemId: string,
    @CurrentUser() user: User,
    @Body() updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.updateItem(
      itemId,
      tierListId,
      user.userId, 
      updateItemDto
    )
  }


}
