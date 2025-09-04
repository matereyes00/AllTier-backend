// src/infrastructure/database/repositories/base.repository.ts
import { 
  Repository, FindOptionsRelations, 
  EntityTarget, DataSource, ObjectLiteral, 
  SelectQueryBuilder, FindOptionsWhere } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;
  protected alias: string;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository<T>(entity);
    this.alias = entity.toString().split(' ')[1].toLowerCase();
  }

  protected createQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.alias);
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

  // ? QUERIES
  async countBy(where: FindOptionsWhere<T>): Promise<number> {
    return this.createQueryBuilder().where(where).getCount();
  }
  
  /**
   * Calculates the sum of a specific numeric column.
   * @param column The name of the column to sum (e.g., 'likeCount').
   * @param where An optional filter to apply.
   * @returns A promise that resolves to the sum.
   */
  async getSum(column: keyof T, where?: FindOptionsWhere<T>) {
    const query = this.createQueryBuilder();
    query.select(`SUM ${this.alias}.${column as string}`, `total`)
    if (where) {
      query.where(where)
    }
    const result = await query.getRawOne();
    return parseInt(result.total, 10) || 0
  }

}
