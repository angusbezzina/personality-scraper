import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl as _getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { AWS_BASE_CONFIG, AWS_BUCKET, AWS_REGION } from "@personality-scraper/constants";

export namespace FileStorage {
  const s3 = new S3(AWS_BASE_CONFIG);

  const bucket = AWS_BUCKET;

  function getSignedUrl(path: string, params = {}) {
    return _getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: path, ...params }));
  }

  export async function uploadFile(path: string, file: Buffer) {
    try {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: bucket,
          Key: path,
          Body: file,
          ContentType: "text/plain", // TODO: Change this later?
        },
      });

      await upload.done();

      console.log(`File uploaded successfully to ${bucket}/${path}`);
    } catch (err) {
      console.error("Error uploading file:", err);
      return null;
    }
  }

  export async function getDownloadUrl(
    path: string,
    filename: string = path,
  ): Promise<string | null> {
    const filenameAndDate = `${filename}-${Date.now()}`;

    try {
      const params = {
        Expires: 60, // URL expiry time
        ResponseContentDisposition: `attachment; filename="${filenameAndDate}"`, // Force download
        ResponseContentType: "text/plain", // Ensure the content type is correct
      };

      const url = await getSignedUrl(path, params);

      return url;
    } catch (err) {
      console.error("Error generating pre-signed URL for File:", err);
      return null;
    }
  }
}
