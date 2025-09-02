import { Test, TestingModule } from '@nestjs/testing';
import { TierListController } from './tier.list.controller';
import { TierListService } from '../../../application/services/tier.list.service';
import { CloudinaryService } from '../../../application/services/cloudinary.service';
import { User } from '../../../domain/entities/user.entity';
import { randomUUID } from 'crypto';
import toStream = require('buffer-to-stream');

describe('TierListController', () => {
  let controller: TierListController;
  let tierListService: TierListService;
  let cloudinaryService: CloudinaryService;

  // Mock for the TierListService
  const mockTierListService = {
    create: jest.fn(),
    addThumbnail: jest.fn(),
    // Add other methods used in your controller as needed
    findAll: jest.fn(),
    findAllForUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    likeTierList: jest.fn(),
  };

  // --- FIX: Create a mock for the CloudinaryService ---
  const mockCloudinaryService = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TierListController],
      providers: [TierListService, CloudinaryService],
    })
      // Override the real services with our mocks
      .overrideProvider(TierListService)
      .useValue(mockTierListService)
      .overrideProvider(CloudinaryService)
      .useValue(mockCloudinaryService)
      .compile();

    controller = module.get<TierListController>(TierListController);
    tierListService = module.get<TierListService>(TierListService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new tier list owned by user', async () => {
      const createDto = { tierListName: 'Test List', categories: ['S', 'A'], tierListType: 'Rating', thumbnailUrl: '/hello.jpg' };
      const user = { userId: randomUUID() } as User;
      const expectedResult = { tierListId: randomUUID(), ...createDto };

      mockTierListService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, user);
      expect(tierListService.create).toHaveBeenCalledWith(createDto, user);
      expect(result).toEqual(expectedResult);
    });
  });
  
  describe('uploadThumbnail', () => {
    it('should upload a thumbnail and update the tier list', async () => {
      const tierListId = randomUUID();
      const user = { userId: randomUUID() } as User;
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'thumbnail.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('fake image data'),
        size: 12345,
        stream: toStream(Buffer.from('fake image data')),
        destination: '',
        filename: '',
        path: '',
      };
      const mockUploadResult = {
        secure_url: 'http://cloudinary.com/path/to/image.png',
      };
      // Mock the return values of our service calls
      mockCloudinaryService.uploadImage.mockResolvedValue(mockUploadResult as any);
      mockTierListService.addThumbnail.mockResolvedValue({ success: true });
      // Act
      const result = await controller.uploadThumbnail(tierListId, mockFile, user);
      // Assert
      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(tierListService.addThumbnail).toHaveBeenCalledWith(
        tierListId,
        mockUploadResult.secure_url,
        user.userId,
      );
      expect(result).toEqual({ success: true });
    });
  });
});

