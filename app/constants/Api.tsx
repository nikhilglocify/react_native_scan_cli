export const Apis={
    getJsonUrl:"scanApi",
    getDailyTip:"tip/getDailyTip",
    getUrls:"upload-json"

}

export const requestMethods={
    GET:"get",
    POST:"post",
    PUT:"put"
}


export const endPoint="https://staging-fingerprintzero.netlify.app/api"
// export const endPoint="http://192.168.50.7:3000/api"

// export const endPoint=`${process.env.END_POINT}/api`

import axios from "axios";



export const BASE_URL = process.env.BASE_URL;



//  Common API call function
export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
  dispatch,
}: any) =>
  new Promise(async (resolve, reject) => {
    const handleUnauthenticatedRequest = async() => {
      
    };
    const token = process.env.APP_TOKEN_SECRET;

    const options = {
      method: method,
      baseURL: BASE_URL,
      url: url,
      data: data,
      headers: {
        ...headers,
        // 'Content-Type': 'application/json',
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: params,
      timeout: 60000,
      // withCredentials: true,
    };
    // console.log("API Request 1", options);

    axios(options)
      .then(async (response) => {
        // console.log("API Response===", JSON.stringify(response?.data));
        if (response?.data?.statusCode === 200) {
          resolve(response);
        } else if (
          response?.data?.statusCode === 400 ||
          response?.data?.statusCode === 401 ||
          response?.data?.statusCode === 403
        ) {
          if (response?.data?.statusCode === 401) {
            handleUnauthenticatedRequest()
          }
          reject(response);
        } else {
          reject(response);
        }
      })
      .catch(async (error) => {
        // console.log("API Parameters ", options);
        // console.log("API Response error", error);
        const errorCode = error?.response?.data?.statusCode;
        if (errorCode === 400 || errorCode === 401 || errorCode === 403) {
          if (errorCode === 401) {
            handleUnauthenticatedRequest()
          }
        }

        reject(error);
      });
  });
