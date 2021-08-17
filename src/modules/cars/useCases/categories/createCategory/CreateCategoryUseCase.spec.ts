import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });

  it('Should be able to create a new category', async () => {
    const category = await createCategoryUseCase.execute({
      name: 'SUV',
      description: 'Categoria de carros SUV',
    });

    expect(category).toHaveProperty('id');
  });

  it('Should not be able to create a new category with same name from another', async () => {
    await createCategoryUseCase.execute({
      name: 'SUV',
      description: 'Categoria de carros SUV',
    });

    await expect(
      createCategoryUseCase.execute({
        name: 'SUV',
        description: 'Categoria de carros SUV',
      }),
    ).rejects.toEqual(new AppError('Category already exists'));
  });
});
