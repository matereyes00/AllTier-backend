import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "../../../application/services/auth.service";
import { randomUUID } from "crypto";
import { User } from "../../../domain/entities/user.entity";

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
        logout: jest.fn()
    }
    
    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[AuthController],
            providers: [AuthService]
        }).overrideProvider(AuthService).useValue(mockAuthService).compile();
        
        controller = module.get<AuthController> (AuthController)
        service = module.get<AuthService>(AuthService);
    })

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

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    it('Should create a user', async () => {
        const result = await controller.signUp(mockUserSignUp);
        expect(result).toEqual(mockUserSignUpResult)
    })

    it('Should log a user in the app', async () => {
        const result = await controller.login(mockUserSignIn);
        expect(result).toEqual(mockUserSignInResult);
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

})