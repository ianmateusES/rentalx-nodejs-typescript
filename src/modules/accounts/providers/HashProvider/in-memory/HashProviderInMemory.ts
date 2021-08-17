import { IHashProvider } from '../models/IHashProvider';

class HashProviderInMemory implements IHashProvider {
  public async generateHash(playload: string): Promise<string> {
    return playload;
  }

  public async compareHash(playload: string, hashed: string): Promise<boolean> {
    return playload === hashed;
  }
}

export { HashProviderInMemory };
