import { ItemRepository } from "src/infrastructure/database/repositories/item.repository";

export class ItemsService {
    constructor(private readonly itemRepository: ItemRepository) {}
    
}