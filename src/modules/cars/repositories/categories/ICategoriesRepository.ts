import { ICreateCategoryDTO } from '../../dtos/ICreateCategoryDTO';
import { Category } from '../../entities/Category';

interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  findAllCategory(): Promise<Category[]>;
  findByName(name: string): Promise<Category | undefined>;
}

export { ICategoriesRepository };
