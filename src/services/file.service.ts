import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor() {
    // aws 초기 세팅
    AWS.config.update({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
    });

    this.s3 = new AWS.S3();
  }

  // 파일 가져오기
  getFile(Bucket: string, Key: string): Promise<AWS.S3.GetObjectOutput> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket,
        Key,
      };

      this.s3.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // 파일 스트림 가져오기
  async getFileStream(Bucket: string, Key: string) {
    const params = {
      Bucket,
      Key,
    };

    const stream = await this.s3.getObject(params).createReadStream();

    return stream;
  }

  //  // 파일 정보 가져오기
  //  async getFileStat(Bucket: string, Key: string) {
  //   const params = {
  //     Bucket,
  //     Key,
  //   };

  //   const stream = await this.s3.(params);

  //   return stream;
  // }

  // 파일 업로드
  async uploadFile(
    dataBuffer: Buffer,
    filename: string,
    Bucket: string,
    isNotSetNewName?: boolean, // 파일명 새이름으로 설정 안할지 여부
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const fileExtName = extname(filename);

    let Key = `${uuidv4()}${fileExtName}`;

    if (isNotSetNewName) {
      Key = `${filename}${fileExtName}`;
    }

    const result = await this.s3
      .upload({
        Bucket,
        Body: dataBuffer,
        Key,
      })
      .promise();

    return result;
  }

  // 파일 여러개 삭제
  deleteFiles(Bucket: string, keys: string[]) {
    return new Promise((response, reject) => {
      if (keys.length < 1) {
        return response(true);
      }

      const paramsToDelete: AWS.S3.DeleteObjectsRequest = {
        Bucket,
        Delete: {
          Objects: [],
        },
      };

      keys.forEach((Key) => {
        paramsToDelete.Delete.Objects.push({ Key });
      });

      this.s3.deleteObjects(paramsToDelete, (err, data) => {
        if (err) {
          reject(err);
        } else {
          response(data);
        }
      });
    });
  }
}
