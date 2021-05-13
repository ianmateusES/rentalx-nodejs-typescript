import { getRepository, Repository } from 'typeorm';

import { ISpecificationDTO } from '../../../dtos/ISpecificationDTO';
import { Specification } from '../../../entities/Specification';
import { ISpecificationsRepository } from '../ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  private ormRepository: Repository<Specification>;

  constructor() {
    this.ormRepository = getRepository(Specification);
  }

  public async create({
    name,
    description,
  }: ISpecificationDTO): Promise<Specification> {
    const specification = this.ormRepository.create({ name, description });

    await this.ormRepository.save(specification);

    return specification;
  }

  public async findAllSpecification(): Promise<Specification[]> {
    const specifications = await this.ormRepository.find();
    return specifications;
  }

  public async findByName(name: string): Promise<Specification> {
    const specification = await this.ormRepository.findOne({ name });

    return specification;
  }
}

export { SpecificationsRepository };
