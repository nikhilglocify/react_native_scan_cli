import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  Dispatch,
  useRef,
} from 'react';
import {ScheduledScan} from '../app/constants/Interface';
import {
  addScanLocally,
  deleteScanLocally,
  getScansLocally,
} from '../app/helpers/asyncStorage';
import {deleteNotification} from '../app/services/PushNotificationConfig';
import {getUrlData} from '../app/api/script';
import {Alert} from 'react-native';
// import { deleteNotification } from '../app/services/PushNotificationConfig';

interface ScanContextType {
  setScanList: (scans: ScheduledScan[]) => void;
  getCompletedScans: () => ScheduledScan[];
  getScheduledScans: () => ScheduledScan[];
  scans: ScheduledScan[];
  initNewScan: boolean;
  setInitNewScan: Dispatch<React.SetStateAction<boolean>>;
  setCheckForScan: Dispatch<React.SetStateAction<boolean>>;
  setupdatedScanList: Dispatch<React.SetStateAction<boolean>>;
  updatedScanList: boolean;
  checkForScan: boolean;
  addScan: (scan: ScheduledScan) => void;
  removeScan: (id: string, notificationId?: string) => void;
  updateScan: (id: string, updatedScan: Partial<ScheduledScan>) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [scans, setScans] = useState<ScheduledScan[]>([]);
  const [initNewScan, setInitNewScan] = useState(true);
  const [checkForScan, setCheckForScan] = useState(true);
  const [updatedScanList, setupdatedScanList] = useState(false);
  const initialized = useRef(false);
  const [urlData, setUrlData] = useState(false);

  const fetchScriptData = async () => {
    try {
      const data = await getUrlData();
      // setUrlData(data);
    } catch (error) {
      Alert.alert('error fetchScriptData ');
    }
  };

  useEffect(() => {
    console.log('RUNNING USEFECT');
    const initialize = async () => {
      try {
        await Promise.all([fetchScans(), fetchScriptData()]);
        console.log('Initialization completed');
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };
    if (!initialized.current) {
      initialized.current = true;
      initialize();
    }
  }, []);

  const fetchScans = async () => {
    const scanData = await getScansLocally();
    console.log('scanData', scanData.length);
    setScanList(scanData || []);
  };

  const addScan = (scan: ScheduledScan) => {
    setScans(prevScans => [...prevScans, scan]);
    addScanLocally(scan);
    setupdatedScanList(!updatedScanList);
  };

  const setScanList = (scans: ScheduledScan[]) => {
    setScans(scans);
  };

  const removeScan = (id: string, notificationId?: string) => {
    setScans(prevScans => prevScans.filter(scan => scan.id !== id));
    deleteScanLocally(id);
    if (notificationId) {
      deleteNotification(notificationId);
    }
    setupdatedScanList(!updatedScanList);
  };

  const updateScan = (id: string, updatedScan: Partial<ScheduledScan>) => {
    setScans(prevScans =>
      prevScans.map(scan =>
        scan.id === id ? {...scan, ...updatedScan} : scan,
      ),
    );
  };

  const getCompletedScans = () => {
    console.log(
      'getCompletedScans Rnning',
      scans.filter(scan => scan.isCompleted === true).length,
    );
    return scans
      .filter(scan => scan.isCompleted === true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getScheduledScans = () => {
    return scans.filter(scan => scan.isCompleted === false);
  };

  return (
    <ScanContext.Provider
      value={{
        scans,
        addScan,
        removeScan,
        updateScan,
        setScanList,
        getCompletedScans,
        getScheduledScans,
        initNewScan,
        setInitNewScan,
        setCheckForScan,
        checkForScan,
        setupdatedScanList,
        updatedScanList,
      }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = (): ScanContextType => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  return context;
};
