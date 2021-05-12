import { injectable, inject } from 'tsyringe';

import { Specification } from '../../entities/Specification';
import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';

@injectable()
class ListSpecificationsUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute(): Promise<Specification[]> {
    const specifications = await this.specificationsRepository.findAllSpecification();

    return specifications;
  }
}

export { ListSpecificationsUseCase };
