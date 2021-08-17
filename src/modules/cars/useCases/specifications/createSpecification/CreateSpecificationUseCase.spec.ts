import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createSpecificationUseCase: CreateSpecificationUseCase;

describe('Create Specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory,
    );
  });

  it('should be able to create a new specification', async () => {
    const specification = await createSpecificationUseCase.execute({
      name: 'Motor 1.5',
      description: 'x cavalos de potencia',
    });

    expect(specification).toHaveProperty('id');
  });

  it('should not be able to create a new specification with same name from another', async () => {
    await createSpecificationUseCase.execute({
      name: 'Motor 1.5',
      description: 'x cavalos de potencia',
    });

    await expect(
      createSpecificationUseCase.execute({
        name: 'Motor 1.5',
        description: 'x cavalos de potencia',
      }),
    ).rejects.toEqual(new AppError('Specifications already exists'));
  });
});
