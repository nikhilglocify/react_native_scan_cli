import { createNavigationContainerRef } from '@react-navigation/native';
type RootStackParamList = {
    RunScan: any; // Define the screen and its expected parameters
    // Add other screens here if needed
  };
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
