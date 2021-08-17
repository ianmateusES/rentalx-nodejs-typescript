import { ISpecificationDTO } from '../dtos/ISpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

interface ISpecificationsRepository {
  create(data: ISpecificationDTO): Promise<Specification>;
  save(specification: Specification): Promise<Specification>;
  findAllSpecification(): Promise<Specification[]>;
  findById(id: string): Promise<Specification>;
  findByIds(ids: string[]): Promise<Specification[]>;
  findByName(name: string): Promise<Specification>;
}

export { ISpecificationsRepository };
