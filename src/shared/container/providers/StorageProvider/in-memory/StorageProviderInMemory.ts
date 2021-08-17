import { IStorageProvider } from '../models/IStorageProvider';

class StorageProviderInMemory implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string, _: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string, _: string): Promise<void> {
    const fileIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    this.storage.splice(fileIndex, 1);
  }
}

export { StorageProviderInMemory };
