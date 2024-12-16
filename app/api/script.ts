import axios from 'axios';
import { Apis, endPoint } from '../constants/Api';

let isFetching = false;

export const getUrlData = async () => {
    if (isFetching) return; // Prevent duplicate calls
    isFetching = true;

    try {
        const requestId = Date.now();
        console.log(`[${requestId}] Starting API call`);

        const response = await axios.get(`${endPoint}/${Apis.getJsonUrl}`);
        console.log(`[${requestId}] Response success`);

        return response.data;
    } catch (error) {
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
        isFetching = false;
    }
};
