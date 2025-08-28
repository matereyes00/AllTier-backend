// src/infrastructure/database/repositories/base.repository.ts
import { Repository, FindOptionsRelations, EntityTarget, DataSource, ObjectLiteral } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  private repository: Repository<T >;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository<T>(entity);
  }

  async findAll(relations: FindOptionsRelations<T> = {}): Promise<T[]> {
    return this.repository.find({ relations });
  }

  async findById(
    idKey: keyof T,
    id: string,
    relations: FindOptionsRelations<T> = {}
  ): Promise<T | null> {
    return this.repository.findOne({
      where: { [idKey]: id } as any,
      relations,
    });
  }

  async findAllByUserId(
    userKey: keyof T,
    userId: string,
    relations: FindOptionsRelations<T> = {}
  ): Promise<T[]> {
    return this.repository.find({
      where: { [userKey]: { userId } } as any,
      relations,
    });
  }

  async findAllByRelationId(
    relationKey: keyof T,    // e.g. "tierList", "user"
    relationIdKey: string,   // e.g. "tierListId", "userId"
    relationId: string,      // actual id value
    relations: FindOptionsRelations<T> = {}
  ): Promise<T[]> {
    return this.repository.find({
      where: {
        [relationKey]: { [relationIdKey]: relationId },
      } as any,
      relations,
    });
  }

}
