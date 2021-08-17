import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';

import { ICategoriesRepository } from '../ICategoriesRepository';

class CategoriesRepositoryInMemory implements ICategoriesRepository {
  private categories: Category[];

  constructor() {
    this.categories = [];
  }

  public async create({
    name,
    description,
  }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
      create_at: new Date(),
      update_at: new Date(),
    });

    this.categories.push(category);

    return category;
  }

  public async save(category: Category): Promise<Category> {
    const findIndex = this.categories.findIndex(
      findCategory => findCategory.id === category.id,
    );
    Object.assign(category, { updated_at: new Date() });
    this.categories[findIndex] = category;

    return category;
  }

  public async findAllCategory(): Promise<Category[]> {
    return this.categories;
  }

  public async findById(id: string): Promise<Category> {
    const category = this.categories.find(category => category.id === id);

    return category;
  }

  public async findByName(name: string): Promise<Category> {
    const category = this.categories.find(category => category.name === name);

    return category;
  }
}

export { CategoriesRepositoryInMemory };
