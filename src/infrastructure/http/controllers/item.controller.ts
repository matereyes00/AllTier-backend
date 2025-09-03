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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ItemsService } from '../../../application/services/item.service';
import { User } from '../../../domain/entities/user.entity';
import { CurrentUser } from '../decorators/current.user.decorator';
import { UpdateItemDto } from '../../../application/dtos/Items/update-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateItemDto } from '../../../application/dtos/Items/create-item.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Item } from '../../../domain/entities/item.entity';
import { CloudinaryService } from 'src/application/services/cloudinary.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tier-lists/:tierListId/items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-item')
  @ApiOperation({
    summary: 'Create an item for a tier list for the logged in user',
  })
   @ApiBody({
    description: 'Item data and photo file',
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
          description: 'The image file for the item (e.g., png, jpg).',
        },
        itemName: {
          type: 'string',
          example: 'Super Mario',
          description: 'The name of the item.',
        },
      },
      required: ['photo', 'itemName'],
    },
  })
  @ApiParam({ name: 'tierListId', type: 'string', format: 'uuid', description: 'The ID of the parent tier list' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created.', type: Item })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'The specified tier list was not found.' })
  @UseInterceptors(FileInterceptor('photo')) // 'photo' is the field name for the file in the form-data
  async createItem(
    @Param('tierListId', ParseUUIDPipe) tierListId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    photo: Express.Multer.File, // Type for the uploaded file
    @Body() createItemDto: CreateItemDto,
  ) {
    // The 'photo' object contains the file buffer, mimetype, size, etc.
    // The 'createItemDto' contains other text fields from the form.
    return this.itemsService.create(tierListId, createItemDto, photo);
  }

  @Patch('edit-item/:itemId')
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({ name: 'tierListId', type: 'string', format: 'uuid', description: 'The ID of the parent tier list' })
  @ApiParam({ name: 'itemId', type: 'string', format: 'uuid', description: 'The ID of the item to update' })
  @ApiConsumes('multipart/form-data') // 3. Specify this endpoint accepts form-data
  @UseInterceptors(FileInterceptor('photo')) // 4. Use the FileInterceptor to handle the image
  async updateItem(
    @Param('tierListId') tierListId: string, 
    @Param('itemId') itemId: string,
    @CurrentUser() user: User,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    let photoUrl: string | undefined = undefined;
    if (photo) {
      const uploadResult = await this.cloudinaryService.uploadImage(photo);
      photoUrl = uploadResult.secure_url;
    }

    return this.itemsService.updateItem(
      itemId,
      tierListId,
      user.userId, 
      updateItemDto,
      photoUrl, // Pass the new URL
    )
  }


}
