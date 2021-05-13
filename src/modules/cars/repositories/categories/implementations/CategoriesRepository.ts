import { getRepository, Repository } from 'typeorm';

import { ICreateCategoryDTO } from '../../../dtos/ICreateCategoryDTO';
import { Category } from '../../../entities/Category';
import { ICategoriesRepository } from '../ICategoriesRepository';

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create({
    name,
    description,
  }: ICreateCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({ name, description });

    await this.ormRepository.save(category);

    return category;
  }

  public async findAllCategory(): Promise<Category[]> {
    const categories = await this.ormRepository.find();
    return categories;
  }

  public async findByName(name: string): Promise<Category> {
    const category = await this.ormRepository.findOne({ name });

    return category;
  }
}

export { CategoriesRepository };
