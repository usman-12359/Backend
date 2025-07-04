import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;
import { config } from 'src/config';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  async uploadFile(file: any, uuid: any, folderName?: string): Promise<any> {
    const filePath = `${process.env.AWS_S3_BUCKET}/${folderName}`;
    await this.s3_upload(
      file.buffer,
      filePath,
      uuid || file.originalName,
      file.mimetype || file.fileType.mime,
    );
    return {
      uuid: uuid,
      originalName: file.originalName,
      fileType: file.fileType,
      size: file.size,
      encoding: file.encoding,
    };
  }

  async createBucket(bucketName: string) {
    const params = {
      Bucket: bucketName + '-keywest',
    };
    return await this.s3.createBucket(params, function (err, data) {
    });
  }

  getPreSignedUrl(key: string, folderName?: string): string {
    const filePath = `${process.env.AWS_S3_BUCKET}/${folderName}`;
    const expirationTime = Number(process.env.PRESIGNED_URL_EXPIRES_IN);

    const responseURL = this.s3.getSignedUrl('getObject', {
      Bucket: filePath,
      Key: key,
      Expires: expirationTime,
    });

    return responseURL ? responseURL : '';
  }


  async sendEmail(to: string, template: { SUBJECT?: string; HTML?: string }) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: 'v4',
    });

    const ses = new AWS.SES({ apiVersion: '2010-12-01' });
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Data: template.HTML,
          },
        },
        Subject: {
          Data: template.SUBJECT,
        },
      },
      Source: config.EMAIL,
    };

    ses.sendEmail(params, (err, data) => {
      if (err) {
        console.error('Error sending email: ', err);
      } else {
      }
    });
  }

  private async s3_upload(file, bucket, name, mimetype): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
    };

    const s3Response: SendData = await this.s3.upload(params).promise();
    return name;
  }
}
