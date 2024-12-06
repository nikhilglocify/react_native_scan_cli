import { ScheduledScan } from '@/constants/Interface';
import { Scan } from '@/constants/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (item: string, value: any) => {
  try {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(item, stringValue);
  } catch (err: any) {
    // console.error(`Error setting item ${item}`, err);
  }
};

export const getItem = async (item: string) => {
  try {
    const stringValue = await AsyncStorage.getItem(item);
    return stringValue ? JSON.parse(stringValue) : null;
  } catch (err: any) {
    // console.error(`Error getting item ${item}`, err);
    return null;
  }
};

export const addScanLocally = async (value: ScheduledScan) => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    let scans = storedScans ? JSON.parse(storedScans) : [];

    // Ensure `scans` is an array
    if (!Array.isArray(scans)) {
      scans = [];
    }

    scans.push(value); // Push the new object directly

    // Save updated array back to AsyncStorage
    await AsyncStorage.setItem(Scan.scan_list, JSON.stringify(scans));
  } catch (err) {
    console.error(`Error saving scan:`, err);
  }
};



export const getScansLocally = async (): Promise<ScheduledScan[]> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    // console.log("storedScans",storedScans)
    const scans :ScheduledScan= storedScans ? JSON.parse(storedScans) : [];
    // console.log("parsed get scans",scans)

    // Ensure `scans` is an array
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }

    return scans;
  } catch (err) {
    console.error('Error retrieving scans:', err);
    return []; // Return an empty array in case of an error
  }
};

// Delete a scan by index or some unique property
export const deleteScanLocally = async (identifier: string | number): Promise<void> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    let scans = storedScans ? JSON.parse(storedScans) : [];

    // Ensure `scans` is an array
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }

    // Filter out the scan based on a unique property (e.g., id or index)
    scans = scans.filter((scan: ScheduledScan, index: number) =>
      typeof identifier === 'number' ? index !== identifier : scan.id !== identifier
    );

    await AsyncStorage.setItem(Scan.scan_list, JSON.stringify(scans));
  } catch (err) {
    console.error('Error deleting scan:', err);
  }
};


export const getScansHistoryLocally = async (): Promise<ScheduledScan[]> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
   
    const scans :ScheduledScan[]= storedScans ? JSON.parse(storedScans) : [];
console.log("getScansHistoryLocally",scans);
    // Ensure `scans` is an array
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }

    return scans.filter((scan)=>scan.isCompleted==true);
  } catch (err) {
    console.error('Error retrieving scans:', err);
    return []; // Return an empty array in case of an error
  }
};

