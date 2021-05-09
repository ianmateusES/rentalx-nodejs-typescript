import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { Category } from '../models/Category';

interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Category;
  findAll(): Category[];
  findByName(name: string): Category | undefined;
}

export { ICategoriesRepository };
