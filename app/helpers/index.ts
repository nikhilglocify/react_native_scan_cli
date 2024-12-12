import uuid from "react-native-uuid"
import { getScanByIdLocally } from "./asyncStorage";
export const getRandomURLs = (urls: string[], min = 5, max = 10): string[] => {
    const numUrlsToSelect = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
    return shuffledUrls.slice(0, numUrlsToSelect);
  };

  export const getUrls=(urls: string[],numUrlsToSelect:number)=>{
    const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
    return shuffledUrls.slice(0, numUrlsToSelect);
  }


  export const generateId=(length?:number)=>{
    if(length){
      return uuid.v4().substring(0, length);
    }else{
      return uuid.v4();
    }
  }


  export const generateNotificationId= async(length:number):Promise<string>=>{
    const id=generateId(length)
    const isIdExist=await (await getScanByIdLocally(id)).length>0
    if(isIdExist){
     return await generateNotificationId(length)
    }else{
      return id
    }
  }
