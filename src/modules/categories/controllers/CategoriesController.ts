import { Request, Response } from 'express';

import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRepository = new CategoriesRepository();

export default class CategoriesController {
  public create(req: Request, res: Response): Response {
    const { name, description } = req.body;

    const createCategoryService = new CreateCategoryService(
      categoriesRepository,
    );

    const category = createCategoryService.execute({ name, description });

    return res.status(201).json(category);
  }

  public index(req: Request, res: Response): Response {
    const categories = categoriesRepository.findAll();
    return res.json(categories);
  }
}
