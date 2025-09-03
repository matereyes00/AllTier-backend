import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "../../../application/services/auth.service";
import { randomUUID } from "crypto";
import { User } from "../../../domain/entities/user.entity";
import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const mockAuthService = {
        signUp: jest.fn(dto => {
            return {
                id: randomUUID(),
                username: dto.username,
                email: dto.email,
                password: 'hashed_password'
            }
        }),
        login: jest.fn(dto => {
            return {
                accessToken: `${randomUUID()}`,
                refreshToken: `${randomUUID()}`
            }
        }),
        logout: jest.fn(),
        validateRefreshToken: jest.fn((userId, refreshToken) => ({
            accessToken: `${randomUUID()}`,
            refreshToken: `${randomUUID()}`,
        }))
    }
    
    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[AuthController],
            providers: [AuthService]
        }).overrideProvider(AuthService).useValue(mockAuthService).compile();
        
        controller = module.get<AuthController> (AuthController)
        service = module.get<AuthService>(AuthService);
    })

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    const mockUserSignUp = {
        email: "testuser@gmail.com",
        username: "testUser",
        password: "password123",
        confirmPassword: "password123"
    }

    const mockUserSignUpResult = {
        id: expect.any(String),
        username: 'testUser',
        email: 'testuser@gmail.com',
        password: expect.any(String)
    }

    const mockUserSignIn = {
        username: "testUser",
        password: "password123",
    }
    
    const mockUserSignInResult = {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
    };

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('signUp', () => {
        it('Should create and return a new user', async () => {
            const result = await controller.signUp(mockUserSignUp);
            expect(service.signUp).toHaveBeenCalledWith(mockUserSignUp);
            expect(result.email).toEqual(mockUserSignUp.email);
            expect(result).toHaveProperty('id');
        });

        it('Should throw ConflictException if email already exists', async () => {
            mockAuthService.signUp.mockImplementationOnce(() => {
                throw new ConflictException('User with this email already exists');
            });
            await expect(controller.signUp(mockUserSignUp))
                .rejects
                .toThrow(ConflictException);
        });

        it('Should throw BadRequestException if passwords do not match', async () => {
            const badSignUpDto = { ...mockUserSignUp, confirmPassword: 'wrong-password' };
            mockAuthService.signUp.mockImplementationOnce(() => {
                throw new BadRequestException('Passwords do not match');
            });
            await expect(controller.signUp(badSignUpDto))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('login', () => {
        it('Should log a user in and return tokens', async () => {
            const result = await controller.login(mockUserSignIn);
            expect(service.login).toHaveBeenCalledWith(mockUserSignIn);
            expect(result).toEqual(mockUserSignInResult);
        });

        it('Should throw UnauthorizedException for invalid credentials', async () => {
            mockAuthService.login.mockImplementationOnce(() => {
                throw new UnauthorizedException('Invalid credentials');
            });
            await expect(controller.login(mockUserSignIn))
                .rejects
                .toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        var userId = randomUUID()
        it('Should log a user out of the application', async () => {
            const user = {userId: userId} as User;
            const result = await controller.logout(user)
            expect(service.logout).toHaveBeenCalledWith(userId);
            expect(result).toEqual({message: 'Logged out successfully'})
        })
    })

    describe('refreshTokens', () => {
        it('Should return a new set of tokens', async () => {
            const userId = randomUUID();
            const refreshToken = 'old-refresh-token';
            const mockRequest = {
                user: {
                    user: { userId },
                    refreshToken
                }
            };

            const result = await controller.refreshTokens(mockRequest as any);
            expect(service.validateRefreshToken)
                .toHaveBeenCalledWith(userId, refreshToken);
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });
    });


})