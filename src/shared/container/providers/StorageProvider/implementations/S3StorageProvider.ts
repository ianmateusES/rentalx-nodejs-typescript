import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

import uploadConfig from '@config/upload';

import { IStorageProvider } from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async saveFile(file: string, folder: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not Found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: `${uploadConfig.config.aws.bucket}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, folder, file),
    );

    // await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${uploadConfig.config.aws.bucket}/${folder}`,
        Key: file,
      })
      .promise();
    const filePath = path.resolve(uploadConfig.uploadsFolder, folder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export { S3StorageProvider };
