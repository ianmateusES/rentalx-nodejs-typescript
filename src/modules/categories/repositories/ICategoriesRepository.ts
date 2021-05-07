import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';
import Category from '../model/Category';

export default interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Category;
  findAll(): Category[];
  findByName(name: string): Category | undefined;
}
