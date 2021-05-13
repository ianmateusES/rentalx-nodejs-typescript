import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../../../shared/errors/AppError';
import { Specification } from '../../../entities/Specification';
import { ISpecificationsRepository } from '../../../repositories/specifications/ISpecificationsRepository';

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
      throw new AppError('Specifications already exists!');
    }

    const specifications = await this.specificationsRepository.create({
      name,
      description,
    });

    return specifications;
  }
}

export { CreateSpecificationUseCase };
