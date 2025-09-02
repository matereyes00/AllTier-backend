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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TierListService } from '../../../application/services/tier.list.service';
import { CreateTierListDto } from '../../../application/dtos/TierList/create-tier-list.dto';
import { UpdateTierListDto } from '../../../application/dtos/TierList/update-tier-list.dto';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../../application/services/cloudinary.service';

@ApiBearerAuth()
@Controller('tierlists')
@UseGuards(AuthGuard('jwt'))
export class TierListController {
  constructor(
    private readonly tierListService: TierListService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('create-tier-list')
  @ApiOperation({
    summary: 'Create a tier list for the logged in user',
  })
  @ApiBody({ type: CreateTierListDto })
  @ApiForbiddenResponse({
    description: 'You must be logged in to create a tier list',
  })
  @ApiBadRequestResponse({ description: 'Tier list must have a title' })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async create(
    @Body() createTierListDto: CreateTierListDto,
    @CurrentUser() user: User,
  ) {
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

  @Get('my-tier-lists')
  // @UseInterceptors(TierListInterceptor)
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
  @ApiOperation({
    summary: 'Update a tier list for the current logged in user',
  })
  @ApiNotFoundResponse({ description: 'Tier List not found' })
  @ApiForbiddenResponse({
    description: '⚠️ User has no permissions to access this tier list',
  })
  @ApiInternalServerErrorResponse({ description: '🚨 Unexpected server error' })
  async update(
    @Param('id') id: string,
    @Body() updateTierListDto: UpdateTierListDto,
    @CurrentUser() user: User,
  ) {
    return this.tierListService.update(id, updateTierListDto, user.userId);
  }

  @Delete('remove-tier-list/:id')
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
  @ApiOperation({
    summary: 'Like a tier list. Any user can like any tier list created by other users. Users can also like their own tier lists. A user cannot like a tier list twice',
  })
  likeTierList(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.likeTierList(id, user.userId)
  }

  @Patch(':id/thumbnail')
  @ApiOperation({
    summary: 'Upload or update a thumbnail for the tier list',
  })
  // 3. REMOVE the diskStorage configuration. We will handle the file in memory.
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
    // 4. Upload the image to Cloudinary using our service
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    // 5. Call the service to update the tier list with the new thumbnail URL
    //    We pass the secure_url from the Cloudinary response.
    return this.tierListService.addThumbnail(id, uploadResult.secure_url, user.userId);
  }


}
