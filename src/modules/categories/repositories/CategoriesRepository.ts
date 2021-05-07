import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';
import Category from '../model/Category';
import ICategoriesRepos from './ICategoriesRepository';

class CategoriesRepository implements ICategoriesRepos {
  private categories: Category[];

  constructor() {
    this.categories = [];
  }

  public create({ name, description }: ICreateCategoryDTO): Category {
    const category = new Category();

    Object.assign(category, { name, description, created_at: new Date() });

    this.categories.push(category);

    return category;
  }

  public findAll(): Category[] {
    return this.categories;
  }

  public findByName(name: string): Category {
    const category = this.categories.find(category => category.name === name);

    return category;
  }
}

export default CategoriesRepository;
