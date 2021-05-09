import { ISpecificationDTO } from '../dtos/ISpecificationDTO';
import { Specification } from '../models/Specification';

interface ISpecificationsRepository {
  create(data: ISpecificationDTO): Specification;
  findAll(): Specification[];
  findByName(name: string): Specification | undefined;
}

export { ISpecificationsRepository };
