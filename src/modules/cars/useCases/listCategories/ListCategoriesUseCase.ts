import { Category } from '../../models/Category';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

class ListCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  public execute(): Category[] {
    const category = this.categoriesRepository.findAll();

    return category;
  }
}

export { ListCategoriesUseCase };
