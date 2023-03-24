import * as admin from 'firebase-admin';

export function uploadFile(folder: string, fileName: string, fileExtension: string, bucketName: string, fileBuffer: Buffer): Promise<string> {
  const bucket = admin.storage().bucket(bucketName);
  const filePath = `${folder}/${fileName}.${fileExtension}`;
  const file = bucket.file(filePath);
  
  return new Promise<string>((resolve, reject) => {
    file.save(fileBuffer, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(filePath);
      }
    });
  });
}

export async function uploadPublicFile(folder: string, fileName: string, fileExtension: string, bucketName: string, fileBuffer: Buffer): Promise<string> {
  const bucket = admin.storage().bucket(bucketName);
  const filePath = `${folder}/${fileName}.${fileExtension}`;
  const file = bucket.file(filePath);
  
  if (!file.isPublic()) {
    await file.makePublic();
  }

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-17-3000',
  });

  return new Promise<string>((resolve, reject) => {
    file.save(fileBuffer, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });
}

export function deleteFile(filePath: string, bucketName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const file = admin.storage().bucket(bucketName).file(filePath);

    file.delete()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function getPublicURL(filePath: string, bucketName: string): Promise<string> {
  const file = admin.storage().bucket(bucketName).file(filePath);
  if (!file.isPublic()) {
    await file.makePublic();
  }

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-17-3000',
  });

  return url;
}

export function getTempPublicURL(filePath: string, bucketName: string, minutes: number): Promise<string> {
  const file = admin.storage().bucket(bucketName).file(filePath);
  const expiration = new Date(Date.now() + minutes * 60 * 1000);

  return file
    .getSignedUrl({
      action: 'read',
      expires: expiration,
    })
    .then(([url]) => {
      return url;
    })
    .catch((error) => {
      return '';
    });
}

export function extractFilePath(url: string): string {
  const pattern = /\/([^\/]+)\?/;
  const match = pattern.exec(url);
  if (match) {
    return match[1];
  }
  return '';
}
