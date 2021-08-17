import { injectable, inject } from 'tsyringe';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute({
    name,
    description,
  }: IRequest): Promise<Specification> {
    const specificationsAlreadyExists = await this.specificationsRepository.findByName(
      name,
    );

    if (specificationsAlreadyExists) {
      throw new AppError('Specifications already exists');
    }

    const specifications = await this.specificationsRepository.create({
      name,
      description,
    });

    return specifications;
  }
}

export { CreateSpecificationUseCase };
