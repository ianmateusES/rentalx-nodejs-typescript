import { v4 as uuidV4 } from 'uuid';

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
      id: uuidV4(),
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

    this.categories[findIndex] = category;

    return category;
  }

  public async findAllCategory(): Promise<Category[]> {
    return this.categories;
  }

  public async findByName(name: string): Promise<Category> {
    return this.categories.find(category => category.name === name);
  }
}

export { CategoriesRepositoryInMemory };
