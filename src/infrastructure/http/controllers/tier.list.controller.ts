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
import { User } from 'src/domain/entities/user.entity';
import { TierListInterceptor } from '../interceptors/tier.lists.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@Controller('tierlists')
@UseGuards(AuthGuard('jwt'))
export class TierListController {
  constructor(private readonly tierListService: TierListService) {}

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
  likeTierList(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tierListService.likeTierList(id, user.userId)
  }

  @Patch(':id/thumbnail')
  @UseInterceptors(
    FileInterceptor('file', { // 'file' is the field name for the uploaded file
      storage: diskStorage({
        destination: './uploads', // The folder where files will be saved
        filename: (req, file, cb) => {
          // Generate a unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data') // For Swagger documentation
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
    @UploadedFile() file: Express.Multer.File, // Access the uploaded file
    updateTierListDto: UpdateTierListDto
  ) {
    // The service will handle linking the file to the tier list
    return this.tierListService.addThumbnail(id, file.path, updateTierListDto);
  }


}
