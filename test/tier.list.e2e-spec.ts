// test/tier-list.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/infrastructure/modules/app.module';
import { AuthService } from '../src/application/services/auth.service';
import { ConfigModule } from '@nestjs/config';

describe('TierListController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        AppModule, 
      ],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();

    // Get an instance of AuthService to generate a token for our tests
    authService = moduleFixture.get<AuthService>(AuthService);

    // Create a mock user and sign in to get a valid token
    // Note: In a real app, you might have a test user seeder
    const user = { username: 'test-user',  email: 'test@example.com', password: 'test-password'}; 
    jwtToken = (await authService.login(user)).accessToken;
  });

  afterAll(async () => {
    await app.close();
  });
  
  // Test Case 1: Fail without a token
  it('/tier-lists/:id (GET) - should fail with 401 without a token', () => {
    return request(app.getHttpServer())
      .get('/tier-lists/some-tier-list-id') // Use a real or mock endpoint
      .expect(401); // Assert that the status code is Unauthorized
  });

  // Test Case 2: Succeed with a token
  it('/tier-lists/:id (GET) - should succeed with a valid token', () => {
    // This test assumes you have a GET /tier-lists/:id endpoint.
    // It might fail with 404 if the ID doesn't exist, but a 200/404/403 proves authentication worked.
    return request(app.getHttpServer())
      .get('/tier-lists/some-tier-list-id')
      .set('Authorization', `Bearer ${jwtToken}`) // Set the auth header
      .expect(200); // Or expect(404) if you know the ID is fake. The key is it's not 401.
  });
});