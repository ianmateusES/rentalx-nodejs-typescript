import { Specification } from '../../models/Specification';
import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';

class ListSpecificationsUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {}

  public execute(): Specification[] {
    const specifications = this.specificationsRepository.findAll();

    return specifications;
  }
}

export { ListSpecificationsUseCase };
