import { Test, TestingModule } from "@nestjs/testing";
import { TierListController } from "./tier.list.controller";
import { TierListService } from "../../../application/services/tier.list.service";
import { randomUUID } from "crypto";
describe('TierListController', () => {
    let controller: TierListController;
    let service: TierListService;

    /*
     * {
        "tierListId": "fee3fde2-3604-40e4-9224-0ce8b19e8704",
        "tierListName": "Another Favorite Video Games",
        "tierListType": "Tournament",
        "thumbnailUrl": "/wuwa.jpg",
        "user": {
            "userId": "adb73f8a-9509-4841-bdb1-a7fab951c50d",
            "username": "testuser_postman",
            "password": "$2b$10$PoHnQDZ/iWYUNcc1Yeo2SehQ5nCb0SPp7AFkGGcP86gvJy06aU4RG",
            "email": "testuser_postman2@gmail.com",
            "tokenVersion": 0
        },
        "items": [
            {
                "itemId": "d24088da-c7d6-42e0-816f-f4fab7b7c217",
                "itemName": "NBA 2K24",
                "itemPhotoUrl": null
            },
            {
                "itemId": "151ea519-0c06-4356-af57-c56e451553c5",
                "itemName": "Minecraft again",
                "itemPhotoUrl": null
            },
            {
                "itemId": "ae4b2122-58b1-4bee-a6aa-e8381f95849d",
                "itemName": "Minecraft",
                "itemPhotoUrl": null
            }
        ],
        "comments": [],
        "itemCount": 3,
        "ratingCount": 0,
        "commentCount": 0,
        "likeCount": 0,
        "createdAt": "2025-09-01T06:50:11.305Z",
        "updatedAt": "2025-09-01T06:50:11.305Z",
        "likes": [],
        "categories": [
            "abc",
            "cde"
        ]
    }
     */

    const mockUser = {
        userId: randomUUID(),
        username: "testuser_postman",
        password: "password123",
        email: "testuser_postman2@gmail.com",
        tokenVersion: 0,
        tierLists: [],
        ratings: [],
        comments: [],
        likes: [],
    }

    const mockCreateTierListDto = {
        tierListName: 'Tier List Name',
        tierListType: 'Tournament',
        thumbnailUrl: '/img.jpg',
        items: [],
        categories: []
    }

    const failMockCreateTierListDto = {
        tierListName: 'Tier List Name',
        tierListType: 'Tournament',
        thumbnailUrl: '/img.jpg',
        items: [],
        categories: []
    }

    const mockCreateTierList = {
        tierListId: randomUUID(),
        tierListName: "Tier List Name",
        tierListType: "Tournament",
        thumbnailUrl: "/img.jpg",
        comments : [],
        itemCount: 1,
        items: [],
        ratingCount: 1,
        commentCount: 1,
        likeCount: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likes: [],
        user: mockUser
    }

    const mockTierListService = {
        create: jest.fn((dto, user) => {
            return mockCreateTierList
        })
    }

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[TierListController],
            providers: [TierListService]
        }).overrideProvider(TierListService).useValue(mockTierListService).compile();
        
        controller = module.get<TierListController> (TierListController)
        service = module.get<TierListService>(TierListService);
    })

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('create', () => {
        it('should create and return a new tier list owned by user', async () => {
            const result = await controller.create(mockCreateTierListDto, mockUser);
            expect(service.create).toHaveBeenCalledWith(mockCreateTierListDto, mockUser);
            // expect(result.email).toEqual(mockUserSignUp.email);
            expect(result).toHaveProperty('tierListId');
        });

        it('Should fail to create and return a new tier list owned by user - incomplete fields', async () => {
            const badCreateTierListDto = failMockCreateTierListDto
        });
    })
    
    describe('findAll', () => {})
    
    describe('findAllForUser', () => {})
    
    describe('findOne', () => {})
    
    describe('update', () => {})
    
    describe('remove', () => {})
    
    describe('addThumbnail', () => {})
    
    describe('likeTierList', () => {})

})