import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  ParseUUIDPipe,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TierListService } from '../../../application/services/tier.list.service';
import { CreateTierListDto } from '../../../application/dtos/TierList/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/TierList/update-tier-list.dto';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'; // 2. Import FileFieldsInterceptor
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current.user.decorator';
import { User } from '../../../domain/entities/user.entity';
import { TierListInterceptor } from '../interceptors/tier.lists.interceptor';
import { CloudinaryService } from '../../../application/services/cloudinary.service';
import { CreateItemDto } from 'src/application/dtos/Items/create-item.dto';
import { JsonParsePipe } from '../pipes/json-parse.pipe';

@ApiBearerAuth()
@Controller('tierlists')
export class TierListController {
  constructor(
    private readonly tierListService: TierListService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('create-tier-list')
  @ApiOperation({
    summary: 'Create a tier list for the logged in user',
  })
  @ApiConsumes('multipart/form-data') // 3. Specify that this endpoint consumes multipart/form-data
  @ApiBody({ type: CreateTierListDto })
  @UseInterceptors(FileFieldsInterceptor([ // 4. Use the interceptor for mixed files
    { name: 'tierListThumbnail', maxCount: 1 },    // Expect one file for the thumbnail
    { name: 'itemThumbnail', maxCount: 20 }, // Expect up to 20 files for the items
  ]))
  @ApiForbiddenResponse({
    description: 'You must be logged in to create a tier list',
  })
  @ApiBadRequestResponse({ description: 'Tier list must have a title' })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  @UseGuards(AuthGuard('jwt'))
  async create(
    @UploadedFiles() files: { 
      tierListThumbnail?: Express.Multer.File[], 
      itemThumbnail?: Express.Multer.File[] // Changed from 'itemImages' to 'itemThumbnail'
    },
    @Body() body: any,
    @CurrentUser() user: User,
  ) {
    if (!body.categories || !body.items) {
      throw new BadRequestException('Categories and items fields are required.');
    }
    const categories = JSON.parse(body.categories);
    const itemsDto: CreateItemDto[] = JSON.parse(body.items);

    let thumbnailUrl = '';
    if (files.tierListThumbnail && files.tierListThumbnail[0]) {
      const uploadResult = await this.cloudinaryService.uploadImage(files.tierListThumbnail[0]);
      thumbnailUrl = uploadResult.secure_url;
    }

    const itemImageUrls: (string | null)[] = [];
    // The property name here must also match
    if (files.itemThumbnail && files.itemThumbnail.length > 0) {
      for (const file of files.itemThumbnail) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        itemImageUrls.push(uploadResult.secure_url);
      }
    }
    
    const itemsWithImages = itemsDto.map((item, index) => ({
      ...item,
      itemPhotoUrl: itemImageUrls[index] || null,
    }));

    const createTierListDto = new CreateTierListDto();
    createTierListDto.tierListName = body.tierListName;
    createTierListDto.tierListType = body.tierListType;
    createTierListDto.categories = categories;
    createTierListDto.tierListThumbnailUrl = thumbnailUrl;
    createTierListDto.items = itemsWithImages;

    const validationPipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });
    try {
      await validationPipe.transform(createTierListDto, { metatype: CreateTierListDto, type: 'body' });
    } catch (e) {
      throw new BadRequestException(e.getResponse());
    }

    return this.tierListService.create(createTierListDto, user);
  }

  @Get('all-tier-lists')
  @ApiOperation({
    summary: 'Get all tier lists',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async findAll() {
    return this.tierListService.findAll();
  }

  @Get('all-tier-lists/:tierListId')
  @ApiOperation({
    summary: 'Get a specific tier list while logged out',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async findAllLoggedOut(@Param('tierListId') id: string, @CurrentUser() user: User) {
    return this.tierListService.findOne(id, user.userId);
  }

  @Get('my-tier-lists')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all tier lists for the logged in user',
  })
  @ApiNotFoundResponse({
    description: 'No tier lists found for the logged in user',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async findAllForUser(@CurrentUser() user: User) {
    var tierLists = await this.tierListService.findAllForUser(user.userId);
    return tierLists;
  }

  @Get('my-tier-list/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get a specific tier list owned by the logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.findOne(id, user.userId);
  }

  @Patch('update-tier-list/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update a tier list for the current logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('tierListThumbnail')) 
  async update(
    @Param('id') id: string,
    @Body() updateTierListDto: UpdateTierListDto,
    @CurrentUser() user: User,
    @UploadedFiles() tierListImgFile: Express.Multer.File
  ) {
    if (tierListImgFile) {
      const uploadResult = await this.cloudinaryService.uploadImage(tierListImgFile);
      updateTierListDto.tierListThumbnailUrl = uploadResult.secure_url;
    }
    return this.tierListService.update(id, updateTierListDto, user.userId);
  }

  @Delete('remove-tier-list/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete a tier list for the current logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.remove(id, user.userId);
  }

  @UseInterceptors(TierListInterceptor)
  @Patch('like/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Like a tier list. Any user can like any tier list created by other users. Users can also like their own tier lists. A user cannot like a tier list twice',
  })
  likeTierList(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.likeTierList(id, user.userId)
  }

  @Patch(':id/thumbnail')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Upload or update a thumbnail for the tier list',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadThumbnail(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User, // It's good practice to pass the user for authorization
  ) {
    if (!file) {
      throw new BadRequestException('File is required for thumbnail upload.');
    }
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    return this.tierListService.addThumbnail(id, uploadResult.secure_url, user.userId);
  }


}
