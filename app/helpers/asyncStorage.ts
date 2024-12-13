
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScheduledScan } from '../constants/Interface';
import { Scan } from '../constants/enums';

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


    if (!Array.isArray(scans)) {
      scans = [];
    }

    scans.push(value);


    await AsyncStorage.setItem(Scan.scan_list, JSON.stringify(scans));
  } catch (err) {
    console.error(`Error saving scan:`, err);
  }
};



export const getScansLocally = async (): Promise<ScheduledScan[]> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);

    const scans: ScheduledScan = storedScans ? JSON.parse(storedScans) : [];
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }

    return scans;
  } catch (err) {
    console.error('Error retrieving scans:', err);
    return [];
  }
};


export const deleteScanLocally = async (identifier: string | number): Promise<void> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    let scans = storedScans ? JSON.parse(storedScans) : [];


    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }


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

    const scans: ScheduledScan[] = storedScans ? JSON.parse(storedScans) : [];

    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }

    return scans.filter((scan) => scan.isCompleted == true);
  } catch (err) {
    console.error('Error retrieving scans:', err);
    return [];
  }
};


export const getScanByIdLocally = async (id: string): Promise<ScheduledScan[]> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    // console.log("storedScans saa",storedScans)
    const scans: ScheduledScan = storedScans ? JSON.parse(storedScans) : [];
    //  console.log("storedScans",storedScans)
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }
    const scanFound = scans.filter((scan) => scan.id == id);
    
    return scanFound.length ? scanFound : [];
  } catch (err) {
    console.error('Error retrieving scans:', err);
    return [];
  }
};

export const getScanByNotificationIdLocally = async (id: string): Promise<ScheduledScan[]> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    // console.log("storedScans saa",storedScans)
    const scans: ScheduledScan = storedScans ? JSON.parse(storedScans) : [];
    //  console.log("storedScans",storedScans)
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }
    const scanFound = scans.filter((scan:ScheduledScan) => scan?.notificationId == id);
    
    return scanFound.length ? scanFound : [];
  } catch (err) {
    console.error('Error retrieving scans:', err);
    return [];
  }
};


export const updateScanStatus = async (id: string, urls: string[]): Promise<boolean> => {
  try {
    const storedScans = await AsyncStorage.getItem(Scan.scan_list);
    const scans: ScheduledScan[] = storedScans ? JSON.parse(storedScans) : [];

    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }
    const updatedScans = scans.map((scan) =>
      scan.id === id
        ? { ...scan, isCompleted: true, visitedSites: urls, date: new Date() }
        : scan
    );

    await AsyncStorage.setItem(Scan.scan_list, JSON.stringify(updatedScans));

    return true;
  } catch (err) {
    console.error('Error updating scan status:', err);
    return false;
  }
};


export const updateScannedUrls = async (url: string): Promise<boolean> => {
  try {

    const storedScans = await getItem(Scan.currenScanUrls);
    const scans: string[] = storedScans ? JSON.parse(storedScans) : [];
    if (!Array.isArray(scans)) {
      throw new Error('Stored scans data is corrupted');
    }
    let updatedScans: string[];
    scans.push(url)
    updatedScans = scans
    await setItem(Scan.currenScanUrls, JSON.stringify(updatedScans));
    return true;
  } catch (err) {
    console.error('Error updating scan status:', err);
    return false;
  }
};

export const clearScannedUrls = async () => {
  await setItem(Scan.currenScanUrls, null)
}

