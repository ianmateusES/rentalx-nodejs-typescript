import { AppError } from '../../../../errors/AppError';
import { Specification } from '../../models/Specification';
import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateSpecificationUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {}

  public execute({ name, description }: IRequest): Specification {
    const specificationsAlreadyExists = this.specificationsRepository.findByName(
      name,
    );

    if (specificationsAlreadyExists) {
      throw new AppError('Specifications already exists!');
    }

    const specifications = this.specificationsRepository.create({
      name,
      description,
    });

    return specifications;
  }
}

export { CreateSpecificationUseCase };
