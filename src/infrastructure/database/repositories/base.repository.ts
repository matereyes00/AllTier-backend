// src/infrastructure/database/repositories/base.repository.ts
import { Repository, FindOptionsRelations, EntityTarget, DataSource, ObjectLiteral } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  private repository: Repository<T >;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository<T>(entity);
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
}
