import uuid from "react-native-uuid"
import Clipboard from '@react-native-clipboard/clipboard';
import { getScanByIdLocally, getScanByNotificationIdLocally } from "./asyncStorage";
export const getRandomURLs = (urls: string[], min = 5, max = 10): string[] => {
  const numUrlsToSelect = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
  return shuffledUrls.slice(0, numUrlsToSelect);
};

export const getUrls = (urls: string[], numUrlsToSelect: number) => {
  const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
  return shuffledUrls.slice(0, numUrlsToSelect);
}


export const generateId = (length?: number) => {
  if (length) {
    return uuid.v4().substring(0, length);
  } else {
    return uuid.v4();
  }
}

export function generate32BitIntegerID(): number {
  return Math.floor(Math.random() * (2 ** 31));
}
export const generateNotificationId = async (): Promise<string> => {
  try {
    const id = generate32BitIntegerID();
    const isIdExist = await (await getScanByNotificationIdLocally(String(id))).length > 0;
    if (isIdExist) {
      console.log("Already Exist")
      return await generateNotificationId(); // Retry for uniqueness
    } else {
      console.log("unique id Exist")
      return String(id);
    }
  } catch (error) {
    console.error("Error generating notification ID:", error);
    throw new Error("Failed to generate a unique notification ID.");
  }
};


export const copyToClipboard = (text:string) => {
  Clipboard.setString(text);
};



export function generateS3Url(objectKey: string) {
  console.log("file object key",objectKey)
  console.log("gg",`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`)
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
}