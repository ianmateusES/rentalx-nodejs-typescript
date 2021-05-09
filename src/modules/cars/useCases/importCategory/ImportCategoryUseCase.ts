import csvParse from 'csv-parse';
import fs from 'fs';

import { Category } from '../../models/Category';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IImportCategories {
  name: string;
  description: string;
}

class ImportCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  private async loadCategories(
    file: Express.Multer.File,
  ): Promise<IImportCategories[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const categories: IImportCategories[] = [];
      const parseFile = csvParse();

      stream.pipe(parseFile);
      parseFile
        .on('data', async row => {
          const [name, description] = row;
          categories.push({
            name,
            description,
          });
        })
        .on('end', () => {
          resolve(categories);
        })
        .on('error', err => reject(err));
      fs.promises.unlink(file.path);
    });
  }

  public async execute(file: Express.Multer.File): Promise<Category[]> {
    const categories = await this.loadCategories(file);
    const categoriesCreate = [];

    categories.map(async category => {
      const { name } = category;
      const existCategory = this.categoriesRepository.findByName(name);

      if (!existCategory) {
        const categoryCreate = this.categoriesRepository.create(category);
        categoriesCreate.push(categoryCreate);
      }
    });

    return categoriesCreate;
  }
}

export { ImportCategoryUseCase };
