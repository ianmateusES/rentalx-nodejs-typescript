import { ISpecificationDTO } from '../dtos/ISpecificationDTO';
import { Specification } from '../entities/Specification';

interface ISpecificationsRepository {
  create(data: ISpecificationDTO): Promise<Specification>;
  findAllSpecification(): Promise<Specification[]>;
  findByName(name: string): Promise<Specification | undefined>;
}

export { ISpecificationsRepository };
