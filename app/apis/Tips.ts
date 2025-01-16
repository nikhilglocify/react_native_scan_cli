import axios from 'axios';
import { Apis, endPoint } from '../constants/Api';
// import {AWS_REGION} from "react-native-dotenv"



export const getDailyTip = async () => {


    try {
        const requestId = Date.now();
        console.log("process.env.END_POINT",process.env.END_POINT,process.env.APP_TOKEN_SECRET)
        const response = await axios.get(`${endPoint}/${Apis.getDailyTip}`,{
            headers:{
                "appToken":process.env.APP_TOKEN_SECRET
            }
        });
        
        console.log(`[${requestId}] Response success`,`${endPoint}/${Apis.getDailyTip}`);
    
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (!error.response) {
                console.error('Network Error or No Response:', error.message);
                throw new Error('Network Error: Unable to reach the server');
            }

            const status = error.response.status;
            const message = error.response.data?.message || error.message;
            console.error(`API Error: ${status} - ${message}`);
            throw new Error(`Failed to fetch data: ${status ? `Status ${status}` : 'No response'}`);
        } else {
            console.error('Unexpected Error:', error);
            throw new Error('An unexpected error occurred');
        }
    } finally {

    }
};
