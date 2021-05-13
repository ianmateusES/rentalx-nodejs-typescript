import csvParse from 'csv-parse';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import { Category } from '../../../entities/Category';
import { ICategoriesRepository } from '../../../repositories/categories/ICategoriesRepository';

interface IImportCategories {
  name: string;
  description: string;
}

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

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
          fs.promises.unlink(file.path);
        })
        .on('error', err => {
          fs.promises.unlink(file.path);
          reject(err);
        });
    });
  }

  public async execute(file: Express.Multer.File): Promise<Category[]> {
    const categories = await this.loadCategories(file);
    const categoriesCreate = [];

    await Promise.all(
      categories.map(async category => {
        const { name } = category;
        const existCategory = await this.categoriesRepository.findByName(name);

        if (!existCategory) {
          const categoryCreate = await this.categoriesRepository.create(
            category,
          );
          categoriesCreate.push(categoryCreate);
        }
      }),
    );

    return categoriesCreate;
  }
}

export { ImportCategoryUseCase };
