import { ISpecificationDTO } from '../dtos/ISpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

interface ISpecificationsRepository {
  create(data: ISpecificationDTO): Promise<Specification>;
  save(specification: Specification): Promise<Specification>;
  findAllSpecification(): Promise<Specification[]>;
  findByName(name: string): Promise<Specification | undefined>;
}

export { ISpecificationsRepository };
