import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

// --- Mocking the Cloudinary SDK ---
// We tell Jest to replace the entire 'cloudinary' module with our own mock implementation.
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(), // Mock the config function
    uploader: {
      // Mock the upload_stream function
      upload_stream: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });
  
  // Clear all mocks after each test to ensure a clean state
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should successfully upload an image and return the result', async () => {
      // Arrange: Set up our mock data
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test file content'),
        size: 12345,
        stream: toStream(Buffer.from('test file content')),
        destination: '',
        filename: '',
        path: '',
      };

      // --- FIX: Added missing properties to satisfy the UploadApiResponse type ---
      const mockUploadApiResponse: UploadApiResponse = {
        public_id: 'test_public_id',
        version: 1234567890,
        signature: 'test_signature',
        width: 100,
        height: 100,
        format: 'jpg',
        resource_type: 'image',
        created_at: new Date().toISOString(),
        bytes: 12345,
        type: 'upload',
        etag: 'test_etag',
        placeholder: false,
        url: 'http://res.cloudinary.com/demo/image/upload/v1234567890/test_public_id.jpg',
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/test_public_id.jpg',
        access_mode: 'public',
        original_filename: 'test',
        // Add missing required properties with default values
        tags: [],
        pages: 0,
        moderation: [],
        access_control: [],
        context: {},
        metadata: {},
      };
      
      // Arrange: Tell our mock upload_stream how to behave.
      // It should immediately call its callback with (null, mockUploadApiResponse) to simulate success.
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((callback) => {
        callback(null, mockUploadApiResponse);
        // We must also return a mock stream object with a pipe method.
        return { pipe: jest.fn() };
      });

      // Act: Call the method we want to test
      const result = await service.uploadImage(mockFile);

      // Assert: Check if the result is what we expect
      expect(result).toEqual(mockUploadApiResponse);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    });

    it('should reject with an error if the upload fails', async () => {
      // Arrange
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test file content'),
        size: 12345,
        stream: toStream(Buffer.from('test file content')),
        destination: '',
        filename: '',
        path: '',
        encoding: '7bit'
      };
      
      const mockError = new Error('Cloudinary error');

      // Arrange: Tell our mock to call its callback with an error to simulate failure.
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((callback) => {
        callback(mockError, undefined);
        return { pipe: jest.fn() };
      });

      // Act & Assert: We expect the promise to reject with the mocked error.
      await expect(service.uploadImage(mockFile)).rejects.toThrow(mockError);
    });
  });
});

