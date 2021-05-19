import { ISpecificationDTO } from '@modules/cars/dtos/ISpecificationDTO';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

import { ISpecificationsRepository } from '../ISpecificationsRepository';

class SpecificationsRepositoryInMemory implements ISpecificationsRepository {
  private specifications: Specification[];

  constructor() {
    this.specifications = [];
  }

  public async create({
    name,
    description,
  }: ISpecificationDTO): Promise<Specification> {
    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
      create_at: new Date(),
      update_at: new Date(),
    });

    this.specifications.push(specification);

    return specification;
  }

  public async save(specification: Specification): Promise<Specification> {
    const findIndex = this.specifications.findIndex(
      findSpecification => findSpecification.id === specification.id,
    );

    this.specifications[findIndex] = specification;

    return specification;
  }

  public async findAllSpecification(): Promise<Specification[]> {
    return this.specifications;
  }

  public async findByName(name: string): Promise<Specification> {
    return this.specifications.find(
      specification => specification.name === name,
    );
  }
}

export { SpecificationsRepositoryInMemory };
