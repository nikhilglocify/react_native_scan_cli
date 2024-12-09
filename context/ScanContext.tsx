import React, {createContext, useState, useContext, ReactNode} from 'react';
import {ScheduledScan} from '../app/constants/Interface';
import {addScanLocally, deleteScanLocally} from '../app/helpers/asyncStorage';

interface ScanContextType {
  setScanList: (scans: ScheduledScan[]) => void;
  getCompletedScans: () => ScheduledScan[];
  getScheduledScans: () => ScheduledScan[];
  scans: ScheduledScan[];
  initNewScan: boolean;
  setInitNewScan: any;
  setCheckForScan: any;
  checkForScan: boolean;
  addScan: (scan: ScheduledScan) => void;
  removeScan: (id: string) => void;
  updateScan: (id: string, updatedScan: Partial<ScheduledScan>) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [scans, setScans] = useState<ScheduledScan[]>([]);
  const [initNewScan, setInitNewScan] = useState(true);
  const [checkForScan, setCheckForScan] = useState(true);
  const addScan = (scan: ScheduledScan) => {
    setScans(prevScans => [...prevScans, scan]);
    addScanLocally(scan);
  };

  const setScanList = (scans: ScheduledScan[]) => {
    setScans(scans);
  };

  const removeScan = (id: string) => {
    setScans(prevScans => prevScans.filter(scan => scan.id !== id));
    deleteScanLocally(id);
  };

  const updateScan = (id: string, updatedScan: Partial<ScheduledScan>) => {
    setScans(prevScans =>
      prevScans.map(scan =>
        scan.id === id ? {...scan, ...updatedScan} : scan,
      ),
    );
  };

  const getCompletedScans = () => {
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
