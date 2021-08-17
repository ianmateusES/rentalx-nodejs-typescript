import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { Category } from '../infra/typeorm/entities/Category';

interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  save(category: Category): Promise<Category>;
  findAllCategory(): Promise<Category[]>;
  findById(id: string): Promise<Category>;
  findByName(name: string): Promise<Category>;
}

export { ICategoriesRepository };
