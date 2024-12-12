import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  AppState,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import urlData from '../../scripts/scanScript/compilation_array2.json';
import uuid from 'react-native-uuid';
import {useScanContext} from '../../../context/ScanContext';
import {getRandomURLs, getUrls} from '../../helpers';
import {ScheduledScan} from '../../constants/Interface';
import BrowserTabIcon from '../ui/svgIcons/BrowserTabIcon';
import CrossIcon from '../ui/svgIcons/CrossIcon';
import {
  createNotificationChannel,
  scheduleNotification,
} from '../../services/PushNotificationConfig';
import BackIconSvg from '../ui/svgIcons/BackIconSvg';
import {
  clearScannedUrls,
  getItem,
  updateScanStatus,
  updateScannedUrls,
} from '../../helpers/asyncStorage';
import {Scan} from '../../constants/enums';

type scannedWebView = {
  webView: JSX.Element;
  url: string;
  id: string;
};
const RunScan = ({navigation, route}: any) => {
  const isFocused = useIsFocused();
  const [showScannedUrls, setShowScannedUrls] = useState<boolean>(false);
  const [webViews, setWebViews] = useState<scannedWebView[]>([]);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string | null>();
  const [isScanCompleted, setIsScanCompleted] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>();
  const appState = useRef(AppState.currentState);
  const {
    addScan,
    initNewScan,
    setInitNewScan,
    checkForScan,
    setupdatedScanList,
    updatedScanList,
  } = useScanContext();

  const data = route.params;

  const selectedUrls = data?.scanNow
    ? getRandomURLs(urlData.term)
    : getUrls(urlData.term, data?.scanDuration || 5);

  useEffect(() => {
    if (initNewScan && isFocused) {
      runScan(selectedUrls);
    }
  }, [initNewScan, checkForScan]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      if (nextAppState === 'background') {
        console.log('App is in background CLOSED');
        handleAppStateAddScan();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateAddScan = async () => {
    const storedScans = await getItem(Scan.currenScanUrls);
    const currenScanUrls: string[] = storedScans ? JSON.parse(storedScans) : [];
    if (!Array.isArray(currenScanUrls)) {
      console.error('Stored currenScanUrls is corrupted');
      throw new Error('currenScanUrls scans data is corrupted');
    }

    handleExitScan(currenScanUrls);
  };

  const handleExitScan = async (urls?:string[]) => {
    navigation.goBack();
    handleAddScan(urls);
    reset();
    await clearScannedUrls();
  };

  const reset = () => {
    setScannedUrls([]);
    setWebViews([]);
    setCurrentUrl(null);
    setIsScanCompleted(false);
    setSelectedUrl(null);
    setInitNewScan(true);
  };

  const getRenderActiveTab = (url: string) => {
    const defaultWebview = {
      webView: (
        <WebView
          key={url}
          source={{uri: url}}
          style={{flex: 1}}
          startInLoadingState
          onError={e =>
            console.log(`Error loading WebView for URL ${url}:`, e.nativeEvent)
          }
        />
      ),
      url: url,
    };
    const activeTab = webViews.filter(tab => tab.url === url).length
      ? webViews.filter(tab => tab.url === url)[0]
      : defaultWebview;

    return activeTab.webView;
  };

  const runScan = async (selectedUrls: string[]) => {
    let k = 0;
    setInitNewScan(false);

    const visitUrl = async (url: string, index: number) => {
      setTimeout(async () => {
        const webView = (
          <WebView
            key={index}
            source={{uri: url}}
            style={{flex: 1}}
            startInLoadingState
            onLoad={() => {
              console.log(`Page loaded: ${url}`);
            }}
            onError={e =>
              console.log(
                `Error loading WebView for URL ${url}:`,
                e.nativeEvent,
              )
            }
          />
        );
        setCurrentUrl(url);
        await updateScannedUrls(url);
        setScannedUrls(prev => [...prev, url]);
        setWebViews(prev => [...prev, {webView, url, id: uuid.v4()}]);
      }, k);

      setTimeout(() => {
        // setCurrentUrl(null);
      }, k + 2000);
    };

    for (let i = 0; i < selectedUrls.length; i++) {
      const url = selectedUrls[i];
      visitUrl(url, i);

      k += 2200;
    }
  };

  const closeTabUrl = (id: string) => {
    const filteredWebViews = webViews.filter(tab => tab.url !== id);
    const updatedUrls = scannedUrls.filter(url => url !== id);
    setWebViews(filteredWebViews);
    setScannedUrls(updatedUrls);

    if (selectedUrl || currentUrl == id) {
      if (updatedUrls.length) {
        setCurrentUrl(updatedUrls[0]);
        setSelectedUrl(updatedUrls[0]);
      } else {
        setShowScannedUrls(false);
        navigation.goBack();
        reset();
      }
    }
  };

  const handleAddScan = async (urls?:string[]) => {
    console.log("data",data,urls)
    const visitedUrls=urls?.length?urls:scannedUrls
    if (data?.id && !data?.scanNow) {
      console.log("updating the scan")
      await updateScanStatus(data?.id, visitedUrls);
    } else {
      console.log("Adding  the scan")
      const addToScanHistory: ScheduledScan = {
        id: uuid.v4(),
        time: new Date().toISOString(),
        date: new Date(),
        scanDuration: visitedUrls.length,
        isCompleted: true,
        visitedSites:visitedUrls ,
      };
      addScan(addToScanHistory);
    }

    setIsScanCompleted(true);
    setupdatedScanList(!updatedScanList);
  };

  return (
    <View className="flex-1 h-screen mt-[80px] px-4">
      <View className="flex items-center justify-between flex-row mb-4 relative">
        <Pressable
          onPress={() => {
            handleExitScan();
          }}>
          {/* <Text> Back</Text> */}
          <BackIconSvg />
        </Pressable>
        <Text className="text-2xl font-medium flex-grow text-center pr-6">
          Run Scan
        </Text>
        <TouchableOpacity
          className="absolute right-0 p-2 px-2 rounded-lg"
          onPress={() => {
            console.log('onPress...', showScannedUrls);
            if (scannedUrls.length) {
              setShowScannedUrls(!showScannedUrls);
            }
          }}>
          <BrowserTabIcon />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-4">
        {currentUrl ? (
          getRenderActiveTab(selectedUrl ? selectedUrl : currentUrl!)
        ) : (
          <>
            <View className="flex items-center justify-center flex-1">
              <Text className="text-lg text-gray-600">
                Select a Tab to view site
              </Text>
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        className="text-right pb-5 px-2 pt-2"
        onPress={() => handleExitScan()}>
        <Text className="text-[##FF3D3D] bg-[#FFEBEB] shadow-[0_5px_15px_0_rgba(0,0,0,0.8)] text-center px-3 py-3 w-[100px] ml-[auto] rounded-lg    ">
          Exit Scan
        </Text>
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={scannedUrls.length ? showScannedUrls : false}
        onRequestClose={() => setShowScannedUrls(false)}>
        <TouchableWithoutFeedback onPress={() => setShowScannedUrls(false)}>
          <View className="flex justify-start pt-28 items-end h-[100vh] bg-black/30">
            <TouchableWithoutFeedback>
              <View className="bg-gray-100 p-6 rounded-lg w-[200px] max-h-[70vh] min-h-[300px] overflow-y-auto">
                <Text className="text-md font-semibold mb-4">Scanned URLs</Text>
                <ScrollView>
                  {scannedUrls.map((url, index) => {
                    const cleanedUrl = url
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '');

                    const shortenedUrl =
                      cleanedUrl.length > 30
                        ? `${cleanedUrl.slice(0, 27)}...`
                        : cleanedUrl;

                    return (
                      <View key={index} className="flex relative">
                        <Pressable
                          onPress={() => {
                            console.log('url', url);
                            setSelectedUrl(url);
                            setCurrentUrl(url);
                            setShowScannedUrls(false);
                          }}
                          className="py-2 border-b border-gray-200">
                          <Text className="text-base text-blue-500 pr-2 mr-4">
                            {shortenedUrl}
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => closeTabUrl(url)}
                          className="absolute top-3 right-1">
                          <CrossIcon />
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    marginRight: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#6200EE',
    color: '#fff',
  },
  visibleTabButton: {
    backgroundColor: '#4CAF50',
  },
});

export default RunScan;
