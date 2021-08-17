import { ICreateCarImageDTO } from '../dtos/ICreateCarImageDTO';
import { CarImage } from '../infra/typeorm/entities/CarImage';

interface ICarsImagesRepository {
  create(data: ICreateCarImageDTO): Promise<CarImage>;
  // save(carImage: CarImage): Promise<CarImage>;
}

export { ICarsImagesRepository };
