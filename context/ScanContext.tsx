import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  Dispatch,
} from 'react';
import {ScheduledScan} from '../app/constants/Interface';
import {
  addScanLocally,
  deleteScanLocally,
  getScansLocally,
} from '../app/helpers/asyncStorage';
import {deleteNotification} from '../app/services/PushNotificationConfig';
// import { deleteNotification } from '../app/services/PushNotificationConfig';

interface ScanContextType {
  setScanList: (scans: ScheduledScan[]) => void;
  getCompletedScans: () => ScheduledScan[];
  getScheduledScans: () => ScheduledScan[];
  scans: ScheduledScan[];
  initNewScan: boolean;
 setInitNewScan: Dispatch<React.SetStateAction<boolean>>;
  setCheckForScan: Dispatch<React.SetStateAction<boolean>>;
  setupdatedScanList:Dispatch<React.SetStateAction<boolean>>;
  updatedScanList:boolean
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

  useEffect(() => {
    fetchScans();
    console.log("fetch scans")
  }, [updatedScanList]);

  const fetchScans = async () => {
    const scanData = await getScansLocally()
    setScanList(scanData || []);
  };

  const addScan = (scan: ScheduledScan) => {
    setScans(prevScans => [...prevScans, scan]);
    addScanLocally(scan);
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
  };

  const updateScan = (id: string, updatedScan: Partial<ScheduledScan>) => {
    setScans(prevScans =>
      prevScans.map(scan =>
        scan.id === id ? {...scan, ...updatedScan} : scan,
      ),
    );
  };

  const getCompletedScans = () => {
    
    const filteredScans= scans
      .filter(scan => scan.isCompleted === true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log("getCompletedScans Rnning",filteredScans.length)

      return filteredScans
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
        updatedScanList
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
