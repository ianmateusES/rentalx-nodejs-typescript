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

    Object.assign(specification, { updated_at: new Date() });
    this.specifications[findIndex] = specification;

    return specification;
  }

  public async findAllSpecification(): Promise<Specification[]> {
    return this.specifications;
  }

  public async findById(id: string): Promise<Specification> {
    const specification = this.specifications.find(
      specification => specification.id === id,
    );

    return specification;
  }

  public async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = this.specifications.filter(specification =>
      ids.includes(specification.id),
    );

    return specifications;
  }

  public async findByName(name: string): Promise<Specification> {
    const specification = this.specifications.find(
      specification => specification.name === name,
    );

    return specification;
  }
}

export { SpecificationsRepositoryInMemory };
